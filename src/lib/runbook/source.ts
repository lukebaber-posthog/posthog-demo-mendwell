import { readFileSync } from "node:fs";
import { join } from "node:path";

// The runbook has one source: this Markdown file. /runbook reads it at build
// time, so editing the file updates the page and there is nothing to keep in sync.
export const RUNBOOK_FILE = "demo_flows/claims-portal-phase-three.md";

export type RunbookSection = { id: string; title: string; body: string };
export type Runbook = { title: string; intro: string; sections: RunbookSection[] };

const slug = (text: string) =>
  text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

/** Splits the file into the intro (everything above the first `##`) and one section per `##`. */
export function loadRunbook(): Runbook {
  const markdown = readFileSync(join(process.cwd(), RUNBOOK_FILE), "utf8");
  const [head, ...chunks] = markdown.split(/^## /m);

  const title = head.match(/^# (.+)$/m)?.[1].trim() ?? "Runbook";
  const intro = head.replace(/^# .+$/m, "").trim();
  const sections = chunks.map((chunk) => {
    const [heading, ...rest] = chunk.split("\n");
    return { id: slug(heading), title: heading.trim(), body: rest.join("\n").trim() };
  });

  return { title, intro, sections };
}
