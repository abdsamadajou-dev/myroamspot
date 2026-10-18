"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export type NavItem = { label: string; href: string };

// Airbnb-style product tabs: 16px/600 labels with a 2px ink underline on the
// active tab. Only "/" activates the home tab — anchor links (#destinations,
// #aide) live on the hub itself, so they never get the underline.
export function NavTabs({ items }: { items: NavItem[] }) {
  const pathname = usePathname();
  return (
    <nav className="absolute inset-y-0 left-1/2 hidden -translate-x-1/2 items-center gap-8 md:flex">
      {items.map((item) => {
        const active = item.href === "/" && pathname === "/";
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`relative flex h-full items-center text-base font-semibold transition-colors after:absolute after:inset-x-0 after:bottom-3 after:h-0.5 after:rounded-full after:bg-foreground ${
              active ? "text-foreground after:content-['']" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
