import { Input } from "@/components/ui/input";
import { Field } from "../field";
import { StepHeading } from "./step-heading";
import { bind, type StepProps } from "./step-props";

export function AboutYouStep(props: StepProps) {
  const { errors } = props;
  return (
    <>
      <StepHeading title="About you" subtitle="We use this to confirm who you are." />
      <div className="grid gap-5 sm:grid-cols-2">
        <Field id="firstName" label="First name" error={errors.firstName}>
          <Input autoComplete="given-name" {...bind(props, "firstName")} />
        </Field>
        <Field id="lastName" label="Last name" error={errors.lastName}>
          <Input autoComplete="family-name" {...bind(props, "lastName")} />
        </Field>
      </div>
      <Field id="dateOfBirth" label="Date of birth" error={errors.dateOfBirth}>
        <Input type="date" {...bind(props, "dateOfBirth")} />
      </Field>
      <Field
        id="healthNumber"
        label="Personal health number"
        hint="You'll find it on your health card."
        error={errors.healthNumber}
      >
        <Input inputMode="numeric" placeholder="9123 456 789" {...bind(props, "healthNumber")} />
      </Field>
      <div className="grid gap-5 sm:grid-cols-2">
        <Field id="email" label="Email" error={errors.email}>
          <Input type="email" autoComplete="email" {...bind(props, "email")} />
        </Field>
        <Field id="phone" label="Phone" error={errors.phone}>
          <Input type="tel" autoComplete="tel" {...bind(props, "phone")} />
        </Field>
      </div>
    </>
  );
}
