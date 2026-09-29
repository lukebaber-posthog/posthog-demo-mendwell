import type { IconType } from "react-icons";
import { LuArrowRight, LuBuilding2, LuHeartPulse, LuUserRound } from "react-icons/lu";
import { Button } from "@/components/ui/button";
import { CtaLink } from "@/components/site/cta-link";

const STEPS: { icon: IconType; title: string; body: string }[] = [
  { icon: LuUserRound, title: "Tell us about you", body: "Your name, contact details and health number." },
  { icon: LuHeartPulse, title: "Describe the injury", body: "When it happened and what was hurt." },
  { icon: LuBuilding2, title: "Add your employer", body: "Who you work for and who you told." },
];

export function HowItWorks() {
  return (
    <section id="how" className="mx-4 scroll-mt-28 rounded-[40px] bg-forest px-6 py-20 text-cream md:px-12 md:py-24">
      <h2 className="text-center text-5xl leading-none tracking-[-0.02em] md:text-7xl">
        Three short steps. <em>That&rsquo;s it.</em>
      </h2>
      <ol className="mx-auto mt-14 grid max-w-5xl gap-4 md:grid-cols-3">
        {STEPS.map(({ icon: Icon, title, body }, i) => (
          <li key={title} className="rounded-3xl border border-cream/15 bg-cream/5 p-6">
            <div className="flex items-center justify-between">
              <Icon className="size-6 text-tangerine" />
              <span className="font-serif text-2xl text-cream/50">{i + 1}</span>
            </div>
            <h3 className="mt-8 text-3xl">{title}</h3>
            <p className="mt-2 text-cream/75">{body}</p>
          </li>
        ))}
      </ol>
      <div className="mt-12 flex justify-center">
        <Button size="lg" asChild>
          <CtaLink cta="start_claim" location="steps" href="/claim?from=steps">
            Start a claim
            <LuArrowRight />
          </CtaLink>
        </Button>
      </div>
    </section>
  );
}
