import { CLAIM_STEPS } from "@/lib/claim/steps";
import { cn } from "@/lib/utils";

export function StepProgress({ current }: { current: number }) {
  return (
    <div className="flex flex-col gap-3">
      <p className="text-sm font-semibold text-muted-foreground">
        Step {current + 1} of {CLAIM_STEPS.length}
      </p>
      <div className="grid grid-cols-4 gap-1.5">
        {CLAIM_STEPS.map((step, i) => (
          <span
            key={step.id}
            title={step.title}
            className={cn("h-1.5 rounded-full", i <= current ? "bg-forest" : "bg-sand")}
          />
        ))}
      </div>
    </div>
  );
}
