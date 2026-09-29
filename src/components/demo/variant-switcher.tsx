"use client";

import { useEffect, useState } from "react";
import posthog from "posthog-js";
import { useFeatureFlagVariantKey } from "posthog-js/react";
import { LuFlaskConical, LuRotateCcw, LuX } from "react-icons/lu";
import { assignedVariant, overrideVariant } from "@/lib/flag-overrides";
import { useMounted } from "@/lib/use-mounted";
import { FLAGS, PREP_CHECKLIST_VARIANTS } from "@/lib/flags";
import { cn } from "@/lib/utils";

const FLAG = FLAGS.PREP_CHECKLIST;
const VARIANTS = Object.values(PREP_CHECKLIST_VARIANTS);

// Presenter-only control for flipping the checklist experiment between variants
// in this browser. `ph-no-capture` keeps it out of replays and autocapture.
export function VariantSwitcher() {
  const active = useFeatureFlagVariantKey(FLAG);
  const [assigned, setAssigned] = useState<string>();
  const [open, setOpen] = useState(true);
  const mounted = useMounted();

  useEffect(() => posthog.onFeatureFlags(() => setAssigned(assignedVariant(FLAG))), []);

  if (!mounted) return null;

  const overridden = typeof active === "string" && active !== assigned;

  return (
    <div
      className="ph-no-capture fixed inset-x-0 bottom-4 z-50 flex justify-center px-4 duration-500 ease-out animate-in fade-in slide-in-from-bottom-8"
    >
      {open ? (
        <div className="flex items-center gap-3 rounded-2xl bg-ink py-2 pr-2 pl-4 text-sm text-cream shadow-lg">
          <LuFlaskConical className="size-4 shrink-0 text-lavender" />
          <span className="font-semibold whitespace-nowrap">Checklist experiment</span>
          <div className="flex rounded-xl bg-cream/10 p-1">
            {VARIANTS.map((variant) => (
              <button
                key={variant}
                type="button"
                onClick={() => overrideVariant(FLAG, variant === assigned ? null : variant)}
                className={cn(
                  "cursor-pointer rounded-lg px-3 py-1 capitalize transition-colors",
                  active === variant ? "bg-lavender font-semibold text-ink" : "text-cream/80 hover:text-cream",
                )}
              >
                {variant}
                {variant === assigned && <span className="ml-1.5 text-xs opacity-60">(assigned)</span>}
              </button>
            ))}
          </div>
          {overridden && (
            <button
              type="button"
              title="Back to the assigned variant"
              onClick={() => overrideVariant(FLAG, null)}
              className="cursor-pointer rounded-lg p-1.5 text-cream/70 hover:text-cream"
            >
              <LuRotateCcw className="size-4" />
            </button>
          )}
          <button
            type="button"
            title="Hide"
            onClick={() => setOpen(false)}
            className="cursor-pointer rounded-lg p-1.5 text-cream/70 hover:text-cream"
          >
            <LuX className="size-4" />
          </button>
        </div>
      ) : (
        <button
          type="button"
          title="Show the experiment switcher"
          onClick={() => setOpen(true)}
          className="ml-auto cursor-pointer rounded-full bg-ink p-2.5 text-lavender shadow-lg"
        >
          <LuFlaskConical className="size-4" />
        </button>
      )}
    </div>
  );
}
