import type { ClaimData, ClaimErrors, ClaimStepId } from "./steps";

// Validation is deliberately strict in one place: the health number must be
// exactly 10 digits with no spaces. Real claimants often type it the way it is
// printed on the card ("9123 456 789"), which fails. That friction is what the
// funnel, the replays and the checklist experiment are built around.
const HEALTH_NUMBER = /^9\d{9}$/;
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE = /^\d{10}$/;

const required = (v: string) => v.trim().length > 0;
const isPast = (v: string) => required(v) && new Date(v) <= new Date();

function aboutYou(d: ClaimData): ClaimErrors {
  const e: ClaimErrors = {};
  if (!required(d.firstName)) e.firstName = "Enter your first name.";
  if (!required(d.lastName)) e.lastName = "Enter your last name.";
  if (!isPast(d.dateOfBirth)) e.dateOfBirth = "Enter your date of birth.";
  if (!HEALTH_NUMBER.test(d.healthNumber))
    e.healthNumber = "Enter a valid 10-digit personal health number.";
  if (!EMAIL.test(d.email)) e.email = "Enter a valid email address.";
  if (!PHONE.test(d.phone.replace(/\D/g, ""))) e.phone = "Enter a 10-digit phone number.";
  return e;
}

function injury(d: ClaimData): ClaimErrors {
  const e: ClaimErrors = {};
  if (!isPast(d.injuryDate)) e.injuryDate = "Enter the date you were injured.";
  if (!required(d.bodyPart)) e.bodyPart = "Choose the part of your body that was hurt.";
  if (!required(d.injuryType)) e.injuryType = "Choose the type of injury.";
  if (d.description.trim().length < 10) e.description = "Tell us a little more about what happened.";
  if (!required(d.missedWork)) e.missedWork = "Let us know if you missed work.";
  return e;
}

function employer(d: ClaimData): ClaimErrors {
  const e: ClaimErrors = {};
  if (!required(d.employerName)) e.employerName = "Enter your employer's name.";
  if (!required(d.industry)) e.industry = "Choose your industry.";
  if (!required(d.reportedToEmployer)) e.reportedToEmployer = "Let us know if you told your employer.";
  return e;
}

const VALIDATORS: Record<ClaimStepId, (d: ClaimData) => ClaimErrors> = {
  about_you: aboutYou,
  injury,
  employer,
  review: () => ({}),
};

export function validateStep(step: ClaimStepId, data: ClaimData): ClaimErrors {
  return VALIDATORS[step](data);
}
