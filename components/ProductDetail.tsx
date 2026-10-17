"use client";

import Link from "next/link";
import { useState } from "react";
import { useCart } from "@/lib/cart";
import { fcfa } from "@/lib/format";
import type { Product } from "@/lib/types";
import { ALCOHOL_CATEGORIES } from "@/lib/types";
import ProductVisual from "./ProductVisual";

export default function ProductDetail({ product }: { product: Product }) {
  const { add, setOpen } = useCart();
  const first = Math.max(product.formats.findIndex((f) => f.stock > 0), 0);
  const [idx, setIdx] = useState(first);
  const [qty, setQty] = useState(1);
  const f = product.formats[idx];
  const available = f.stock > 0;
  const showOld = product.oldPrice > f.price && idx === 0;

  return (
    <div className="grid gap-10 lg:grid-cols-2">
      <div className="bg-frost-glow relative flex min-h-[420px] items-end justify-center overflow-hidden rounded-[2rem] border border-frost/10 p-10">
        <ProductVisual product={product} priority className="h-[26rem] w-auto" />
        {product.badge && (
          <span className="absolute left-5 top-5 rounded-full bg-fire px-4 py-1.5 text-xs font-extrabold uppercase text-white">{product.badge}</span>
        )}
      </div>

      <div>
        <Link href="/boissons" className="text-sm text-ice hover:underline">← Retour aux boissons</Link>
        <p className="mt-4 text-xs font-semibold uppercase tracking-widest text-ice">{product.brand} · {product.category}</p>
        <h1 className="font-display text-5xl sm:text-6xl">{product.name}</h1>
        <p className="mt-4 text-lg text-frost/80">{product.description}</p>

        <div className="mt-6">
          <p className="mb-2 text-sm font-semibold text-frost/70">Format</p>
          <div className="flex flex-wrap gap-2" role="radiogroup" aria-label="Format">
            {product.formats.map((fm, i) => (
              <button
                key={fm.label}
                role="radio"
                aria-checked={i === idx}
                disabled={fm.stock <= 0}
                onClick={() => { setIdx(i); setQty(1); }}
                className={`rounded-full border px-5 py-2.5 text-sm font-bold transition ${
                  i === idx ? "border-ice bg-ice text-frost" : "border-frost/20 hover:border-ice"
                } disabled:opacity-30 disabled:line-through`}
              >
                {fm.label} · {fcfa(fm.price)}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-6 flex items-end gap-4">
          <p className="font-display text-5xl text-fire">{fcfa(f.price)}</p>
          {showOld && <p className="pb-1 text-frost/50 line-through">{fcfa(product.oldPrice)}</p>}
        </div>
        <p className="mt-1 text-sm">
          {available ? (f.stock <= 10 ? <span className="text-gold">Plus que {f.stock} en stock !</span> : <span className="text-emerald-300">En stock</span>) : <span className="text-red-400">Rupture de stock</span>}
        </p>

        <div className="mt-6 flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1 rounded-full bg-frost/10 p-1">
            <button className="h-11 w-11 rounded-full text-xl hover:bg-frost/15" aria-label="Moins" onClick={() => setQty((q) => Math.max(1, q - 1))}>−</button>
            <span className="w-8 text-center font-bold" aria-live="polite">{qty}</span>
            <button className="h-11 w-11 rounded-full text-xl hover:bg-frost/15 disabled:opacity-30" aria-label="Plus" disabled={qty >= f.stock} onClick={() => setQty((q) => Math.min(f.stock, q + 1))}>+</button>
          </div>
          <button
            disabled={!available}
            onClick={() => { add(product.id, f.label, qty); setOpen(true); }}
            className="flex-1 rounded-full bg-fire px-8 py-4 text-base font-extrabold text-white shadow-lg shadow-fire/30 transition hover:bg-fire-dark active:scale-95 disabled:bg-frost/10 disabled:text-frost/40 sm:flex-none"
          >
            Ajouter · {fcfa(f.price * qty)}
          </button>
        </div>

        <ul className="mt-8 grid gap-3 text-sm text-frost/75 sm:grid-cols-3">
          <li className="glass rounded-2xl p-3">❄️ Servi bien glacé</li>
          <li className="glass rounded-2xl p-3">🚚 Livraison rapide</li>
          <li className="glass rounded-2xl p-3">💵 Paiement à la réception</li>
        </ul>
        {ALCOHOL_CATEGORIES.includes(product.category) && (
          <p className="mt-6 text-xs text-frost/50">Vente interdite aux moins de 18 ans. L&apos;abus d&apos;alcool est dangereux pour la santé.</p>
        )}
      </div>
    </div>
  );
}
