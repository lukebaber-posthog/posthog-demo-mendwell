import { LuShuffle } from "react-icons/lu";
import { Button } from "@/components/ui/button";
import type { ClaimData, ClaimField } from "@/lib/claim/steps";
import type { StepProps } from "./step-props";

/** Fills the current step with random, valid answers from `sample`. */
export function FillSampleButton({ sample, update }: { sample: () => Partial<ClaimData>; update: StepProps["update"] }) {
  const fill = () => {
    for (const [field, value] of Object.entries(sample())) update(field as ClaimField, value);
  };
  return (
    <Button type="button" variant="outline" size="sm" data-testid="claim-fill-sample" onClick={fill}>
      <LuShuffle />
      Fill sample
    </Button>
  );
}
