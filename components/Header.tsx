"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { useCart } from "@/lib/cart";
import type { Settings } from "@/lib/types";

const NAV = [
  { href: "/", label: "Accueil" },
  { href: "/boissons", label: "Boissons" },
  { href: "/boissons?cat=Packs", label: "Packs & Promos" },
  { href: "/#livraison", label: "Livraison" },
];

export default function Header({ settings }: { settings: Settings }) {
  const { count, setOpen, ready } = useCart();
  const [menu, setMenu] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [bump, setBump] = useState(0);
  const path = usePathname();

  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 24);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);

  useEffect(() => setMenu(false), [path]);
  useEffect(() => {
    if (count > 0) setBump((b) => b + 1);
  }, [count]);

  if (path.startsWith("/admin")) return null;

  return (
    <header className="sticky top-0 z-40">
      <div className="bg-fire px-4 py-1.5 text-center text-xs font-semibold text-white sm:text-sm">
        {settings.banner}
      </div>
      <div
        className={`transition-all ${
          scrolled ? "bg-night/90 shadow-lg shadow-black/30 backdrop-blur-md" : "bg-night/60 backdrop-blur"
        }`}
      >
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
          <Link href="/" className="group flex items-center gap-2" aria-label="Maguy – accueil">
            <span className="rounded-b-xl bg-ice px-3 pb-1.5 pt-2 font-display text-2xl leading-none text-frost shadow-[0_0_24px_rgba(34,211,238,0.5)] transition group-hover:bg-fire group-hover:text-frost">
              {settings.shopName}
            </span>
            <span className="hidden text-[10px] font-semibold uppercase leading-tight tracking-widest text-ice sm:block">
              Cave
              <br />
              bien glacée
            </span>
          </Link>

          <nav className="hidden items-center gap-1 md:flex" aria-label="Navigation principale">
            {NAV.map((n) => (
              <Link
                key={n.href}
                href={n.href}
                className="rounded-full px-4 py-2 text-sm font-medium text-frost/80 transition hover:bg-frost/10 hover:text-frost"
              >
                {n.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setOpen(true)}
              className="relative flex h-11 items-center gap-2 rounded-full bg-fire px-4 text-sm font-bold text-white shadow-lg shadow-fire/30 transition hover:bg-fire-dark active:scale-95"
              aria-label={`Ouvrir le panier, ${ready ? count : 0} article(s)`}
            >
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <path d="M6 6h15l-1.5 9h-12z" />
                <path d="M6 6 5 3H2" />
                <circle cx="9" cy="20" r="1.4" />
                <circle cx="18" cy="20" r="1.4" />
              </svg>
              <span className="hidden sm:inline">Panier</span>
              <span
                key={bump}
                className={`flex h-6 min-w-6 items-center justify-center rounded-full bg-white px-1.5 text-xs font-extrabold text-fire ${bump > 1 ? "pop" : ""}`}
              >
                {ready ? count : 0}
              </span>
            </button>
            <button
              className="flex h-11 w-11 items-center justify-center rounded-full bg-frost/10 md:hidden"
              onClick={() => setMenu((m) => !m)}
              aria-label="Menu"
              aria-expanded={menu}
            >
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden>
                {menu ? <path d="M6 6l12 12M18 6 6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
              </svg>
            </button>
          </div>
        </div>
        {menu && (
          <nav className="border-t border-frost/10 bg-night px-4 pb-4 md:hidden" aria-label="Menu mobile">
            {NAV.map((n) => (
              <Link
                key={n.href}
                href={n.href}
                className="block border-b border-frost/5 py-3 text-lg font-semibold"
              >
                {n.label}
              </Link>
            ))}
          </nav>
        )}
      </div>
    </header>
  );
}
