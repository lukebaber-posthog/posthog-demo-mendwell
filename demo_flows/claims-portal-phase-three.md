# Claims portal demo (RFP phase three, section 1)

Mendwell is a fictional workplace-injury claims portal. It covers the 40% "Demonstrated Capability & Insights" section of the rubric with a single journey: a claimant files a claim, and you follow them through analytics, an experiment and a masked replay.

PostHog project: **Claims Portal Demo** (`636166`, Test Org).

| What | Link |
| --- | --- |
| Dashboard | https://us.posthog.com/project/636166/dashboard/2150479 |
| Experiment | https://us.posthog.com/project/636166/experiments/469321 |
| Banner flag | https://us.posthog.com/project/636166/feature_flags/919743 |
| Replay settings | https://us.posthog.com/project/636166/settings/environment-replay |

## Before the demo

1. Demo from the Vercel deploy, or locally with `bun run build && bun start`, which is steadier than `bun dev`. Add the site's URL to the project's authorized URLs so the toolbar and heatmaps work there.
2. On the experiment page, set the **start date to Sep 15**. The MCP can't do this, and the synthetic history starts Sep 16.
3. Leave `service-alert-banner` **off**. You turn it on live.
4. Optional, the morning of: run `BASE_URL=https://<your deploy> bun run seed:bots` to record ~30 fresh replays.

## 1.1 A user journey, from capture to insight

**Live:** go to `/`, click **Start a claim**, click **Fill sample**, then retype the health number with spaces (`9123 456 789`). Hit **Continue** a few times, then fix it. Use **Fill sample** on the next two steps and submit.

**In PostHog:**
- **Activity**: your events arrive live: `claim_started`, `claim_field_error`, `claim_step_completed`, `claim_submitted`.
- **Person**: the profile has your email. The anonymous visit before submit is merged in, because `identify` runs on submit.
- **Dashboard**:
  - The funnel shows 50% of claimants submit, and step 1 has the biggest drop.
  - Errors by field puts the health number on top.
  - Mobile finishes step 1 less often than desktop.
  - Paths show the whole journey.
- On the funnel, click the step 1 drop-off and choose **View recordings**. This takes you from the number to the people behind it.

## 1.2 An experiment built on that analysis

- **Hypothesis** (on the experiment): claimants get stuck on the health number, so a "what you'll need" checklist before step 1 should raise submissions.
- **Results:**
  - Submissions: control ~45%, test ~57%.
  - Step 1 completion is up and health-number errors per claimant are down.
- **Show the variant:** the checklist is the lavender card above step 1. Use the dark switcher at the bottom of the site to flip between **Control** and **Test**. It marks the variant PostHog actually assigned you, and the reset icon goes back to it. The override only affects your browser, and the switcher is left out of replays.
- **Release toggle with remote config:**
  1. Turn `service-alert-banner` on and refresh the site. The green bar appears.
  2. Edit the payload `message` and refresh again. The copy changes without a deploy.
  3. Optionally, add a release condition, such as mobile only.

## 1.3 Session replay with privacy controls

Open the replay from 1.1, or pick one from the funnel drop-off.

- **Inputs are masked.** All typed values show as asterisks (`maskAllInputs`).
- **Text is masked.** On the review step, the name, date of birth, email and employer render as `***` (`.ph-mask`). The confirmation greeting does too.
- **Elements are blocked.** The health number row on the review step isn't recorded at all (`.ph-no-capture`).
- **Categories stay readable.** Body part and industry are buttons, not inputs, so you can still follow what happened.
- **Nothing sensitive goes into events.** Events only carry categories. `before_send` strips claim numbers out of URLs (`src/lib/analytics/redact.ts`).
- **Project settings:** masking is on here too, network body and header capture is off, retention is 30 days, and the minimum session length is 1s. URL and event triggers and sampling are available as well.
- **Where it lives in code:** `instrumentation-client.ts` (about 10 lines) and `src/components/claim/steps/review-step.tsx`.

## Prompts for PostHog AI (section 2.2)

- "Why are claimants dropping off on step 1 of the claim form?"
- "Summarize sessions where someone hit a health number error"
- "Is the checklist experiment significant? Should we ship it?"
- "Build me an insight of claims submitted by industry for the last two weeks"

## About the data

- **Synthetic history:** 1,600 visitors over Sep 16–29, sent backdated through the batch API (`bun run seed:synthetic`, code in `scripts/demo-data/`). Every event carries `demo_source = synthetic`.
  - Re-running with the same `SEED` resends the same events, which dedupe.
  - A different `SEED` adds a new set of visitors.
- **Real sessions:** the Playwright bots in `scripts/bots/` get real flag variants and record real replays. Path cleaning rules strip the host and query string, so localhost, the deploy and the synthetic data all share the same paths.
