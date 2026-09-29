import type { ClaimData } from "../steps";
import { digits, isoDaysAgo, pick } from "./random";

const FIRST_NAMES = ["Jordan", "Priya", "Liam", "Mei", "Noah", "Aisha", "Ethan", "Sofia", "Owen", "Harpreet", "Chloe", "Arjun"];
const LAST_NAMES = ["Nguyen", "Singh", "Chen", "Thompson", "Martin", "Wong", "Gill", "Patel", "Campbell", "Tremblay"];
const AREA_CODES = ["604", "778", "250", "236"];

/** Passes validation, including the no-spaces health number. */
export function sampleAboutYou(): Partial<ClaimData> {
  const firstName = pick(FIRST_NAMES);
  const lastName = pick(LAST_NAMES);
  return {
    firstName,
    lastName,
    dateOfBirth: isoDaysAgo(20 * 365, 65 * 365),
    healthNumber: `9${digits(9)}`,
    email: `${firstName}.${lastName}${digits(3)}@example.com`.toLowerCase(),
    phone: `${pick(AREA_CODES)}${digits(7)}`,
  };
}
