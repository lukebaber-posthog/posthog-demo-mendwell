import posthog from "posthog-js";
import { EVENTS, track } from "@/lib/analytics/events";
import { CLAIM_STEPS, type ClaimData, type ClaimErrors, type ClaimField } from "./steps";

// Every claim-form event goes through here, so the funnel definition in PostHog
// and scripts/demo-data stay in lockstep with what the UI sends.

export const CLAIM_ENTRIES = ["hero", "header", "steps", "banner", "direct"] as const;
export type ClaimEntry = (typeof CLAIM_ENTRIES)[number];

const DAY_MS = 86_400_000;
const stepProps = (index: number) => ({ step_number: index + 1, step: CLAIM_STEPS[index].id });

export function trackClaimStarted(entry: ClaimEntry) {
  track(EVENTS.CLAIM_STARTED, { entry });
}

export function trackStepCompleted(index: number) {
  track(EVENTS.CLAIM_STEP_COMPLETED, stepProps(index));
}

/** One event per failing field, with whether it was left empty or filled in wrong. */
export function trackFieldErrors(index: number, errors: ClaimErrors, data: ClaimData) {
  for (const field of Object.keys(errors) as ClaimField[]) {
    track(EVENTS.CLAIM_FIELD_ERROR, {
      ...stepProps(index),
      field,
      reason: data[field].trim() ? "invalid" : "missing",
    });
  }
}

export function trackClaimSubmitted(data: ClaimData) {
  // Identify by email so the anonymous visit and the claim join into one person.
  const email = data.email.trim().toLowerCase();
  posthog.identify(email, { email, name: `${data.firstName} ${data.lastName}`.trim() });
  track(EVENTS.CLAIM_SUBMITTED, {
    body_part: data.bodyPart,
    injury_type: data.injuryType,
    industry: data.industry,
    missed_work: data.missedWork === "yes",
    reported_to_employer: data.reportedToEmployer === "yes",
    days_since_injury: Math.max(0, Math.floor((Date.now() - new Date(data.injuryDate).getTime()) / DAY_MS)),
  });
}
