import posthog from "posthog-js";

// Canonical client-side event names. PostHog funnels, the experiment, the dashboard
// and scripts/demo-data all build against these exact strings, so keep them stable.
//
// Privacy rule for every event below: properties carry categories only (body part,
// injury type, industry). Names, health numbers, dates of birth and free-text
// descriptions never leave the browser as event properties.
export const EVENTS = {
  CTA_CLICKED: "cta_clicked",
  CLAIM_STARTED: "claim_started",
  CLAIM_STEP_COMPLETED: "claim_step_completed",
  CLAIM_FIELD_ERROR: "claim_field_error",
  CLAIM_SUBMITTED: "claim_submitted",
  CLAIM_STATUS_CHECKED: "claim_status_checked",
  SERVICE_BANNER_CLICKED: "service_banner_clicked",
} as const;

export type AppEvent = (typeof EVENTS)[keyof typeof EVENTS];

/** Thin client-side wrapper around posthog.capture for app (non-autocaptured) events. */
export function track(event: AppEvent, properties?: Record<string, unknown>) {
  posthog.capture(event, properties);
}
