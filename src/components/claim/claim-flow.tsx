"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useFeatureFlagVariantKey } from "posthog-js/react";
import { LuArrowLeft, LuArrowRight, LuLock } from "react-icons/lu";
import { Button } from "@/components/ui/button";
import { FLAGS, PREP_CHECKLIST_VARIANTS } from "@/lib/flags";
import {
  type ClaimEntry,
  trackClaimStarted,
  trackClaimSubmitted,
  trackFieldErrors,
  trackStepCompleted,
} from "@/lib/claim/analytics";
import { newClaimNumber, rememberFirstName } from "@/lib/claim/claim-number";
import { CLAIM_STEPS, EMPTY_CLAIM, type ClaimData, type ClaimErrors, type ClaimField } from "@/lib/claim/steps";
import { validateStep } from "@/lib/claim/validation";
import { PrepChecklist } from "./prep-checklist";
import { StepProgress } from "./step-progress";
import { AboutYouStep } from "./steps/about-you-step";
import { EmployerStep } from "./steps/employer-step";
import { InjuryStep } from "./steps/injury-step";
import { ReviewStep } from "./steps/review-step";

export function ClaimFlow({ entry }: { entry: ClaimEntry }) {
  const router = useRouter();
  const [stepIndex, setStepIndex] = useState(0);
  const [data, setData] = useState<ClaimData>(EMPTY_CLAIM);
  const [errors, setErrors] = useState<ClaimErrors>({});
  const [submitting, setSubmitting] = useState(false);

  // Reading the flag here, on every /claim load, is what records the experiment
  // exposure ($feature_flag_called), whichever step the claimant ends up on.
  const checklistVariant = useFeatureFlagVariantKey(FLAGS.PREP_CHECKLIST);

  const started = useRef(false);
  useEffect(() => {
    if (started.current) return;
    started.current = true;
    trackClaimStarted(entry);
  }, [entry]);

  const step = CLAIM_STEPS[stepIndex];
  const isReview = step.id === "review";

  const update = (field: ClaimField, value: string) => {
    setData((d) => ({ ...d, [field]: value }));
    setErrors((e) => (e[field] ? { ...e, [field]: undefined } : e));
  };

  const goTo = (index: number) => {
    setErrors({});
    setStepIndex(index);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const submit = () => {
    setSubmitting(true);
    trackClaimSubmitted(data);
    rememberFirstName(data.firstName);
    router.push(`/claim/submitted?ref=${newClaimNumber()}`);
  };

  const next = () => {
    const found = validateStep(step.id, data);
    if (Object.keys(found).length > 0) {
      setErrors(found);
      trackFieldErrors(stepIndex, found, data);
      document.getElementById(Object.keys(found)[0])?.focus();
      return;
    }
    if (isReview) return submit();
    trackStepCompleted(stepIndex);
    goTo(stepIndex + 1);
  };

  const stepProps = { data, errors, update };

  return (
    <div className="mx-auto flex max-w-xl flex-col gap-8 px-4 pt-16 pb-12">
      <StepProgress current={stepIndex} />
      {stepIndex === 0 && checklistVariant === PREP_CHECKLIST_VARIANTS.TEST && <PrepChecklist />}
      <form
        noValidate
        className="flex flex-col gap-6"
        onSubmit={(e) => {
          e.preventDefault();
          next();
        }}
      >
        {step.id === "about_you" && <AboutYouStep {...stepProps} />}
        {step.id === "injury" && <InjuryStep {...stepProps} />}
        {step.id === "employer" && <EmployerStep {...stepProps} />}
        {isReview && <ReviewStep data={data} onEdit={goTo} />}

        <div className="mt-2 flex items-center justify-between gap-3">
          {stepIndex > 0 ? (
            <Button type="button" variant="ghost" data-testid="claim-back" onClick={() => goTo(stepIndex - 1)}>
              <LuArrowLeft />
              Back
            </Button>
          ) : (
            <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <LuLock className="size-3.5" />
              Your details are private
            </span>
          )}
          <Button type="submit" size="lg" disabled={submitting} data-testid={isReview ? "claim-submit" : "claim-continue"}>
            {isReview ? "Submit claim" : "Continue"}
            {!isReview && <LuArrowRight />}
          </Button>
        </div>
      </form>
    </div>
  );
}
