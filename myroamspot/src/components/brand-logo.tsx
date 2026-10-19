// Brand mark + wordmark recreated as vector from the owner's logo artwork
// (SIM silhouette + location pin + signal arcs, "Roam" in Action Blue).
// Vector keeps it crisp at every size and honest on the frosted surfaces —
// the raster original carries a white JPEG box that would break the
// parchment sub-nav. The wordmark stays real text (Inter ≈ the logo's
// grotesque) so it stays selectable, translatable and font-consistent.
export function BrandMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" aria-hidden="true" className={className}>
      {/* SIM body with chamfered top-right corner */}
      <path d="M14 24a6 6 0 0 1 6-6h14l16 16v16a6 6 0 0 1-6 6H20a6 6 0 0 1-6-6z" fill="#1d1d1f" />
      {/* SIM contacts */}
      <rect x="20" y="36" width="12" height="12" rx="2" fill="#ffffff" />
      {/* location pin, tip dropping past the SIM's base */}
      <path d="M38 54c-5-6-12-11.6-12-22.4a12 12 0 1 1 24 0C50 42.4 43 48 38 54z" fill="#0066cc" />
      <circle cx="38" cy="31.5" r="4.5" fill="#ffffff" />
      {/* signal arcs radiating from the pin head */}
      <path d="M40.8 20.4a11 11 0 0 1 7.8 7.8" fill="none" stroke="#0066cc" strokeWidth="4.5" strokeLinecap="round" />
      <path d="M42.3 15.1a16.5 16.5 0 0 1 11.6 11.6" fill="none" stroke="#0066cc" strokeWidth="4.5" strokeLinecap="round" />
    </svg>
  );
}

// "MyRoamSpot" with the Roam syllable in Action Blue, per the logo artwork.
export function BrandWordmark({ className }: { className?: string }) {
  return (
    <span className={className}>
      My<span className="text-primary">Roam</span>Spot
    </span>
  );
}
