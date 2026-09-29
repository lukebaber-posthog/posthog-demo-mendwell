import type { CaptureResult } from "posthog-js";

// Claim numbers ride in the URL (?ref=MW-123456). They aren't needed for
// analytics, so they're stripped from every URL property before the event is sent.
const CLAIM_REF = /([?&]ref=)[^&#]*/g;
const URL_PROPS = ["$current_url", "$referrer", "$prev_pageview_pathname"] as const;

export function redactEvent(event: CaptureResult | null): CaptureResult | null {
  if (!event?.properties) return event;
  for (const key of URL_PROPS) {
    const value = event.properties[key];
    if (typeof value === "string") {
      event.properties[key] = value.replace(CLAIM_REF, "$1[redacted]");
    }
  }
  return event;
}
