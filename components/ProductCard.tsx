"use client";

import Link from "next/link";
import { useState } from "react";
import { useCart } from "@/lib/cart";
import { fcfa } from "@/lib/format";
import { inStock } from "@/lib/shop";
import type { Product } from "@/lib/types";
import ProductVisual from "./ProductVisual";

const BADGE_STYLE: Record<string, string> = {
  "Best-seller": "bg-gold text-frost",
  Promo: "bg-fire text-white",
  Nouveau: "bg-ice text-frost",
  Pack: "bg-frost text-night",
};

export default function ProductCard({ product }: { product: Product }) {
  const { add } = useCart();
  const firstAvail = product.formats.findIndex((f) => f.stock > 0);
  const [idx, setIdx] = useState(Math.max(firstAvail, 0));
  const [done, setDone] = useState(false);
  const f = product.formats[idx];
  const available = inStock(product) && f.stock > 0;
  const showOld = product.oldPrice > f.price && idx === 0;
  const low = available && f.stock <= 10;

  function onAdd() {
    add(product.id, f.label, 1);
    setDone(true);
    setTimeout(() => setDone(false), 1200);
  }

  return (
    <article className="group glass relative flex flex-col overflow-hidden rounded-3xl transition duration-300 hover:-translate-y-1 hover:border-ice/50 hover:shadow-[0_20px_50px_-20px_rgba(34,211,238,0.5)]">
      {product.badge && (
        <span className={`absolute left-3 top-3 z-10 rounded-full px-3 py-1 text-[11px] font-extrabold uppercase tracking-wide ${BADGE_STYLE[product.badge]}`}>
          {product.badge}
        </span>
      )}
      <Link
        href={`/boissons/${product.id}`}
        className="relative flex h-56 items-end justify-center overflow-hidden bg-[radial-gradient(70%_70%_at_50%_100%,rgba(34,211,238,0.22),transparent)] px-6 pt-8"
        aria-label={`Voir ${product.name}`}
      >
        <ProductVisual
          product={product}
          className="h-full w-auto max-w-full transition duration-500 group-hover:scale-110 group-hover:-rotate-3"
        />
      </Link>
      <div className="flex flex-1 flex-col gap-3 p-4">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-widest text-ice">{product.brand}</p>
          <h3 className="font-display text-2xl leading-tight">
            <Link href={`/boissons/${product.id}`}>{product.name}</Link>
          </h3>
        </div>

        <div className="flex flex-wrap gap-1.5" role="radiogroup" aria-label="Format">
          {product.formats.map((fm, i) => (
            <button
              key={fm.label}
              role="radio"
              aria-checked={i === idx}
              disabled={fm.stock <= 0}
              onClick={() => setIdx(i)}
              className={`rounded-full border px-3 py-1 text-xs font-semibold transition ${
                i === idx
                  ? "border-ice bg-ice text-frost"
                  : "border-frost/15 text-frost/80 hover:border-ice/60"
              } disabled:cursor-not-allowed disabled:opacity-30 disabled:line-through`}
            >
              {fm.label}
            </button>
          ))}
        </div>

        <div className="mt-auto flex items-end justify-between gap-2 pt-1">
          <div>
            {showOld && <p className="text-xs text-frost/50 line-through">{fcfa(product.oldPrice)}</p>}
            <p className="font-display text-2xl text-fire">{fcfa(f.price)}</p>
            {low && <p className="text-[11px] font-semibold text-gold">Plus que {f.stock} !</p>}
          </div>
          <button
            onClick={onAdd}
            disabled={!available}
            className={`flex h-11 items-center gap-1.5 rounded-full px-4 text-sm font-bold text-white transition active:scale-95 disabled:cursor-not-allowed disabled:bg-frost/10 disabled:text-frost/40 ${
              done ? "bg-leaf" : "bg-fire hover:bg-fire-dark"
            }`}
          >
            {!available ? "Rupture" : done ? "Ajouté ✓" : "+ Ajouter"}
          </button>
        </div>
      </div>
    </article>
  );
}
