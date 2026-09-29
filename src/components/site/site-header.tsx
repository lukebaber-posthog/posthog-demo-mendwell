import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CtaLink } from "./cta-link";
import { Logo } from "./logo";

const NAV = [
  { href: "/#how", label: "How it works" },
  { href: "/status", label: "Check a claim" },
];

// Floating, outlined bar in the Wispr style: logo left, links and one CTA right.
export function SiteHeader() {
  return (
    <header className="sticky top-4 z-40 px-4">
      <div className="mx-auto flex max-w-5xl items-center justify-between rounded-2xl border border-sand bg-cream/90 py-2.5 pr-2.5 pl-5 backdrop-blur">
        <Logo />
        <nav className="flex items-center gap-6">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="hidden text-[15px] font-medium text-muted-foreground transition-colors hover:text-ink sm:block"
            >
              {item.label}
            </Link>
          ))}
          <Button asChild>
            <CtaLink cta="start_claim" location="header" href="/claim?from=header">
              Start a claim
            </CtaLink>
          </Button>
        </nav>
      </div>
    </header>
  );
}
