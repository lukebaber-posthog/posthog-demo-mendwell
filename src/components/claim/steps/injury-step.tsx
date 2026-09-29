import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { BODY_PARTS, INJURY_TYPES, YES_NO } from "@/lib/claim/options";
import { sampleInjury } from "@/lib/claim/sample";
import { ChoiceChips } from "../choice-chips";
import { Field } from "../field";
import { FillSampleButton } from "./fill-sample-button";
import { StepHeading } from "./step-heading";
import { bind, type StepProps } from "./step-props";

export function InjuryStep(props: StepProps) {
  const { data, errors, update } = props;
  return (
    <>
      <StepHeading
        title="Your injury"
        subtitle="Tell us what happened. A few lines is plenty."
        action={<FillSampleButton sample={sampleInjury} update={update} />}
      />
      <Field id="injuryDate" label="Date of injury" error={errors.injuryDate}>
        <Input type="date" {...bind(props, "injuryDate")} />
      </Field>
      <ChoiceChips
        name="bodyPart"
        label="What was hurt?"
        options={BODY_PARTS}
        value={data.bodyPart}
        error={errors.bodyPart}
        onChange={(v) => update("bodyPart", v)}
      />
      <ChoiceChips
        name="injuryType"
        label="Type of injury"
        options={INJURY_TYPES}
        value={data.injuryType}
        error={errors.injuryType}
        onChange={(v) => update("injuryType", v)}
      />
      <Field id="description" label="What happened?" error={errors.description}>
        <Textarea placeholder="I was lifting boxes in the stockroom when..." {...bind(props, "description")} />
      </Field>
      <ChoiceChips
        name="missedWork"
        label="Did you miss any work because of it?"
        options={YES_NO}
        value={data.missedWork}
        error={errors.missedWork}
        onChange={(v) => update("missedWork", v)}
      />
    </>
  );
}
