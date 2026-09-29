// Tunables for the synthetic backdated dataset. Every value can be overridden from
// the environment (bun auto-loads .env, which supplies the project token).

const num = (key: string, fallback: number) => {
  const raw = process.env[key];
  const parsed = raw === undefined ? NaN : Number(raw);
  return Number.isFinite(parsed) ? parsed : fallback;
};

export const CONFIG = {
  visitors: num("VISITORS", 1600),
  days: num("DAYS", 14),
  // Seed 1 lands closest to the demo targets (control ~46% submit, test ~58%).
  seed: num("SEED", 1),
  batchSize: num("BATCH_SIZE", 500),
  dryRun: process.env.DRY_RUN === "true" || process.env.DRY_RUN === "1",
  // The site the events claim to come from. Match the host you demo on.
  siteHost: (process.env.SYNTH_HOST ?? "http://localhost:3000").replace(/\/$/, ""),
  posthogHost: (process.env.POSTHOG_INGEST_HOST ?? "https://us.i.posthog.com").replace(/\/$/, ""),
  apiKey: process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN ?? "",
  timezone: "America/Vancouver",
  libVersion: "1.392.0",
} as const;

export const FLAG_KEY = "claim-prep-checklist";
