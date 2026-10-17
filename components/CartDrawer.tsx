"use client";

import Link from "next/link";
import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { useCart } from "@/lib/cart";
import { fcfa } from "@/lib/format";
import type { Settings } from "@/lib/types";
import ProductVisual from "./ProductVisual";

export default function CartDrawer({ settings }: { settings: Settings }) {
  const { open, setOpen, items, subtotal, setQty, remove } = useCart();
  const path = usePathname();

  useEffect(() => setOpen(false), [path, setOpen]);
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, setOpen]);

  const missing = Math.max(0, settings.freeDeliveryFrom - subtotal);
  const pct = Math.min(100, (subtotal / settings.freeDeliveryFrom) * 100);

  return (
    <div className={`fixed inset-0 z-50 ${open ? "" : "pointer-events-none"}`} aria-hidden={!open}>
      <div
        onClick={() => setOpen(false)}
        className={`absolute inset-0 bg-black/70 backdrop-blur-sm transition-opacity ${open ? "opacity-100" : "opacity-0"}`}
      />
      <aside
        role="dialog"
        aria-label="Panier"
        aria-modal="true"
        className={`absolute right-0 top-0 flex h-full w-full max-w-md flex-col bg-night-2 shadow-2xl transition-transform duration-300 ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between border-b border-frost/10 p-4">
          <h2 className="font-display text-2xl">Ton panier</h2>
          <button onClick={() => setOpen(false)} className="flex h-10 w-10 items-center justify-center rounded-full bg-frost/10 hover:bg-frost/20" aria-label="Fermer">
            ✕
          </button>
        </div>

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 p-8 text-center">
            <p className="text-5xl">🧊</p>
            <p className="font-display text-2xl">Ton panier est vide</p>
            <p className="text-sm text-frost/70">Ajoute des boissons bien glacées pour commencer.</p>
            <Link href="/boissons" className="rounded-full bg-fire px-6 py-3 font-bold text-white hover:bg-fire-dark">
              Voir les boissons
            </Link>
          </div>
        ) : (
          <>
            <div className="border-b border-frost/10 p-4">
              <p className="text-xs font-semibold">
                {missing > 0 ? (
                  <>Plus que <span className="text-fire">{fcfa(missing)}</span> pour la livraison offerte 🚚</>
                ) : (
                  <span className="text-emerald-300">🎉 Livraison offerte !</span>
                )}
              </p>
              <div className="mt-2 h-2 overflow-hidden rounded-full bg-frost/10">
                <div className="h-full rounded-full bg-gradient-to-r from-ice to-fire transition-all" style={{ width: `${pct}%` }} />
              </div>
            </div>
            <ul className="flex-1 space-y-3 overflow-y-auto p-4">
              {items.map(({ line, product, format, subtotal: sub }) => (
                <li key={`${line.productId}|${line.format}`} className="glass flex gap-3 rounded-2xl p-3">
                  <div className="flex h-20 w-16 shrink-0 items-end justify-center">
                    <ProductVisual product={product} className="h-full w-auto" />
                  </div>
                  <div className="flex min-w-0 flex-1 flex-col">
                    <p className="truncate font-semibold">{product.name}</p>
                    <p className="text-xs text-frost/60">{format.label} · {fcfa(format.price)}</p>
                    <div className="mt-auto flex items-center justify-between pt-2">
                      <div className="flex items-center gap-1 rounded-full bg-frost/10 p-0.5">
                        <button className="h-8 w-8 rounded-full hover:bg-frost/15" aria-label="Moins" onClick={() => setQty(line.productId, line.format, line.qty - 1)}>−</button>
                        <span className="w-6 text-center text-sm font-bold">{line.qty}</span>
                        <button className="h-8 w-8 rounded-full hover:bg-frost/15 disabled:opacity-30" aria-label="Plus" disabled={line.qty >= format.stock} onClick={() => setQty(line.productId, line.format, line.qty + 1)}>+</button>
                      </div>
                      <p className="font-display text-lg text-fire">{fcfa(sub)}</p>
                    </div>
                  </div>
                  <button onClick={() => remove(line.productId, line.format)} className="self-start text-frost/40 hover:text-red-400" aria-label="Retirer">✕</button>
                </li>
              ))}
            </ul>
            <div className="space-y-3 border-t border-frost/10 p-4">
              <div className="flex items-center justify-between">
                <span className="text-frost/70">Sous-total</span>
                <span className="font-display text-2xl">{fcfa(subtotal)}</span>
              </div>
              {subtotal < settings.minOrder && (
                <p className="text-xs text-gold">Commande minimum : {fcfa(settings.minOrder)}</p>
              )}
              <Link
                href="/commande"
                aria-disabled={subtotal < settings.minOrder}
                className={`block rounded-full bg-fire py-3.5 text-center font-bold text-white shadow-lg shadow-fire/30 transition hover:bg-fire-dark ${subtotal < settings.minOrder ? "pointer-events-none opacity-40" : ""}`}
              >
                Commander →
              </Link>
            </div>
          </>
        )}
      </aside>
    </div>
  );
}
