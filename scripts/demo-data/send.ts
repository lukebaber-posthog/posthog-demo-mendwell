// Ships events to PostHog's /batch/ endpoint. `historical_migration` routes them
// through the backfill pipeline, which is what backdated events are meant for.
import { CONFIG } from "./config";
import type { CaptureEvent } from "./journey";

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

async function postBatch(batch: CaptureEvent[]) {
  for (let attempt = 1; ; attempt++) {
    try {
      const res = await fetch(`${CONFIG.posthogHost}/batch/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ api_key: CONFIG.apiKey, historical_migration: true, batch }),
      });
      if (res.ok) return;
      throw new Error(`HTTP ${res.status}: ${(await res.text()).slice(0, 200)}`);
    } catch (err) {
      if (attempt > 3) throw err;
      const backoff = 1000 * 2 ** (attempt - 1);
      console.warn(`  batch failed (attempt ${attempt}), retrying in ${backoff}ms: ${(err as Error).message}`);
      await sleep(backoff);
    }
  }
}

export async function sendEvents(events: CaptureEvent[]) {
  if (!CONFIG.apiKey) throw new Error("NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN is not set");
  const total = Math.ceil(events.length / CONFIG.batchSize);
  for (let i = 0; i < total; i++) {
    const batch = events.slice(i * CONFIG.batchSize, (i + 1) * CONFIG.batchSize);
    await postBatch(batch);
    console.log(`  batch ${i + 1}/${total} sent (${batch.length} events)`);
  }
}
