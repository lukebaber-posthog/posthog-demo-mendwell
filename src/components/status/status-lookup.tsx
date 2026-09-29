"use client";

import { useState } from "react";
import { LuSearch } from "react-icons/lu";
import { Field } from "@/components/claim/field";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { EVENTS, track } from "@/lib/analytics/events";
import { isClaimNumber } from "@/lib/claim/claim-number";
import { StatusTimeline } from "./status-timeline";

export function StatusLookup({ initialRef = "" }: { initialRef?: string }) {
  const [value, setValue] = useState(initialRef);
  const [result, setResult] = useState<{ found: boolean; claimNumber: string } | null>(null);

  const lookUp = () => {
    const found = isClaimNumber(value);
    track(EVENTS.CLAIM_STATUS_CHECKED, { found });
    setResult({ found, claimNumber: value.trim().toUpperCase() });
  };

  return (
    <div className="mx-auto flex max-w-xl flex-col gap-8 px-4 pt-20 pb-12">
      <div className="flex flex-col gap-2">
        <h1 className="text-6xl leading-none tracking-[-0.02em]">
          Check a <em>claim.</em>
        </h1>
        <p className="text-muted-foreground">Enter the claim number from your confirmation.</p>
      </div>
      <form
        noValidate
        className="flex flex-col gap-4"
        onSubmit={(e) => {
          e.preventDefault();
          lookUp();
        }}
      >
        <Field
          id="claimNumber"
          label="Claim number"
          error={result && !result.found ? "We couldn't find a claim with that number." : undefined}
        >
          <Input
            id="claimNumber"
            name="claimNumber"
            placeholder="MW-123456"
            value={value}
            onChange={(e) => setValue(e.target.value)}
          />
        </Field>
        <Button type="submit" size="lg" className="self-start" data-testid="status-submit">
          <LuSearch />
          Look up
        </Button>
      </form>
      {result?.found && <StatusTimeline claimNumber={result.claimNumber} />}
    </div>
  );
}
