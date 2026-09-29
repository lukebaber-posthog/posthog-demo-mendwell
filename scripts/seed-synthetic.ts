/**
 * seed-synthetic.ts — generates a backdated claims-portal dataset (default: 1,600
 * visitors over the last 14 days) and sends it to PostHog in a few seconds. This
 * feeds the funnel, the dashboard and the claim-prep-checklist experiment. Real
 * session replays come from the Playwright bots instead; replays can't be backdated.
 *
 *   DRY_RUN=true bun run scripts/seed-synthetic.ts   # summary + sample, sends nothing
 *   bun run scripts/seed-synthetic.ts                # send for real
 *
 * Tunables live in scripts/demo-data/config.ts. Every event carries
 * demo_source = "synthetic", so it can be filtered out or deleted later.
 */
import { CONFIG } from "./demo-data/config";
import { simulateVisitor, type Journey, type Variant } from "./demo-data/journey";
import { createRng } from "./demo-data/random";
import { sendEvents } from "./demo-data/send";

const pct = (n: number, d: number) => (d ? `${((n / d) * 100).toFixed(1)}%` : "n/a");

function summarize(journeys: Journey[]) {
  const events = journeys.flatMap((j) => j.events);
  const byVariant = (v: Variant) => journeys.filter((j) => j.stats.variant === v);
  const row = (v: Variant) => {
    const js = byVariant(v);
    const submitted = js.filter((j) => j.stats.submitted).length;
    const step1 = js.filter((j) => j.stats.step1Completed).length;
    return { variant: v, exposed: js.length, step1_completed: step1, step1_rate: pct(step1, js.length), submitted, submit_rate: pct(submitted, js.length) };
  };

  const errors: Record<string, number> = {};
  for (const j of journeys) for (const [f, n] of Object.entries(j.stats.fieldErrors)) errors[f] = (errors[f] ?? 0) + n;
  const eventCounts: Record<string, number> = {};
  for (const e of events) eventCounts[e.event] = (eventCounts[e.event] ?? 0) + 1;
  const times = events.map((e) => e.timestamp).sort();

  console.log(`\nVisitors: ${journeys.length}   Events: ${events.length}   Range: ${times[0]} → ${times[times.length - 1]}`);
  console.log("\nExperiment (claim-prep-checklist):");
  console.table([row("control"), row("test")]);
  console.log("Field errors by field:");
  console.table(errors);
  console.log("Events by name:");
  console.table(eventCounts);
}

async function main() {
  const rng = createRng(CONFIG.seed);
  const now = Date.now();
  const journeys = Array.from({ length: CONFIG.visitors }, (_, i) => simulateVisitor(rng, i + 1, now));
  summarize(journeys);

  // Chronological order keeps each person's events in sequence for ingestion.
  const events = journeys.flatMap((j) => j.events).sort((a, b) => a.timestamp.localeCompare(b.timestamp));

  if (CONFIG.dryRun) {
    const sample = journeys.find((j) => j.stats.submitted && Object.keys(j.stats.fieldErrors).length) ?? journeys[0];
    console.log("\nSample journey (submitted after a field error):");
    for (const e of sample.events) console.log(`  ${e.timestamp}  ${e.event.padEnd(22)} ${e.distinct_id}  ${JSON.stringify(pickProps(e.properties))}`);
    console.log("\nDRY_RUN: nothing sent.");
    return;
  }

  console.log(`\nSending ${events.length} events to ${CONFIG.posthogHost} ...`);
  await sendEvents(events);
  console.log("Done. Allow a few minutes for ingestion.");
}

// Only the interesting properties, so the sample stays readable.
function pickProps(p: Record<string, unknown>) {
  const skip = /^\$(lib|geoip|screen|viewport|browser|os|device_id|window_id|session_id|host|current_url|referr|active_feature)/;
  return Object.fromEntries(Object.entries(p).filter(([k]) => !skip.test(k) && k !== "demo_source" && k !== "$set_once"));
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
