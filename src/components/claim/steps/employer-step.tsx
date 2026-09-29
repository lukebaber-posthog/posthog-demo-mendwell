import { Input } from "@/components/ui/input";
import { INDUSTRIES, YES_NO } from "@/lib/claim/options";
import { ChoiceChips } from "../choice-chips";
import { Field } from "../field";
import { StepHeading } from "./step-heading";
import { bind, type StepProps } from "./step-props";

export function EmployerStep(props: StepProps) {
  const { data, errors, update } = props;
  return (
    <>
      <StepHeading title="Your employer" subtitle="We'll let them know a claim has been filed." />
      <Field id="employerName" label="Employer name" error={errors.employerName}>
        <Input autoComplete="organization" {...bind(props, "employerName")} />
      </Field>
      <ChoiceChips
        name="industry"
        label="Industry"
        options={INDUSTRIES}
        value={data.industry}
        error={errors.industry}
        onChange={(v) => update("industry", v)}
      />
      <Field id="supervisorName" label="Supervisor's name (optional)">
        <Input {...bind(props, "supervisorName")} />
      </Field>
      <ChoiceChips
        name="reportedToEmployer"
        label="Have you told your employer about the injury?"
        options={YES_NO}
        value={data.reportedToEmployer}
        error={errors.reportedToEmployer}
        onChange={(v) => update("reportedToEmployer", v)}
      />
    </>
  );
}
