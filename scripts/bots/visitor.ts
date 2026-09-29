// One bot visit, start to finish. Each plan is a story you might want to watch
// in replay: a clean claim, a health-number struggle that recovers, one that
// gives up, and a claimant who drops out on the injury step.
import type { Page } from "playwright";
import type { Persona } from "../demo-data/personas";
import {
  continueButton,
  fillAboutYou,
  fillEmployer,
  fillInjury,
  fixHealthNumber,
  hasFieldError,
} from "./claim-form";
import { chance, pause, rageClick, settle, wander } from "./human";

export type Plan = "smooth" | "phn_recovers" | "phn_gives_up" | "quits_on_injury" | "status_only";
export type Outcome = "submitted" | "abandoned_step_1" | "abandoned_step_2" | "checked_status";

const ENTRY_CTAS = ["hero", "hero", "header", "steps"] as const;

async function readVariant(page: Page): Promise<string> {
  await page
    .waitForFunction(() => (window as any).posthog?.getFeatureFlag?.("claim-prep-checklist", { send_event: false }) !== undefined, null, { timeout: 8000 })
    .catch(() => {});
  return page.evaluate(() => String((window as any).posthog?.getFeatureFlag?.("claim-prep-checklist", { send_event: false }) ?? "none"));
}

async function checkStatus(page: Page, claimNumber: string) {
  await page.fill("#claimNumber", claimNumber);
  await pause();
  await page.click("[data-testid=status-submit]");
  await pause(1500, 3000);
}

export async function runVisitor(page: Page, baseUrl: string, persona: Persona, plan: Plan) {
  const landing = chance(0.25) ? "/?utm_source=employer_email&utm_medium=email&utm_campaign=injury_reporting" : "/";
  await page.goto(baseUrl + landing);
  await settle(page);
  await wander(page);

  if (plan === "status_only") {
    await page.click("[data-testid=cta-check_status-hero]");
    await settle(page);
    await checkStatus(page, "MW-12345"); // mistyped first
    await checkStatus(page, `MW-${Math.floor(100000 + Math.random() * 900000)}`);
    return { outcome: "checked_status" as Outcome, variant: "n/a" };
  }

  const cta = ENTRY_CTAS[Math.floor(Math.random() * ENTRY_CTAS.length)];
  if (cta === "steps") await page.locator("#how").scrollIntoViewIfNeeded();
  await pause();
  await page.click(`[data-testid=cta-start_claim-${cta}]`);
  await page.waitForURL("**/claim**");
  await settle(page);
  const variant = await readVariant(page);

  // People who saw the checklist are far less likely to type the number with spaces.
  const spaces = plan === "phn_recovers" || plan === "phn_gives_up" || (plan === "smooth" && variant === "control" && chance(0.2));
  const typed = await fillAboutYou(page, persona, spaces);
  await page.click(continueButton);
  await pause(600, 1200);

  if (await hasFieldError(page, "healthNumber")) {
    await rageClick(page, continueButton);
    if (plan === "phn_gives_up") {
      await page.locator("#healthNumber").click();
      await pause(2500, 5000);
      await page.goto(baseUrl + "/");
      await pause(1500, 3000);
      return { outcome: "abandoned_step_1" as Outcome, variant };
    }
    await fixHealthNumber(page, typed);
    await page.click(continueButton);
    await pause(800, 1500);
  }

  await fillInjury(page, { shortDescription: plan === "quits_on_injury" });
  await page.click(continueButton);
  await pause(800, 1500);
  if (plan === "quits_on_injury") {
    await pause(3000, 6000);
    await page.goto(baseUrl + "/");
    await pause(1500, 3000);
    return { outcome: "abandoned_step_2" as Outcome, variant };
  }

  await fillEmployer(page);
  await page.click(continueButton);
  await pause(2000, 4000); // reading the review
  await page.mouse.wheel(0, 500);
  await pause();
  await page.click("[data-testid=claim-submit]");
  await page.waitForURL("**/claim/submitted**");
  await settle(page);

  if (chance(0.4)) {
    await page.click("[data-testid=cta-check_status-confirmation]");
    await settle(page);
    await page.click("[data-testid=status-submit]"); // claim number is prefilled from the link
    await pause(1500, 3000);
  }
  return { outcome: "submitted" as Outcome, variant };
}
