import type { ChangeEvent } from "react";
import type { ClaimData, ClaimErrors, ClaimField } from "@/lib/claim/steps";

export type StepProps = {
  data: ClaimData;
  errors: ClaimErrors;
  update: (field: ClaimField, value: string) => void;
};

/** Wires a text input or textarea to one claim field, including its error state. */
export function bind({ data, errors, update }: StepProps, field: ClaimField) {
  return {
    id: field,
    name: field,
    value: data[field],
    onChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => update(field, e.target.value),
    "aria-invalid": errors[field] ? true : undefined,
    "aria-describedby": errors[field] ? `${field}-error` : undefined,
  };
}
