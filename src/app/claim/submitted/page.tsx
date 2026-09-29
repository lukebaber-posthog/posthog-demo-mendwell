import type { Metadata } from "next";
import { ClaimReceived } from "@/components/claim/claim-received";
import { PageShell } from "@/components/site/page-shell";
import { isClaimNumber } from "@/lib/claim/claim-number";

export const metadata: Metadata = { title: "Claim received" };

export default async function ClaimSubmittedPage({
  searchParams,
}: {
  searchParams: Promise<{ ref?: string }>;
}) {
  const { ref } = await searchParams;
  const claimNumber = ref && isClaimNumber(ref) ? ref.toUpperCase() : "Pending";

  return (
    <PageShell>
      <ClaimReceived claimNumber={claimNumber} />
    </PageShell>
  );
}
