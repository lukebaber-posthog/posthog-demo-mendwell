import type { Metadata } from "next";
import { Markdown } from "@/components/runbook/markdown";
import { RunbookNav } from "@/components/runbook/runbook-nav";
import { SectionCard } from "@/components/runbook/section-card";
import { RUNBOOK_FILE, loadRunbook } from "@/lib/runbook/source";

// Presenter-only page. Nothing on the site links here, search engines are told to
// skip it, and instrumentation-client.ts keeps PostHog off it so it never shows up
// in the demo data.
export const dynamic = "force-static";
export const metadata: Metadata = { title: "Runbook", robots: { index: false, follow: false } };

export default function RunbookPage() {
  const { title, intro, sections } = loadRunbook();

  return (
    <div className="px-4 py-12 md:py-16">
      <div className="mx-auto max-w-6xl">
        <header className="max-w-3xl">
          <p className="text-xs font-semibold tracking-[0.18em] text-muted-foreground uppercase">Presenter runbook</p>
          <h1 className="mt-4 text-5xl leading-[1.05] tracking-[-0.02em] md:text-6xl">{title}</h1>
          <div className="mt-6 text-[17px]">
            <Markdown>{intro}</Markdown>
          </div>
        </header>

        <div className="mt-12 grid gap-10 lg:grid-cols-[220px_1fr]">
          <RunbookNav sections={sections} />
          <div className="flex min-w-0 flex-col gap-8">
            {sections.map((section) => (
              <SectionCard key={section.id} section={section} />
            ))}
          </div>
        </div>

        <footer className="mt-12 text-sm text-muted-foreground">
          Rendered from <code className="rounded-md bg-sand/70 px-1.5 py-0.5 font-mono">{RUNBOOK_FILE}</code>.
          Edit that file to change this page.
        </footer>
      </div>
    </div>
  );
}
