// Choice lists for the claim form. `value` lands on analytics events, `label` is shown.
export type Option = { value: string; label: string };

export const BODY_PARTS: Option[] = [
  { value: "back", label: "Back" },
  { value: "shoulder", label: "Shoulder" },
  { value: "hand_wrist", label: "Hand or wrist" },
  { value: "knee", label: "Knee" },
  { value: "head", label: "Head" },
  { value: "other", label: "Other" },
];

export const INJURY_TYPES: Option[] = [
  { value: "strain", label: "Strain or sprain" },
  { value: "cut", label: "Cut" },
  { value: "fracture", label: "Fracture" },
  { value: "burn", label: "Burn" },
  { value: "other", label: "Other" },
];

export const INDUSTRIES: Option[] = [
  { value: "construction", label: "Construction" },
  { value: "healthcare", label: "Healthcare" },
  { value: "retail", label: "Retail" },
  { value: "manufacturing", label: "Manufacturing" },
  { value: "transportation", label: "Transportation" },
  { value: "other", label: "Other" },
];

export const YES_NO: Option[] = [
  { value: "yes", label: "Yes" },
  { value: "no", label: "No" },
];

export function labelFor(options: Option[], value: string) {
  return options.find((o) => o.value === value)?.label ?? value;
}
