"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { Settings } from "@/lib/types";
import { whatsappLink } from "@/lib/shop";

export default function Footer({ settings }: { settings: Settings }) {
  const path = usePathname();
  if (path.startsWith("/admin")) return null;
  return (
    <footer className="mt-20 border-t border-frost/10 bg-night-2">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-4">
        <div className="md:col-span-2">
          <span className="rounded-b-xl bg-ice px-3 pb-1.5 pt-2 font-display text-3xl leading-none text-frost">
            {settings.shopName}
          </span>
          <p className="mt-4 max-w-sm text-sm text-frost/70">{settings.tagline}. Commande en quelques clics, on te livre bien glacé ou tu passes récupérer à la cave.</p>
          <a
            href={whatsappLink(settings, "Bonjour Maguy 👋")}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-5 inline-flex items-center gap-2 rounded-full bg-[#25d366] px-5 py-2.5 text-sm font-bold text-white transition hover:brightness-110"
          >
            Écrire sur WhatsApp
          </a>
        </div>
        <div>
          <h3 className="font-display text-lg text-ice">Navigation</h3>
          <ul className="mt-3 space-y-2 text-sm text-frost/75">
            <li><Link className="hover:text-frost" href="/">Accueil</Link></li>
            <li><Link className="hover:text-frost" href="/boissons">Toutes les boissons</Link></li>
            <li><Link className="hover:text-frost" href="/boissons?cat=Packs">Packs & promos</Link></li>
            <li><Link className="hover:text-frost" href="/commande">Ma commande</Link></li>
          </ul>
        </div>
        <div>
          <h3 className="font-display text-lg text-ice">Infos</h3>
          <ul className="mt-3 space-y-2 text-sm text-frost/75">
            <li>{settings.address}</li>
            <li>{settings.phone}</li>
            {settings.hours.map((h) => (
              <li key={h.days}>
                {h.days} : {h.open} – {h.close}
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="border-t border-frost/10 px-4 py-5 text-center text-xs text-frost/50">
        L&apos;abus d&apos;alcool est dangereux pour la santé. Vente interdite aux moins de 18 ans. À consommer avec modération.
        <br />© {new Date().getFullYear()} {settings.shopName}. Tous droits réservés.
        <p className="mx-auto mt-3 max-w-3xl text-[11px] leading-relaxed text-frost/35">
          Photos provisoires via Wikimedia Commons : Bock – Erik Cleves Kristensen (CC BY 2.0) ; Castel – Cedric Sanou (CC BY-SA 4.0) ; Heineken – Uttamstef12 (CC BY-SA 3.0) ; Guinness – Pete Verdon (CC BY 2.5) ; Coca-Cola – Ralf Roletschek (domaine public). Détourées pour ce site.
        </p>
      </div>
    </footer>
  );
}
