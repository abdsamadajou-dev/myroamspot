// Brand mark + wordmark recreated as vector from the owner's logo artwork
// (SIM silhouette + location pin + signal arcs, "Roam" in Action Blue).
// Vector keeps it crisp at every size and honest on the frosted surfaces —
// the raster original carries a white JPEG box that would break the
// parchment sub-nav. The wordmark stays real text (Inter ≈ the logo's
// grotesque) so it stays selectable, translatable and font-consistent.
//
// Geometry follows the owner's isolated icon: portrait SIM with a chamfered
// TOP-LEFT corner and rounded bottom corners; stepped white contact pad
// (three bars, right-connected); pin-dominant composition where the head
// overhangs the SIM's right edge and the tip drops below its base; two arcs
// concentric with the pin head sweeping from up to right.
export function BrandMark({ className }: { className?: string }) {
  return (
    <svg viewBox="8 5 88 79" aria-hidden="true" className={className}>
      {/* SIM body: portrait, chamfered top-left, rounded bottom corners */}
      <path d="M28 8 H48 V72 a6 6 0 0 1-6 6 H16 a6 6 0 0 1-6-6 V28 Z" fill="#1d1d1f" />
      {/* contact pad: white rect, two dark slots cut from the left, middle bar indented */}
      <rect x="14" y="42" width="15" height="24" rx="2" fill="#ffffff" />
      <rect x="14" y="48" width="15" height="4" fill="#1d1d1f" />
      <rect x="14" y="57" width="15" height="4" fill="#1d1d1f" />
      <rect x="14" y="52" width="9" height="5" fill="#1d1d1f" />
      {/* pin: head center (53,47) r16 overhangs the SIM's right edge, tip drops below */}
      <path d="M53 82 c-6-7-16-14-16-34 a16 16 0 1 1 32 0 C69 68 59 75 53 82 z" fill="#0066cc" />
      <circle cx="53" cy="47" r="7" fill="#ffffff" />
      {/* signal arcs concentric with the pin head, emanating from its upper-right */}
      <path d="M60.52 26.33 A22 22 0 0 1 74.67 43.18" fill="none" stroke="#0066cc" stroke-width="4.5" stroke-linecap="round" />
      <path d="M54.40 7.02 A40 40 0 0 1 92.85 43.51" fill="none" stroke="#0066cc" stroke-width="4.5" stroke-linecap="round" />
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
