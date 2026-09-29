import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { VariantSwitcher } from "../demo/variant-switcher";
import { ServiceBanner } from "./service-banner";
import { SiteFooter } from "./site-footer";
import { SiteHeader } from "./site-header";

// Every page: optional flag-driven banner, floating header, content, footer,
// plus the presenter's experiment switcher.
export function PageShell({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className="flex min-h-screen flex-col">
      <ServiceBanner />
      <SiteHeader />
      <main className={cn("flex-1", className)}>{children}</main>
      <SiteFooter />
      <VariantSwitcher />
    </div>
  );
}
