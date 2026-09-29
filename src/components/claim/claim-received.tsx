"use client";

import { useEffect, useState } from "react";
import { LuArrowRight, LuCircleCheck } from "react-icons/lu";
import { Button } from "@/components/ui/button";
import { CtaLink } from "@/components/site/cta-link";
import { recallFirstName } from "@/lib/claim/claim-number";

const NEXT_STEPS = [
  "We review your claim, usually within two business days.",
  "We let your employer know a claim has been filed.",
  "You get a decision by email.",
];

export function ClaimReceived({ claimNumber }: { claimNumber: string }) {
  const [firstName, setFirstName] = useState("");
  useEffect(() => setFirstName(recallFirstName()), []);

  return (
    <div className="mx-auto flex max-w-xl flex-col items-center gap-8 px-4 pt-20 pb-12 text-center">
      <LuCircleCheck className="size-12 text-forest" />
      <div className="flex flex-col gap-3">
        <h1 className="text-6xl leading-none tracking-[-0.02em]">
          Claim <em>received.</em>
        </h1>
        {/* The name is masked in replays like any other personal detail. */}
        <p className="text-lg">
          Thanks{firstName && <>, <span className="ph-mask">{firstName}</span></>}. You&rsquo;re all set.
        </p>
      </div>
      <div className="rounded-2xl border border-ink bg-lavender px-6 py-4">
        <p className="text-sm font-semibold text-ink/70">Your claim number</p>
        <p className="mt-1 text-2xl font-bold tracking-wide" data-testid="claim-number">
          {claimNumber}
        </p>
      </div>
      <ol className="flex w-full flex-col gap-3 text-left">
        {NEXT_STEPS.map((text, i) => (
          <li key={text} className="flex gap-4 rounded-2xl border border-sand bg-paper p-4">
            <span className="font-serif text-2xl leading-none text-forest">{i + 1}</span>
            <span>{text}</span>
          </li>
        ))}
      </ol>
      <Button size="lg" asChild>
        <CtaLink cta="check_status" location="confirmation" href={`/status?ref=${claimNumber}`}>
          Check claim status
          <LuArrowRight />
        </CtaLink>
      </Button>
    </div>
  );
}
