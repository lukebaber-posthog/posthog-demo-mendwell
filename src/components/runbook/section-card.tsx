import type { RunbookSection } from "@/lib/runbook/source";
import { displayTitle, themeFor } from "@/lib/runbook/themes";
import { cn } from "@/lib/utils";
import { Markdown } from "./markdown";

export function SectionCard({ section }: { section: RunbookSection }) {
  const theme = themeFor(section.title);
  return (
    <section id={section.id} className="scroll-mt-8 overflow-hidden rounded-3xl border border-sand bg-paper">
      <div className={cn("flex flex-wrap items-center gap-3 px-6 py-5 md:px-8", theme.band)}>
        <span className="rounded-full border border-current/30 px-2.5 py-0.5 text-xs font-semibold tracking-wider uppercase">
          {theme.label}
        </span>
        <h2 className="text-3xl leading-tight md:text-4xl">{displayTitle(section.title)}</h2>
      </div>
      <div className="px-6 py-6 text-[15px] md:px-8">
        <Markdown>{section.body}</Markdown>
      </div>
    </section>
  );
}
