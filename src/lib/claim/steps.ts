// The four steps of the claim form, in order. `id` is what analytics events carry
// as the `step` property, so keep these strings stable.
export const CLAIM_STEPS = [
  { id: "about_you", title: "About you" },
  { id: "injury", title: "Your injury" },
  { id: "employer", title: "Your employer" },
  { id: "review", title: "Review" },
] as const;

export type ClaimStepId = (typeof CLAIM_STEPS)[number]["id"];

export type ClaimData = {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  healthNumber: string;
  email: string;
  phone: string;
  injuryDate: string;
  bodyPart: string;
  injuryType: string;
  description: string;
  missedWork: string;
  employerName: string;
  industry: string;
  supervisorName: string;
  reportedToEmployer: string;
};

export const EMPTY_CLAIM: ClaimData = {
  firstName: "",
  lastName: "",
  dateOfBirth: "",
  healthNumber: "",
  email: "",
  phone: "",
  injuryDate: "",
  bodyPart: "",
  injuryType: "",
  description: "",
  missedWork: "",
  employerName: "",
  industry: "",
  supervisorName: "",
  reportedToEmployer: "",
};

export type ClaimField = keyof ClaimData;
export type ClaimErrors = Partial<Record<ClaimField, string>>;
