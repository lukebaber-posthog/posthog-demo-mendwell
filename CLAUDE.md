# Mendwell

Fictional claims portal for PostHog demos. PostHog project `636166` (Claims Portal Demo, Test Org).

## Runbook: one source, two views

- The presenter runbook lives in `demo_flows/claims-portal-phase-three.md`. `/runbook` renders that same file at build time (`src/lib/runbook/source.ts`).
- Never put runbook content in the page code. Any change, whether it was asked for on the page or in the doc, goes into the Markdown file, and both views update.
- Section colours are keyed by the `##` heading's opening words in `src/lib/runbook/themes.ts`. If you add or rename a section, update that map in the same change.
- Keep `/runbook` unlinked, `noindex`, and outside PostHog tracking (the guard is in `instrumentation-client.ts`).
