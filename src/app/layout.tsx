import type { Metadata } from "next";
import "./globals.css";
import { figtree, garamond } from "./fonts";
import { Providers } from "@/components/providers";
import { BRAND } from "@/lib/brand";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: { default: `${BRAND.name} | ${BRAND.tagline}`, template: `%s | ${BRAND.name}` },
  description: "Report a workplace injury online in about five minutes.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={cn(figtree.variable, garamond.variable)}>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
