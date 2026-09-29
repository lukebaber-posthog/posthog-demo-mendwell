import { BRAND } from "@/lib/brand";

const CLAIM_NUMBER = new RegExp(`^${BRAND.claimPrefix}-\\d{6}$`, "i");

export function newClaimNumber() {
  return `${BRAND.claimPrefix}-${Math.floor(100000 + Math.random() * 900000)}`;
}

/** Status lookups accept any well-formed claim number; there is no claims database. */
export function isClaimNumber(value: string) {
  return CLAIM_NUMBER.test(value.trim());
}

// The confirmation page greets the claimant by first name without putting it in the URL.
const FIRST_NAME_KEY = "mendwell:first-name";

export function rememberFirstName(name: string) {
  try {
    sessionStorage.setItem(FIRST_NAME_KEY, name);
  } catch {}
}

export function recallFirstName() {
  try {
    return sessionStorage.getItem(FIRST_NAME_KEY) ?? "";
  } catch {
    return "";
  }
}
