// Colour per runbook section, matched on the start of its `##` heading.
// Add or rename a section in the Markdown and it falls back to "Notes" until it gets a row here.
export type SectionTheme = { label: string; band: string; dot: string };

const THEMES: [prefix: string, theme: SectionTheme][] = [
  ["Before the demo", { label: "Prep", band: "bg-tangerine text-ink", dot: "bg-tangerine" }],
  ["1.1", { label: "1.1", band: "bg-forest text-cream", dot: "bg-forest" }],
  ["1.2", { label: "1.2", band: "bg-lavender text-ink", dot: "bg-lavender" }],
  ["1.3", { label: "1.3", band: "bg-coral text-ink", dot: "bg-coral" }],
  ["Prompts", { label: "2.2", band: "bg-blush text-ink", dot: "bg-blush" }],
  ["SQL queries", { label: "SQL", band: "bg-ink text-cream", dot: "bg-ink" }],
  ["About the data", { label: "Reference", band: "bg-sand text-ink", dot: "bg-sand" }],
];

const FALLBACK: SectionTheme = { label: "Notes", band: "bg-sand text-ink", dot: "bg-sand" };

export function themeFor(title: string): SectionTheme {
  return THEMES.find(([prefix]) => title.startsWith(prefix))?.[1] ?? FALLBACK;
}

/** "1.1 A user journey" -> "A user journey"; the number already shows as the label. */
export function displayTitle(title: string) {
  return title.replace(/^\d+\.\d+\s+/, "");
}
