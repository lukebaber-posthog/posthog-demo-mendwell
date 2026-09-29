import type { ClaimData } from "../steps";
import { isoDaysAgo, pick } from "./random";

// Body part, injury type and description are picked together so the story holds up on review.
const INJURIES = [
  { bodyPart: "back", injuryType: "strain", description: "Lifting a pallet of boxes in the warehouse and felt a sharp pain in my lower back." },
  { bodyPart: "shoulder", injuryType: "strain", description: "Slipped on a wet floor near the loading dock and landed on my shoulder." },
  { bodyPart: "hand_wrist", injuryType: "cut", description: "Cut my hand on a box cutter while opening a shipment." },
  { bodyPart: "knee", injuryType: "strain", description: "Twisted my knee stepping off a ladder on site." },
  { bodyPart: "hand_wrist", injuryType: "fracture", description: "Caught my wrist in a closing roll-up door and it swelled up badly." },
  { bodyPart: "hand_wrist", injuryType: "burn", description: "Burned my hand on the fryer basket during a busy lunch shift." },
  { bodyPart: "head", injuryType: "other", description: "Hit my head on a low beam in the basement storage room." },
] as const;

export function sampleInjury(): Partial<ClaimData> {
  return {
    injuryDate: isoDaysAgo(1, 30),
    ...pick(INJURIES),
    missedWork: pick(["yes", "no"]),
  };
}
