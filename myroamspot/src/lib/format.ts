export function formatEur(cents: number): string {
  // Canonicalize narrow no-break spaces (U+202F, used by newer ICU/browser) to
  // no-break spaces (U+00A0) so server and client render the identical string.
  return new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" })
    .format(cents / 100)
    .replace(/\u202f/g, "\u00a0");
}

export function centsFromEuros(eur: number): number {
  return Math.round(eur * 100);
}
