# Mendwell

Mendwell is a fictional workplace-injury claims portal for PostHog demos. A claimant starts a claim, works through a four-step form (about you, injury, employer, review) and submits it. They can check its status later.

It demonstrates:

- **Product analytics:** a claim funnel, form errors by field, drop-off by device, and paths.
- **Experiments:** a "what you'll need" checklist shown before step 1 (flag `claim-prep-checklist`).
- **Feature flags with remote config:** a service banner whose copy comes from the flag payload (`service-alert-banner`).
- **Session replay with privacy controls:** every input is masked, text marked `.ph-mask` is masked, `.ph-no-capture` elements are blocked, and claim numbers are redacted from URLs.

It sends to PostHog project **Claims Portal Demo** (`636166`). The presenter runbook is [`demo_flows/claims-portal-phase-three.md`](demo_flows/claims-portal-phase-three.md). The site also renders it, colour-coded, at `/runbook`, which isn't linked anywhere.

## Run it

```bash
cp .env.example .env.local   # then fill in the PostHog token
bun install
bun dev
```

On Vercel, set the same variables in the project's environment variables.

## Demo data

```bash
npx playwright install chromium   # once, for the bots
bun run seed:synthetic   # two weeks of backdated visitors (funnel, dashboard, experiment)
bun run seed:bots        # real browser sessions for session replay; the app must be running
```

- **Synthetic events** go through the batch API with backdated timestamps, and every one carries `demo_source = synthetic`. Re-running with the same `SEED` resends the same events, which dedupe.
- **The bots** get real flag variants and record real replays. Point them at a deploy with `BASE_URL=https://…`.

## Layout

| Path | What |
| --- | --- |
| `src/app` | Pages: home, `/claim`, `/claim/submitted`, `/status` |
| `src/components/claim` | Claim form: one file per step, plus shared field, chips and progress |
| `src/lib/claim` | Steps, options, validation and claim analytics |
| `src/lib/analytics` | Event names and the `before_send` redaction |
| `src/lib/flags.ts` | Feature flag keys |
| `src/app/runbook`, `src/lib/runbook` | `/runbook`: renders the runbook Markdown at build time |
| `instrumentation-client.ts` | PostHog init, including replay masking |
| `scripts/demo-data` | Synthetic backdated event generator |
| `scripts/bots` | Playwright visitors that record replays |

The brand name lives in `src/lib/brand.ts`.
