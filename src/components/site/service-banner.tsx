"use client";

import Link from "next/link";
import { useFeatureFlagEnabled, useFeatureFlagPayload } from "posthog-js/react";
import { LuChevronRight } from "react-icons/lu";
import { EVENTS, track } from "@/lib/analytics/events";
import { FLAGS, type ServiceBannerPayload } from "@/lib/flags";

// Release toggle driven entirely from PostHog: the flag turns the banner on,
// and its JSON payload supplies the copy, so the text changes without a deploy.
export function ServiceBanner() {
  const enabled = useFeatureFlagEnabled(FLAGS.SERVICE_BANNER);
  const payload = useFeatureFlagPayload(FLAGS.SERVICE_BANNER) as ServiceBannerPayload | undefined;

  if (!enabled || !payload?.message) return null;

  return (
    <div className="bg-forest px-4 py-3 text-center text-[15px] font-semibold text-cream">
      <span>{payload.message}</span>
      {payload.href && payload.linkText && (
        <Link
          href={payload.href}
          data-testid="service-banner-link"
          onClick={() => track(EVENTS.SERVICE_BANNER_CLICKED, { href: payload.href })}
          className="ml-3 inline-flex items-center gap-0.5 whitespace-nowrap underline-offset-4 hover:underline"
        >
          {payload.linkText}
          <LuChevronRight className="size-4" />
        </Link>
      )}
    </div>
  );
}
