// Small helpers that make a bot session look like a person in the replay:
// uneven pauses, typing one key at a time, a bit of scrolling and hovering.
import type { Page } from "playwright";

export const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
export const between = (min: number, max: number) => min + Math.random() * (max - min);
export const chance = (p: number) => Math.random() < p;
export const pause = (min = 400, max = 1400) => sleep(between(min, max));

/** Next.js client navigations land before hydration; controlled inputs typed into then get wiped. */
export async function settle(page: Page) {
  await page.waitForLoadState("networkidle");
  await pause(1200, 1800);
}

export async function type(page: Page, selector: string, text: string) {
  const field = page.locator(selector);
  await field.click();
  await field.pressSequentially(text, { delay: between(55, 140) });
  await pause(250, 700);
}

export async function retype(page: Page, selector: string, text: string) {
  const field = page.locator(selector);
  await field.click({ clickCount: 3 });
  await page.keyboard.press("Backspace");
  await pause(300, 800);
  await field.pressSequentially(text, { delay: between(80, 160) });
}

export async function wander(page: Page) {
  await page.mouse.move(between(200, 900), between(150, 600), { steps: 12 });
  await page.mouse.wheel(0, between(250, 700));
  await pause(700, 1600);
  await page.mouse.wheel(0, -between(150, 500));
  await pause(400, 900);
}

/** Three or more quick clicks in one spot is what PostHog records as a rage click. */
export async function rageClick(page: Page, selector: string, times = 4) {
  const target = page.locator(selector);
  for (let i = 0; i < times; i++) {
    await target.click({ force: true });
    await sleep(between(110, 190));
  }
}
