/**
 * seed-bots.ts: drives real browser sessions through the claims portal so
 * PostHog has genuine session replays (masked inputs, rage clicks, drop-offs)
 * and real feature flag assignments to go with the synthetic history.
 *
 *   bun run seed:bots
 *
 * Env vars (all optional):
 *   BASE_URL     running app            (default http://localhost:3000)
 *   BOT_COUNT    visits to run          (default 30)
 *   CONCURRENCY  parallel browsers      (default 3)
 *   HEADLESS     "false" to watch them  (default headless)
 */
import { chromium } from "playwright";
import { createPersona } from "./demo-data/personas";
import { createRng, weighted } from "./demo-data/random";
import { newVisitorContext, type FormFactor } from "./bots/browser";
import { sleep } from "./bots/human";
import { runVisitor, type Plan } from "./bots/visitor";

const BASE_URL = process.env.BASE_URL ?? "http://localhost:3000";
const BOT_COUNT = parseInt(process.env.BOT_COUNT ?? "30", 10);
const CONCURRENCY = parseInt(process.env.CONCURRENCY ?? "3", 10);
const HEADLESS = process.env.HEADLESS !== "false";

const PLANS: [Plan, number][] = [
  ["smooth", 40],
  ["phn_recovers", 25],
  ["phn_gives_up", 15],
  ["quits_on_injury", 10],
  ["status_only", 10],
];

// Offset keeps bot emails clear of the synthetic visitors' (index < 10000).
const INDEX_OFFSET = 10_000 + Math.floor(Date.now() / 1000) % 10_000;
const rng = createRng(Date.now());

async function main() {
  console.log(`Running ${BOT_COUNT} visits against ${BASE_URL} (${CONCURRENCY} at a time)`);
  const browser = await chromium.launch({ headless: HEADLESS });
  const tally: Record<string, number> = {};
  let next = 0;

  async function worker() {
    while (next < BOT_COUNT) {
      const i = next++;
      const persona = createPersona(rng, INDEX_OFFSET + i);
      const plan = weighted(rng, PLANS);
      const form: FormFactor = persona.device.$device_type === "Desktop" ? "desktop" : "mobile";
      const ctx = await newVisitorContext(browser, form);
      const page = await ctx.newPage();
      try {
        const { outcome, variant } = await runVisitor(page, BASE_URL, persona, plan);
        tally[outcome] = (tally[outcome] ?? 0) + 1;
        console.log(`#${i + 1} ${form} ${plan} -> ${outcome} (variant ${variant})`);
      } catch (err) {
        tally.error = (tally.error ?? 0) + 1;
        const lines = (err as Error).message.split("\n");
        const waitingFor = lines.find((l) => l.includes("waiting for")) ?? "";
        const intercept = lines.find((l) => l.includes("intercepts pointer events")) ?? "";
        console.log(`#${i + 1} ${form} ${plan} -> error: ${lines[0]} ${waitingFor.trim()} ${intercept.trim()}`);
      } finally {
        await sleep(4000); // let the last replay chunk and events flush
        await ctx.close();
      }
    }
  }

  await Promise.all(Array.from({ length: CONCURRENCY }, worker));
  await browser.close();
  console.log("Done:", tally);
}

main();
