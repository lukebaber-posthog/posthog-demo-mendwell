// A Playwright context that PostHog treats as a real visitor.
//
// posthog-js silently drops every event from browsers it thinks are bots, and it
// checks three things: the UA string, navigator.userAgentData.brands (headless
// Chromium reports "HeadlessChrome" there even with a spoofed UA) and
// navigator.webdriver. PostHog's /flags endpoint also returns no flags at all for
// a HeadlessChrome UA, which would hide the experiment. So all three get spoofed.
import type { Browser, BrowserContext } from "playwright";

export type FormFactor = "desktop" | "mobile";

const UA = {
  desktop:
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36",
  mobile:
    "Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Mobile Safari/537.36",
};

export async function newVisitorContext(browser: Browser, form: FormFactor): Promise<BrowserContext> {
  const mobile = form === "mobile";
  const ctx = await browser.newContext({
    userAgent: UA[form],
    viewport: mobile ? { width: 412, height: 860 } : { width: 1440, height: 900 },
    isMobile: mobile,
    hasTouch: mobile,
    locale: "en-CA",
    timezoneId: "America/Vancouver",
  });
  await ctx.addInitScript((isMobile: boolean) => {
    Object.defineProperty(navigator, "webdriver", { get: () => false });
    Object.defineProperty(navigator, "userAgentData", {
      configurable: true,
      get: () => ({
        brands: [
          { brand: "Chromium", version: "130" },
          { brand: "Google Chrome", version: "130" },
          { brand: "Not_A Brand", version: "24" },
        ],
        mobile: isMobile,
        platform: isMobile ? "Android" : "macOS",
      }),
    });
  }, mobile);
  return ctx;
}
