"use client";

import Link from "next/link";
import type { ComponentProps } from "react";
import { EVENTS, track } from "@/lib/analytics/events";

export type CtaName = "start_claim" | "check_status";
export type CtaLocation = "hero" | "header" | "steps" | "banner" | "confirmation";

type CtaLinkProps = ComponentProps<typeof Link> & {
  cta: CtaName;
  location: CtaLocation;
};

// A Link that records which call to action was used and where it sat on the page.
export function CtaLink({ cta, location, onClick, ...props }: CtaLinkProps) {
  return (
    <Link
      data-testid={`cta-${cta}-${location}`}
      onClick={(e) => {
        track(EVENTS.CTA_CLICKED, { cta, location });
        onClick?.(e);
      }}
      {...props}
    />
  );
}
