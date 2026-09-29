import { BODY_PARTS, INDUSTRIES, INJURY_TYPES, YES_NO, labelFor } from "@/lib/claim/options";
import type { ClaimData } from "@/lib/claim/steps";
import { StepHeading } from "./step-heading";

// "mask" rows render with `.ph-mask`, so replays show asterisks. The "block"
// row (health number) gets `.ph-no-capture` and is left out of the recording
// entirely. Rows with no privacy setting, like body part and industry, stay readable.
type Row = { label: string; value: string; privacy?: "mask" | "block" };

function Section({ title, rows, onEdit }: { title: string; rows: Row[]; onEdit: () => void }) {
  return (
    <section className="rounded-2xl border border-sand bg-paper p-5">
      <div className="flex items-center justify-between">
        <h2 className="font-sans text-base font-semibold">{title}</h2>
        <button type="button" onClick={onEdit} className="cursor-pointer text-sm font-semibold underline underline-offset-4">
          Edit
        </button>
      </div>
      <dl className="mt-3 flex flex-col gap-2 text-[15px]">
        {rows.map((r) => (
          <div
            key={r.label}
            className={r.privacy === "block" ? "ph-no-capture flex justify-between gap-4" : "flex justify-between gap-4"}
          >
            <dt className="text-muted-foreground">{r.label}</dt>
            <dd className={r.privacy === "mask" ? "ph-mask text-right font-medium" : "text-right font-medium"}>
              {r.value || "Not given"}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

export function ReviewStep({ data, onEdit }: { data: ClaimData; onEdit: (step: number) => void }) {
  return (
    <>
      <StepHeading title="Review and submit" subtitle="Check everything looks right, then send it in." />
      <Section
        title="About you"
        onEdit={() => onEdit(0)}
        rows={[
          { label: "Name", value: `${data.firstName} ${data.lastName}`, privacy: "mask" },
          { label: "Date of birth", value: data.dateOfBirth, privacy: "mask" },
          { label: "Health number", value: data.healthNumber, privacy: "block" },
          { label: "Email", value: data.email, privacy: "mask" },
        ]}
      />
      <Section
        title="Your injury"
        onEdit={() => onEdit(1)}
        rows={[
          { label: "Date", value: data.injuryDate, privacy: "mask" },
          { label: "What was hurt", value: labelFor(BODY_PARTS, data.bodyPart) },
          { label: "Type", value: labelFor(INJURY_TYPES, data.injuryType) },
          { label: "Missed work", value: labelFor(YES_NO, data.missedWork) },
        ]}
      />
      <Section
        title="Your employer"
        onEdit={() => onEdit(2)}
        rows={[
          { label: "Employer", value: data.employerName, privacy: "mask" },
          { label: "Industry", value: labelFor(INDUSTRIES, data.industry) },
          { label: "Told employer", value: labelFor(YES_NO, data.reportedToEmployer) },
        ]}
      />
      <p className="text-sm text-muted-foreground">
        By submitting, you confirm this information is true to the best of your knowledge.
      </p>
    </>
  );
}
