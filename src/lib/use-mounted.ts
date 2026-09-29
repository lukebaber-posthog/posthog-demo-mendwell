import { useEffect, useState } from "react";

/**
 * False during SSR and the first client render, true after. Gate anything that
 * reads feature flags from browser storage on it to avoid hydration mismatches.
 */
export function useMounted() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  return mounted;
}
