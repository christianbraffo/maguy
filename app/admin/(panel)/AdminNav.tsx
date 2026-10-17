"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const LINKS = [
  { href: "/admin", label: "Tableau de bord", exact: true },
  { href: "/admin/commandes", label: "Commandes" },
  { href: "/admin/produits", label: "Produits & stocks" },
  { href: "/admin/parametres", label: "Paramètres" },
];

export default function AdminNav({ newCount }: { newCount: number }) {
  const path = usePathname();
  return (
    <nav className="no-scrollbar flex gap-1 overflow-x-auto" aria-label="Navigation admin">
      {LINKS.map((l) => {
        const active = l.exact ? path === l.href : path.startsWith(l.href);
        return (
          <Link
            key={l.href}
            href={l.href}
            className={`flex shrink-0 items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition ${
              active ? "bg-fire text-white" : "text-frost/75 hover:bg-frost/10"
            }`}
          >
            {l.label}
            {l.href === "/admin/commandes" && newCount > 0 && (
              <span className="rounded-full bg-white px-2 text-xs font-extrabold text-fire">{newCount}</span>
            )}
          </Link>
        );
      })}
    </nav>
  );
}
