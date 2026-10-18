import Link from "next/link";
import { getDictionary, t } from "../lib/i18n";

export function SiteHeader() {
  const dict = getDictionary("fr");
  const nav = [
    { label: t(dict, "nav.home"), href: "/" },
    { label: t(dict, "nav.destinations"), href: "/#destinations" },
    { label: t(dict, "nav.help"), href: "/#aide" },
  ];
  return (
    <header className="sticky top-0 z-40 border-b bg-white/90 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4">
        <Link href="/" className="text-lg font-bold tracking-tight">
          MyRoamSpot
        </Link>
        <nav className="flex gap-4 text-sm">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-muted-foreground transition-colors hover:text-foreground"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
