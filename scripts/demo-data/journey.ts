// Simulates one visitor's time on the claims portal and returns the PostHog events
// it would have produced, backdated. Rates here are tuned so the dataset tells the
// demo story: step 1 (health number) leaks, the prep checklist plugs most of it.
import { CONFIG, FLAG_KEY } from "./config";
import { chance, randInt, uuidv7, weighted, type Rng } from "./random";
import { createPersona, type Persona } from "./personas";

export type CaptureEvent = {
  event: string;
  distinct_id: string;
  timestamp: string;
  uuid: string;
  properties: Record<string, unknown>;
};

export type Variant = "control" | "test";

export type JourneyStats = {
  variant?: Variant;
  step1Completed: boolean;
  submitted: boolean;
  fieldErrors: Record<string, number>;
};

export type Journey = { events: CaptureEvent[]; stats: JourneyStats };

// ── Funnel rates ─────────────────────────────────────────────────────────────

const RATES = {
  homeStartClaim: 0.68,
  homeCheckStatus: 0.07,
  step1Abandon: { desktop: 0.12, mobile: 0.18 },
  healthNumberError: { control: 0.55, test: 0.18, mobileBump: 0.08 },
  healthNumberRecover: { desktop: 0.55, mobile: 0.45 },
  contactError: 0.08, // each of email / phone
  contactRecover: 0.9,
  step2Abandon: 0.105,
  descriptionError: 0.15,
  descriptionRecover: 0.9,
  bodyPartMissing: 0.05,
  step3Abandon: 0.08,
  employerMissing: 0.06,
  employerRecover: 0.9,
  reviewSubmit: 0.95,
  confirmationCheckStatus: 0.08,
  returnToStatus: 0.35,
};

const STEPS = [
  { number: 1, id: "about_you" },
  { number: 2, id: "injury" },
  { number: 3, id: "employer" },
] as const;

// ── Time sampling (America/Vancouver) ────────────────────────────────────────

const MINUTE = 60_000;
const DAY = 86_400_000;
const WEEKDAY_WEIGHT: Record<string, number> = {
  Mon: 1.25, Tue: 1.2, Wed: 1.05, Thu: 1.0, Fri: 0.9, Sat: 0.42, Sun: 0.38,
};
const HOUR_WEIGHTS = Array.from({ length: 24 }, (_, h) =>
  h < 7 ? 0.12 : h < 8 ? 0.5 : h < 12 ? 1.3 : h < 14 ? 1.0 : h < 17 ? 1.1 : h < 20 ? 0.7 : h < 23 ? 0.45 : 0.2,
);

const localParts = (ms: number) => {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: CONFIG.timezone, year: "numeric", month: "2-digit", day: "2-digit",
    hour: "2-digit", minute: "2-digit", second: "2-digit", weekday: "short", hourCycle: "h23",
  }).formatToParts(new Date(ms));
  const get = (type: string) => parts.find((p) => p.type === type)?.value ?? "";
  return {
    year: +get("year"), month: +get("month"), day: +get("day"),
    hour: +get("hour"), minute: +get("minute"), second: +get("second"), weekday: get("weekday"),
  };
};

/** UTC ms for a wall-clock time in Vancouver. */
function vancouverToUtc(year: number, month: number, day: number, hour: number, minute: number) {
  const guess = Date.UTC(year, month - 1, day, hour, minute);
  const p = localParts(guess);
  const offset = Date.UTC(p.year, p.month - 1, p.day, p.hour, p.minute, p.second) - guess;
  return guess - offset;
}

function sampleVisitStart(rng: Rng, nowMs: number): number {
  const days = Array.from({ length: CONFIG.days }, (_, i) => {
    const p = localParts(nowMs - i * DAY);
    return [p, WEEKDAY_WEIGHT[p.weekday] ?? 1] as const;
  });
  // Resample until the whole visit (and its buffer) sits in the past.
  for (;;) {
    const d = weighted(rng, days);
    const hour = weighted(rng, HOUR_WEIGHTS.map((w, h) => [h, w] as const));
    const ms = vancouverToUtc(d.year, d.month, d.day, hour, randInt(rng, 0, 59)) + randInt(rng, 0, 59_000);
    if (ms < nowMs - 20 * MINUTE) return ms;
  }
}

const secs = (rng: Rng, min: number, max: number) => randInt(rng, min * 1000, max * 1000);

// ── Event builder ────────────────────────────────────────────────────────────

class Visit {
  events: CaptureEvent[] = [];
  distinctId: string;
  readonly deviceId: string;
  variant?: Variant;
  private sessionId = "";
  private windowId = "";
  private path = "/";
  private pageStart = 0;
  private referrer = { $referrer: "$direct", $referring_domain: "$direct" };
  private firstPageview = true;
  t: number;

  constructor(private rng: Rng, readonly persona: Persona, start: number) {
    this.t = start;
    this.deviceId = uuidv7(rng, start);
    this.distinctId = this.deviceId;
  }

  wait(ms: number) {
    this.t += ms;
  }

  startSession(referrer: Persona["referrer"]) {
    this.sessionId = uuidv7(this.rng, this.t);
    this.windowId = uuidv7(this.rng, this.t);
    this.referrer = { $referrer: referrer.$referrer, $referring_domain: referrer.$referring_domain };
  }

  capture(event: string, properties: Record<string, unknown> = {}) {
    const url = `${CONFIG.siteHost}${this.path}`;
    this.events.push({
      event,
      distinct_id: this.distinctId,
      timestamp: new Date(this.t).toISOString(),
      uuid: uuidv7(this.rng, this.t),
      properties: {
        $lib: "web",
        $lib_version: CONFIG.libVersion,
        ...this.persona.device,
        ...this.persona.geo,
        $device_id: this.deviceId,
        $session_id: this.sessionId,
        $window_id: this.windowId,
        $current_url: url,
        $host: new URL(url).host,
        $pathname: this.path,
        ...this.referrer,
        ...(this.variant && {
          [`$feature/${FLAG_KEY}`]: this.variant,
          $active_feature_flags: [FLAG_KEY],
        }),
        demo_source: "synthetic",
        ...properties,
      },
    });
    this.wait(randInt(this.rng, 50, 400));
  }

  pageview(path: string, utm?: Record<string, string>) {
    if (this.pageStart) this.pageleave();
    this.path = path;
    this.pageStart = this.t;
    const setOnce = this.firstPageview
      ? {
          $set_once: {
            $initial_referrer: this.referrer.$referrer,
            $initial_referring_domain: this.referrer.$referring_domain,
            $initial_current_url: `${CONFIG.siteHost}${path}`,
            $initial_pathname: path,
            $initial_device_type: this.persona.device.$device_type,
            $initial_browser: this.persona.device.$browser,
            $initial_os: this.persona.device.$os,
            $initial_geoip_city_name: this.persona.geo.$geoip_city_name,
            ...Object.fromEntries(Object.entries(utm ?? {}).map(([k, v]) => [`$initial_${k}`, v])),
          },
        }
      : {};
    this.firstPageview = false;
    this.capture("$pageview", { ...utm, ...setOnce });
  }

  pageleave() {
    if (!this.pageStart) return;
    this.capture("$pageleave", {
      $prev_pageview_pathname: this.path,
      $prev_pageview_duration: Math.round((this.t - this.pageStart) / 1000),
    });
    this.pageStart = 0;
  }

  identify() {
    const email = this.persona.email;
    const anon = this.distinctId;
    this.distinctId = email;
    this.capture("$identify", {
      $anon_distinct_id: anon,
      $set: { email, name: `${this.persona.firstName} ${this.persona.lastName}` },
    });
  }
}

// ── Journey ──────────────────────────────────────────────────────────────────

export function simulateVisitor(rng: Rng, index: number, nowMs: number): Journey {
  const persona = createPersona(rng, index);
  const visit = new Visit(rng, persona, sampleVisitStart(rng, nowMs));
  const stats: JourneyStats = { step1Completed: false, submitted: false, fieldErrors: {} };
  const mobile = persona.device.$device_type === "Mobile";

  const fieldError = (step: (typeof STEPS)[number], field: string, reason: "missing" | "invalid") => {
    visit.capture("claim_field_error", { step_number: step.number, step: step.id, field, reason });
    stats.fieldErrors[field] = (stats.fieldErrors[field] ?? 0) + 1;
  };

  const checkStatus = (found: boolean) => {
    visit.pageview("/status");
    visit.wait(secs(rng, 8, 30));
    visit.capture("claim_status_checked", { found });
    visit.wait(secs(rng, 5, 25));
    visit.pageleave();
  };

  // Returns true if the visitor made it through the step.
  const runStep1 = (): boolean => {
    const step = STEPS[0];
    visit.wait(secs(rng, 40, 150));
    if (chance(rng, mobile ? RATES.step1Abandon.mobile : RATES.step1Abandon.desktop)) return false;

    const hnP = (visit.variant === "test" ? RATES.healthNumberError.test : RATES.healthNumberError.control)
      + (mobile ? RATES.healthNumberError.mobileBump : 0);
    const hnError = chance(rng, hnP);
    const emailError = chance(rng, RATES.contactError);
    const phoneError = chance(rng, RATES.contactError);
    if (!hnError && !emailError && !phoneError) return true;

    // First Continue click fails on every bad field.
    if (hnError) fieldError(step, "healthNumber", "invalid");
    if (emailError) fieldError(step, "email", "invalid");
    if (phoneError) fieldError(step, "phone", "invalid");

    const recovered =
      (!hnError || chance(rng, mobile ? RATES.healthNumberRecover.mobile : RATES.healthNumberRecover.desktop)) &&
      (!emailError || chance(rng, RATES.contactRecover)) &&
      (!phoneError || chance(rng, RATES.contactRecover));

    // Frustrated retries: the health-number error often fires again before it's fixed.
    if (hnError) {
      const retries = recovered ? weighted(rng, [[0, 55], [1, 30], [2, 15]] as const) : weighted(rng, [[0, 40], [1, 40], [2, 20]] as const);
      for (let i = 0; i < retries; i++) {
        visit.wait(secs(rng, 3, 15));
        fieldError(step, "healthNumber", "invalid");
      }
    }
    visit.wait(secs(rng, 8, 40));
    return recovered;
  };

  const runStep2 = (): boolean => {
    const step = STEPS[1];
    visit.wait(secs(rng, 60, 200));
    if (chance(rng, RATES.step2Abandon)) return false;
    const missingBodyPart = chance(rng, RATES.bodyPartMissing);
    const badDescription = chance(rng, RATES.descriptionError);
    if (missingBodyPart) fieldError(step, "bodyPart", "missing");
    if (badDescription) fieldError(step, "description", "invalid");
    if (badDescription && !chance(rng, RATES.descriptionRecover)) return false;
    if (missingBodyPart || badDescription) visit.wait(secs(rng, 10, 45));
    return true;
  };

  const runStep3 = (): boolean => {
    const step = STEPS[2];
    visit.wait(secs(rng, 30, 90));
    if (chance(rng, RATES.step3Abandon)) return false;
    if (chance(rng, RATES.employerMissing)) {
      fieldError(step, "employerName", "missing");
      if (!chance(rng, RATES.employerRecover)) return false;
      visit.wait(secs(rng, 8, 30));
    }
    return true;
  };

  const runClaim = (entry: string) => {
    visit.pageview("/claim");
    // Alternate by visitor index so the arms stay balanced (no sample-ratio-mismatch warning).
    visit.variant = index % 2 === 0 ? "control" : "test";
    stats.variant = visit.variant;
    visit.capture("$feature_flag_called", { $feature_flag: FLAG_KEY, $feature_flag_response: visit.variant });
    visit.capture("claim_started", { entry });

    const runners = [runStep1, runStep2, runStep3];
    for (let i = 0; i < runners.length; i++) {
      if (!runners[i]()) {
        visit.wait(secs(rng, 2, 20));
        visit.pageleave();
        return;
      }
      visit.capture("claim_step_completed", { step_number: STEPS[i].number, step: STEPS[i].id });
      if (i === 0) stats.step1Completed = true;
    }

    visit.wait(secs(rng, 15, 45));
    if (!chance(rng, RATES.reviewSubmit)) {
      visit.pageleave();
      return;
    }
    const submittedAt = visit.t;
    visit.identify();
    visit.capture("claim_submitted", {
      body_part: weighted(rng, [["back", 30], ["shoulder", 17], ["hand_wrist", 18], ["knee", 13], ["head", 6], ["other", 16]] as const),
      injury_type: weighted(rng, [["strain", 46], ["cut", 17], ["fracture", 11], ["burn", 6], ["other", 20]] as const),
      missed_work: chance(rng, 0.58),
      reported_to_employer: chance(rng, 0.83),
      industry: weighted(rng, [["construction", 24], ["healthcare", 21], ["retail", 16], ["manufacturing", 15], ["transportation", 13], ["other", 11]] as const),
      days_since_injury: weighted(rng, [[0, 22], [1, 26], [2, 16], [3, 11], [5, 9], [7, 8], [14, 5], [30, 3]] as const),
    });
    stats.submitted = true;
    visit.pageview("/claim/submitted");
    visit.wait(secs(rng, 10, 40));
    if (chance(rng, RATES.confirmationCheckStatus)) {
      visit.capture("cta_clicked", { cta: "check_status", location: "confirmation" });
      checkStatus(true);
    } else {
      visit.pageleave();
    }

    // Some claimants come back days later to check progress, already identified.
    if (chance(rng, RATES.returnToStatus)) {
      const back = submittedAt + randInt(rng, 1, 6) * DAY + secs(rng, -4 * 3600, 4 * 3600);
      if (back < nowMs - 10 * MINUTE) {
        visit.t = back;
        visit.startSession({ $referrer: "$direct", $referring_domain: "$direct" });
        checkStatus(true);
      }
    }
  };

  // Landing.
  visit.startSession(persona.referrer);
  const landing = weighted(rng, [["/", 85], ["/claim", 10], ["/status", 5]] as const);
  if (landing === "/claim") {
    runClaim("direct");
  } else if (landing === "/status") {
    visit.pageview("/status", persona.referrer.utm);
    visit.wait(secs(rng, 8, 30));
    visit.capture("claim_status_checked", { found: chance(rng, 0.3) });
    visit.wait(secs(rng, 5, 25));
    visit.pageleave();
  } else {
    visit.pageview("/", persona.referrer.utm);
    visit.wait(secs(rng, 5, 40));
    const r = rng();
    if (r < RATES.homeStartClaim) {
      const location = weighted(rng, [["hero", 70], ["header", 20], ["steps", 10]] as const);
      visit.capture("cta_clicked", { cta: "start_claim", location });
      runClaim(location);
    } else if (r < RATES.homeStartClaim + RATES.homeCheckStatus) {
      visit.capture("cta_clicked", { cta: "check_status", location: "header" });
      checkStatus(chance(rng, 0.25));
    } else {
      visit.pageleave();
    }
  }

  return { events: visit.events, stats };
}

