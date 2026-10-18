import { PACKAGES } from "./packages.seed";
import type { Package } from "./packages.seed";

// Seed-backed now; Plan 2 replaces the body with a Supabase query
// (cached catalog, <100ms package pages) without changing this signature.
export function getPackages(destinationSlug: string): Package[] {
  return PACKAGES.filter((p) => p.active && p.destinationSlug === destinationSlug).sort(
    (a, b) => a.priceCents - b.priceCents,
  );
}
