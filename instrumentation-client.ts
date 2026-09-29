import posthog from "posthog-js";
import { redactEvent } from "@/lib/analytics/redact";

posthog.init(process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN!, {
  api_host: "/ingest",
  ui_host: "https://us.posthog.com",
  defaults: "2026-01-30",
  capture_exceptions: true,
  // Replay privacy. Every input is masked, and any element with `.ph-mask`
  // (for example the claimant's name on the review step) shows as asterisks.
  // Elements with `.ph-no-capture` are left out of the recording entirely.
  // The project's replay settings apply the same rules on the server.
  session_recording: {
    maskAllInputs: true,
    maskTextSelector: ".ph-mask",
  },
  // Last check before an event leaves the browser.
  before_send: redactEvent,
  debug: process.env.NODE_ENV === "development",
});

// Expose the initialized instance on window so you can call posthog.capture(...)
// (and identify/reset/etc.) from the browser DevTools console. npm-module imports
// aren't global by default — only the old script-snippet install sets window.posthog.
if (typeof window !== "undefined") {
  (window as Window & { posthog?: typeof posthog }).posthog = posthog;
}
