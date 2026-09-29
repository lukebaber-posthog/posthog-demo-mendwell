import Link from "next/link";
import { LuShieldPlus } from "react-icons/lu";
import { BRAND } from "@/lib/brand";

export function Logo() {
  return (
    <Link href="/" aria-label={`${BRAND.name} home`} className="flex items-center gap-2">
      <LuShieldPlus className="size-6 text-forest" />
      <span className="text-xl font-bold tracking-tight">{BRAND.name}</span>
    </Link>
  );
}
