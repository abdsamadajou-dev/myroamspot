import Link from "next/link";
import { DESTINATION_SLUGS, DESTINATION_LABELS } from "../lib/destinations";

export function DestinationSearch() {
  return (
    <nav aria-label="Destinations" className="grid w-full grid-cols-2 gap-3 sm:grid-cols-3">
      {DESTINATION_SLUGS.map((slug) => (
        <Link
          key={slug}
          href={`/${slug}`}
          className="flex items-center justify-center rounded-xl border bg-white px-4 py-5 text-center text-sm font-medium shadow-sm transition-colors hover:border-foreground/30 hover:bg-accent"
        >
          {DESTINATION_LABELS[slug]}
        </Link>
      ))}
    </nav>
  );
}
