"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import { quickUpdateProduct } from "../../actions";
import ProductVisual from "@/components/ProductVisual";
import { fcfa } from "@/lib/format";
import type { Product } from "@/lib/types";

function StockInput({ id, label, stock }: { id: string; label: string; stock: number }) {
  const [v, setV] = useState(String(stock));
  const [pending, start] = useTransition();
  const commit = () => {
    const n = Math.max(0, Math.floor(Number(v)) || 0);
    setV(String(n));
    if (n !== stock) start(() => quickUpdateProduct(id, { stock: { label, value: n } }));
  };
  return (
    <label className="flex items-center justify-between gap-2 text-sm">
      <span className="text-frost/70">{label}</span>
      <input
        type="number"
        min={0}
        value={v}
        onChange={(e) => setV(e.target.value)}
        onBlur={commit}
        onKeyDown={(e) => e.key === "Enter" && (e.target as HTMLInputElement).blur()}
        aria-label={`Stock ${label}`}
        className={`w-20 rounded-lg border bg-frost/5 px-2 py-1 text-right outline-none focus:border-ice ${stock === 0 ? "border-red-400/60" : stock <= 10 ? "border-gold/60" : "border-frost/15"} ${pending ? "opacity-50" : ""}`}
      />
    </label>
  );
}

export default function ProductsTable({ products }: { products: Product[] }) {
  const [q, setQ] = useState("");
  const [pending, start] = useTransition();
  const list = products.filter((p) => `${p.name} ${p.brand} ${p.category}`.toLowerCase().includes(q.toLowerCase()));

  return (
    <div>
      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Rechercher un produit…"
        aria-label="Rechercher un produit"
        className="mb-4 w-full rounded-full border border-frost/15 bg-frost/5 px-5 py-3 outline-none focus:border-ice sm:max-w-sm"
      />
      <ul className="grid gap-4 md:grid-cols-2">
        {list.map((p) => (
          <li key={p.id} className={`glass flex gap-4 rounded-3xl p-4 ${p.active ? "" : "opacity-55"}`}>
            <div className="flex h-28 w-20 shrink-0 items-end justify-center">
              <ProductVisual product={p} className="h-full w-auto" />
            </div>
            <div className="min-w-0 flex-1 space-y-2">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-widest text-ice">{p.category}</p>
                  <p className="font-display text-xl leading-tight">{p.name}</p>
                </div>
                <Link href={`/admin/produits/${p.id}`} className="shrink-0 rounded-full bg-frost/10 px-3 py-1.5 text-xs font-bold hover:bg-frost/20">Modifier</Link>
              </div>
              <div className="space-y-1.5">
                {p.formats.map((f) => (
                  <div key={f.label} className="flex items-center gap-2">
                    <div className="flex-1"><StockInput id={p.id} label={f.label} stock={f.stock} /></div>
                    <span className="w-24 text-right text-xs font-semibold text-fire">{fcfa(f.price)}</span>
                  </div>
                ))}
              </div>
              <div className="flex gap-4 pt-1 text-xs">
                <label className="flex items-center gap-1.5">
                  <input type="checkbox" checked={p.active} disabled={pending} onChange={(e) => start(() => quickUpdateProduct(p.id, { active: e.target.checked }))} />
                  Visible sur le site
                </label>
                <label className="flex items-center gap-1.5">
                  <input type="checkbox" checked={p.featured} disabled={pending} onChange={(e) => start(() => quickUpdateProduct(p.id, { featured: e.target.checked }))} />
                  Mis en avant
                </label>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
