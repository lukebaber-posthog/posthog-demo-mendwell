"use client";

import type { ReactNode } from "react";
import posthog from "posthog-js";
import { PostHogProvider } from "posthog-js/react";

// posthog is initialised in instrumentation-client.ts before hydration; the
// provider only hands that instance to the React hooks (feature flags).
export function Providers({ children }: { children: ReactNode }) {
  return <PostHogProvider client={posthog}>{children}</PostHogProvider>;
}
