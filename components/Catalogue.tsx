"use client";

import { useMemo, useState } from "react";
import type { Category, Product } from "@/lib/types";
import { CATEGORIES } from "@/lib/types";
import { minPrice } from "@/lib/shop";
import ProductCard from "./ProductCard";

type Sort = "pop" | "asc" | "desc" | "az";

export default function Catalogue({ products, initialCat }: { products: Product[]; initialCat: string }) {
  const [cat, setCat] = useState<string>(initialCat);
  const [q, setQ] = useState("");
  const [sort, setSort] = useState<Sort>("pop");

  const list = useMemo(() => {
    const needle = q.trim().toLowerCase();
    let out = products.filter(
      (p) =>
        (cat === "Tout" || p.category === cat) &&
        (!needle || `${p.name} ${p.brand} ${p.category}`.toLowerCase().includes(needle)),
    );
    out = [...out];
    if (sort === "asc") out.sort((a, b) => minPrice(a) - minPrice(b));
    else if (sort === "desc") out.sort((a, b) => minPrice(b) - minPrice(a));
    else if (sort === "az") out.sort((a, b) => a.name.localeCompare(b.name, "fr"));
    else out.sort((a, b) => Number(b.featured) - Number(a.featured));
    return out;
  }, [products, cat, q, sort]);

  const cats: (Category | "Tout")[] = ["Tout", ...CATEGORIES.filter((c) => products.some((p) => p.category === c))];

  return (
    <div>
      <div className="flex flex-col gap-4 md:flex-row md:items-center">
        <div className="relative flex-1">
          <svg viewBox="0 0 24 24" className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-frost/50" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden>
            <circle cx="11" cy="11" r="7" />
            <path d="m20 20-3.5-3.5" />
          </svg>
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Rechercher une boisson (Bock, Coca, jus…)"
            aria-label="Rechercher une boisson"
            className="w-full rounded-full border border-frost/15 bg-frost/5 py-3 pl-12 pr-4 outline-none transition placeholder:text-frost/40 focus:border-ice"
          />
        </div>
        <label className="flex items-center gap-2 text-sm text-frost/70">
          Trier :
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as Sort)}
            className="rounded-full border border-frost/15 bg-night-2 px-4 py-3 text-frost outline-none focus:border-ice"
          >
            <option value="pop">Populaires</option>
            <option value="asc">Prix croissant</option>
            <option value="desc">Prix décroissant</option>
            <option value="az">A → Z</option>
          </select>
        </label>
      </div>

      <div className="no-scrollbar -mx-4 mt-5 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:flex-wrap sm:px-0" role="tablist" aria-label="Catégories">
        {cats.map((c) => (
          <button
            key={c}
            role="tab"
            aria-selected={cat === c}
            onClick={() => setCat(c)}
            className={`shrink-0 rounded-full border px-5 py-2.5 text-sm font-bold transition ${
              cat === c ? "border-fire bg-fire text-white" : "border-frost/20 hover:border-ice hover:text-ice"
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      <p className="mt-6 text-sm text-frost/60" aria-live="polite">
        {list.length} produit{list.length > 1 ? "s" : ""}
      </p>

      {list.length === 0 ? (
        <div className="mt-10 rounded-3xl border border-dashed border-frost/20 p-12 text-center">
          <p className="text-4xl">🔍</p>
          <p className="mt-2 font-display text-2xl">Rien trouvé</p>
          <p className="text-frost/60">Essaie un autre mot ou une autre catégorie.</p>
        </div>
      ) : (
        <div className="mt-4 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {list.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
}
