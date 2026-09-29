import { LuArrowRight, LuCircleCheck, LuClock3 } from "react-icons/lu";
import { Button } from "@/components/ui/button";
import { CtaLink } from "@/components/site/cta-link";

export function Hero() {
  return (
    <section className="px-4 pt-24 pb-24 text-center md:pt-32">
      <p className="text-xs font-semibold tracking-[0.18em] text-muted-foreground uppercase">
        Workplace injury claims
      </p>
      <h1 className="mt-6 text-6xl leading-[0.95] tracking-[-0.03em] md:text-8xl">
        Hurt at work?
        <br />
        <em>We&rsquo;ve got you.</em>
      </h1>
      <p className="mx-auto mt-7 max-w-md text-lg font-medium md:text-xl">
        Report an injury online in about five minutes. No forms to print, no phone queue.
      </p>
      <div className="mt-9 flex flex-wrap justify-center gap-3">
        <Button size="lg" asChild>
          <CtaLink cta="start_claim" location="hero" href="/claim?from=hero">
            Start a claim
            <LuArrowRight />
          </CtaLink>
        </Button>
        <Button size="lg" variant="outline" asChild>
          <CtaLink cta="check_status" location="hero" href="/status">
            Check a claim
          </CtaLink>
        </Button>
      </div>
      <div aria-hidden className="mt-16 flex flex-wrap items-center justify-center gap-3">
        <span className="inline-flex -rotate-2 items-center gap-2 rounded-full bg-forest px-4 py-2 text-sm font-semibold text-cream">
          <LuCircleCheck className="size-4" />
          Claim received
        </span>
        <span className="inline-flex rotate-3 items-center gap-2 rounded-full border border-ink bg-tangerine px-4 py-2 text-sm font-semibold">
          <LuClock3 className="size-4" />
          First decision in 2 days
        </span>
      </div>
    </section>
  );
}
