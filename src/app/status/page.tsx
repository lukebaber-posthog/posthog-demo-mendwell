import type { Metadata } from "next";
import { PageShell } from "@/components/site/page-shell";
import { StatusLookup } from "@/components/status/status-lookup";

export const metadata: Metadata = { title: "Check a claim" };

export default async function StatusPage({
  searchParams,
}: {
  searchParams: Promise<{ ref?: string }>;
}) {
  const { ref } = await searchParams;
  return (
    <PageShell>
      <StatusLookup initialRef={ref ?? ""} />
    </PageShell>
  );
}
