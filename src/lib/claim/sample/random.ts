// Unseeded helpers for the in-app "Fill sample" buttons.

export const pick = <T>(items: readonly T[]) => items[Math.floor(Math.random() * items.length)];

export const digits = (n: number) => Array.from({ length: n }, () => Math.floor(Math.random() * 10)).join("");

/** ISO date (yyyy-mm-dd) somewhere between `minDays` and `maxDays` ago. */
export function isoDaysAgo(minDays: number, maxDays: number) {
  const days = minDays + Math.random() * (maxDays - minDays);
  return new Date(Date.now() - days * 86_400_000).toISOString().slice(0, 10);
}
