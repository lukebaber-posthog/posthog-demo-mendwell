import posthog from "posthog-js";

// Local-only flag overrides for the demo switcher. They live in this browser's
// PostHog persistence, survive reloads, and never change the flag in PostHog.

/** The variant PostHog actually assigned this visitor, ignoring any override. */
export function assignedVariant(flag: string): string | undefined {
  const flags = posthog.get_property("$enabled_feature_flags") as Record<string, string | boolean> | undefined;
  const value = flags?.[flag];
  return typeof value === "string" ? value : undefined;
}

/** Force a variant for `flag`, or pass null to go back to the assigned one. */
export function overrideVariant(flag: string, variant: string | null) {
  posthog.featureFlags.overrideFeatureFlags({
    flags: variant ? { [flag]: variant } : false,
    suppressWarning: true,
  });
}
