import type { Metadata } from "next";
import { ClaimFlow } from "@/components/claim/claim-flow";
import { PageShell } from "@/components/site/page-shell";
import { CLAIM_ENTRIES, type ClaimEntry } from "@/lib/claim/analytics";

export const metadata: Metadata = { title: "Report an injury" };

export default async function ClaimPage({
  searchParams,
}: {
  searchParams: Promise<{ from?: string }>;
}) {
  const { from } = await searchParams;
  const entry = CLAIM_ENTRIES.includes(from as ClaimEntry) ? (from as ClaimEntry) : "direct";

  return (
    <PageShell>
      <ClaimFlow entry={entry} />
    </PageShell>
  );
}
