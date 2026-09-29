// Feature flag keys the app reads. These must match the flags in the PostHog project.
export const FLAGS = {
  // Experiment: "test" shows a "what you'll need" checklist above step 1 of the claim form.
  PREP_CHECKLIST: "claim-prep-checklist",
  // Release toggle: shows the green service banner. Its JSON payload supplies the copy.
  SERVICE_BANNER: "service-alert-banner",
} as const;

export const PREP_CHECKLIST_VARIANTS = { CONTROL: "control", TEST: "test" } as const;

export type ServiceBannerPayload = {
  message: string;
  linkText?: string;
  href?: string;
};
