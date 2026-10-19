"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export type NavItem = { label: string; href: string };

// Apple global-nav links: 12px/400 on-dark labels, quietly spaced. Active
// state is full white; inactive sit at 80% and brighten. Only "/" activates
// the home link — anchor links (#destinations, #aide) live on the hub itself.
// Renders nothing but links; the black bar is painted by the header.
export function NavTabs({ items }: { items: NavItem[] }) {
  const pathname = usePathname();
  return (
    <nav className="flex h-full items-center gap-5">
      {items.map((item) => {
        const active = item.href === "/" && pathname === "/";
        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={active ? "page" : undefined}
            className={`text-xs font-normal transition-colors ${
              active ? "text-white" : "text-white/80 hover:text-white"
            }`}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
