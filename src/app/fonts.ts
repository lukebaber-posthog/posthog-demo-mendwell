import { EB_Garamond, Figtree } from "next/font/google";

// Serif for headings (with italic accents), geometric sans for everything else.
export const garamond = EB_Garamond({
  weight: ["400", "500"],
  style: ["normal", "italic"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-garamond",
});

export const figtree = Figtree({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-figtree",
});
