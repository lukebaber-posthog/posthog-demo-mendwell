import { Hero } from "@/components/home/hero";
import { HowItWorks } from "@/components/home/how-it-works";
import { PageShell } from "@/components/site/page-shell";

export default function Home() {
  return (
    <PageShell>
      <Hero />
      <HowItWorks />
    </PageShell>
  );
}
