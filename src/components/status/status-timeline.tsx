import { LuCheck } from "react-icons/lu";
import { cn } from "@/lib/utils";

const STAGES = ["Received", "In review", "Decision"];
const CURRENT = 1;

export function StatusTimeline({ claimNumber }: { claimNumber: string }) {
  return (
    <div data-testid="status-result" className="rounded-2xl border border-sand bg-paper p-6">
      <div className="flex items-baseline justify-between">
        <p className="font-bold tracking-wide">{claimNumber}</p>
        <span className="rounded-full bg-tangerine px-3 py-1 text-sm font-semibold">In review</span>
      </div>
      <ol className="mt-6 flex flex-col gap-4">
        {STAGES.map((stage, i) => (
          <li key={stage} className="flex items-center gap-3">
            <span
              className={cn(
                "flex size-7 items-center justify-center rounded-full border text-sm font-semibold",
                i < CURRENT && "border-forest bg-forest text-cream",
                i === CURRENT && "border-ink bg-lavender",
                i > CURRENT && "border-sand text-muted-foreground",
              )}
            >
              {i < CURRENT ? <LuCheck className="size-4" /> : i + 1}
            </span>
            <span className={cn("font-medium", i > CURRENT && "text-muted-foreground")}>{stage}</span>
          </li>
        ))}
      </ol>
      <p className="mt-6 text-sm text-muted-foreground">We&rsquo;ll email you as soon as a decision is made.</p>
    </div>
  );
}
