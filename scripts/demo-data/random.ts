// Seeded randomness so a given SEED always produces the same dataset.

export type Rng = () => number;

/** mulberry32: tiny, fast, good enough for demo data. */
export function createRng(seed: number): Rng {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export const chance = (rng: Rng, p: number) => rng() < p;

export const randInt = (rng: Rng, min: number, max: number) =>
  min + Math.floor(rng() * (max - min + 1));

export const pick = <T>(rng: Rng, items: readonly T[]): T =>
  items[Math.floor(rng() * items.length)];

/** Pick from [value, weight] pairs. Weights don't need to sum to 1. */
export function weighted<T>(rng: Rng, entries: readonly (readonly [T, number])[]): T {
  const total = entries.reduce((sum, [, w]) => sum + w, 0);
  let r = rng() * total;
  for (const [value, w] of entries) {
    r -= w;
    if (r <= 0) return value;
  }
  return entries[entries.length - 1][0];
}

const hex = (n: number, width: number) => n.toString(16).padStart(width, "0");

/**
 * UUIDv7 whose embedded 48-bit timestamp is `timestampMs`. PostHog's sessions table
 * reads session start from the $session_id itself, so backdated sessions need this.
 */
export function uuidv7(rng: Rng, timestampMs: number): string {
  const ms = Math.floor(timestampMs);
  const high = Math.floor(ms / 2 ** 16); // top 32 bits of the 48-bit timestamp
  const low = ms % 2 ** 16; // bottom 16 bits
  const randA = randInt(rng, 0, 0xfff); // 12 bits after the version nibble
  const variant = 0x8000 | randInt(rng, 0, 0x3fff); // 10xx xxxx xxxx xxxx
  const tail = hex(randInt(rng, 0, 0xffffff), 6) + hex(randInt(rng, 0, 0xffffff), 6);
  return `${hex(high, 8)}-${hex(low, 4)}-7${hex(randA, 3)}-${hex(variant, 4)}-${tail}`;
}
