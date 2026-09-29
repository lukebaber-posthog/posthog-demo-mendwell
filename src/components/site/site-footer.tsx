import { BRAND } from "@/lib/brand";

export function SiteFooter() {
  return (
    <footer className="px-4 py-10 text-center text-sm text-muted-foreground">
      {BRAND.name} is a fictional service built for a product demo.
    </footer>
  );
}
