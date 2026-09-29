import type { ClaimData } from "../steps";
import { pick } from "./random";

const EMPLOYERS = [
  { employerName: "Harbourline Logistics", industry: "transportation" },
  { employerName: "Coastal Build Co.", industry: "construction" },
  { employerName: "Fraser Valley Foods", industry: "manufacturing" },
  { employerName: "North Shore Health", industry: "healthcare" },
  { employerName: "Pacific Rim Retail", industry: "retail" },
  { employerName: "Cedar Ridge Manufacturing", industry: "manufacturing" },
] as const;

const SUPERVISORS = ["Dana Fraser", "Mike Ostrowski", "Rena Bhatt", "Tom Leblanc", "Grace Oduya"];

export function sampleEmployer(): Partial<ClaimData> {
  return {
    ...pick(EMPLOYERS),
    supervisorName: pick(SUPERVISORS),
    reportedToEmployer: pick(["yes", "no"]),
  };
}
