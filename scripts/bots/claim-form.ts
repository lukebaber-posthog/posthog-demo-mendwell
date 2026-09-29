// Drives each step of the /claim form. Selectors are the field ids and
// data-testids from src/components/claim.
import type { Page } from "playwright";
import type { Persona } from "../demo-data/personas";
import { between, chance, pause, retype, type } from "./human";

const EMPLOYERS = [
  "Harbourline Logistics",
  "Coastal Build Co.",
  "Fraser Valley Foods",
  "North Shore Health",
  "Pacific Rim Retail",
  "Cedar Ridge Manufacturing",
];

const DESCRIPTIONS = [
  "Lifting a pallet of boxes in the warehouse and felt a sharp pain in my lower back.",
  "Slipped on a wet floor near the loading dock and landed on my shoulder.",
  "Cut my hand on a box cutter while opening a shipment.",
  "Twisted my knee stepping off a ladder on site.",
];

const pickOne = <T>(items: T[]) => items[Math.floor(Math.random() * items.length)];
const digits = (n: number) => Array.from({ length: n }, () => Math.floor(Math.random() * 10)).join("");
const isoDaysAgo = (days: number) => new Date(Date.now() - days * 86_400_000).toISOString().slice(0, 10);

export function healthNumber(withSpaces: boolean) {
  const n = `9${digits(9)}`;
  return withSpaces ? `${n.slice(0, 4)} ${n.slice(4, 7)} ${n.slice(7)}` : n;
}

export const continueButton = "[data-testid=claim-continue]";

export async function hasFieldError(page: Page, field: string) {
  return page.locator(`#${field}-error`).isVisible();
}

/** Step 1. Returns the health number typed, so a later retry can fix it. */
export async function fillAboutYou(page: Page, persona: Persona, phnWithSpaces: boolean) {
  await type(page, "#firstName", persona.firstName);
  await type(page, "#lastName", persona.lastName);
  await page.fill("#dateOfBirth", isoDaysAgo(Math.round(between(22, 58) * 365)));
  await pause();
  const phn = healthNumber(phnWithSpaces);
  await type(page, "#healthNumber", phn);
  await type(page, "#email", persona.email);
  await type(page, "#phone", `604${digits(7)}`);
  return phn;
}

export async function fixHealthNumber(page: Page, typed: string) {
  await pause(1500, 3500); // reading the error
  await retype(page, "#healthNumber", typed.replace(/\s/g, ""));
}

export async function fillInjury(page: Page, opts: { shortDescription?: boolean } = {}) {
  await page.fill("#injuryDate", isoDaysAgo(Math.round(between(0, 20))));
  await pause();
  await page.click(`[data-testid=chip-bodyPart-${pickOne(["back", "shoulder", "hand_wrist", "knee"])}]`);
  await pause();
  await page.click(`[data-testid=chip-injuryType-${pickOne(["strain", "cut", "strain", "fracture"])}]`);
  await pause();
  await type(page, "#description", opts.shortDescription ? "Hurt it" : pickOne(DESCRIPTIONS));
  await page.click(`[data-testid=chip-missedWork-${chance(0.6) ? "yes" : "no"}]`);
  await pause();
}

export async function fillEmployer(page: Page) {
  await type(page, "#employerName", pickOne(EMPLOYERS));
  await page.click(`[data-testid=chip-industry-${pickOne(["construction", "healthcare", "retail", "manufacturing", "transportation"])}]`);
  await pause();
  if (chance(0.6)) await type(page, "#supervisorName", pickOne(["Dana", "Chris", "Pat", "Alex"]));
  await page.click(`[data-testid=chip-reportedToEmployer-${chance(0.8) ? "yes" : "no"}]`);
  await pause();
}
