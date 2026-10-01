import type { RunbookSection } from "@/lib/runbook/source";
import { displayTitle, themeFor } from "@/lib/runbook/themes";
import { cn } from "@/lib/utils";

export function RunbookNav({ sections }: { sections: RunbookSection[] }) {
  return (
    <nav aria-label="Runbook sections" className="sticky top-8 hidden self-start lg:block">
      <p className="mb-3 text-xs font-semibold tracking-[0.18em] text-muted-foreground uppercase">On this page</p>
      <ol className="flex flex-col gap-1">
        {sections.map((s) => {
          const theme = themeFor(s.title);
          return (
            <li key={s.id}>
              <a
                href={`#${s.id}`}
                className="flex items-start gap-2.5 rounded-lg px-2 py-1.5 text-sm font-medium hover:bg-sand/50"
              >
                <span className={cn("mt-1.5 size-2.5 shrink-0 rounded-full border border-ink/20", theme.dot)} />
                <span>{displayTitle(s.title)}</span>
              </a>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
