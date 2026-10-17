"use client";

import Link from "next/link";
import { useActionState, useState } from "react";
import { deleteProduct, saveProduct } from "../../actions";
import ProductVisual from "@/components/ProductVisual";
import { CATEGORIES, type Product } from "@/lib/types";

const field = "w-full rounded-2xl border border-frost/15 bg-frost/5 px-4 py-2.5 outline-none transition focus:border-ice";

export default function ProductForm({ product }: { product?: Product }) {
  const [state, action, pending] = useActionState(saveProduct, undefined);
  const [formats, setFormats] = useState(product?.formats ?? [{ label: "33 cl", price: 500, stock: 50 }]);
  const [color, setColor] = useState(product?.color ?? "#22d3ee");

  const update = (i: number, patch: Partial<(typeof formats)[number]>) =>
    setFormats((fs) => fs.map((f, j) => (j === i ? { ...f, ...patch } : f)));

  return (
    <form action={action} className="grid gap-8 lg:grid-cols-[1fr_320px]">
      <input type="hidden" name="id" value={product?.id ?? ""} />
      <input type="hidden" name="formats" value={JSON.stringify(formats)} />

      <div className="space-y-5">
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block"><span className="mb-1 block text-sm text-frost/70">Nom *</span>
            <input name="name" required defaultValue={product?.name} className={field} /></label>
          <label className="block"><span className="mb-1 block text-sm text-frost/70">Marque</span>
            <input name="brand" defaultValue={product?.brand} className={field} /></label>
          <label className="block"><span className="mb-1 block text-sm text-frost/70">Catégorie *</span>
            <select name="category" defaultValue={product?.category ?? "Bières"} className={`${field} bg-night-2`}>
              {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
            </select></label>
          <label className="block"><span className="mb-1 block text-sm text-frost/70">Étiquette</span>
            <select name="badge" defaultValue={product?.badge ?? ""} className={`${field} bg-night-2`}>
              <option value="">Aucune</option><option>Best-seller</option><option>Promo</option><option>Nouveau</option><option>Pack</option>
            </select></label>
        </div>
        <label className="block"><span className="mb-1 block text-sm text-frost/70">Description</span>
          <textarea name="description" rows={3} maxLength={500} defaultValue={product?.description} className={field} /></label>

        <fieldset>
          <legend className="mb-2 font-display text-xl">Formats, prix et stock</legend>
          <div className="space-y-2">
            {formats.map((f, i) => (
              <div key={i} className="grid grid-cols-[1fr_110px_90px_auto] items-center gap-2">
                <input aria-label="Format" placeholder="Ex : 65 cl" value={f.label} onChange={(e) => update(i, { label: e.target.value })} className={field} />
                <input aria-label="Prix FCFA" type="number" min={1} placeholder="Prix" value={f.price} onChange={(e) => update(i, { price: Number(e.target.value) })} className={field} />
                <input aria-label="Stock" type="number" min={0} placeholder="Stock" value={f.stock} onChange={(e) => update(i, { stock: Number(e.target.value) })} className={field} />
                <button type="button" disabled={formats.length === 1} onClick={() => setFormats((fs) => fs.filter((_, j) => j !== i))} className="h-10 w-10 rounded-full bg-frost/10 hover:bg-red-500/30 disabled:opacity-30" aria-label="Supprimer ce format">✕</button>
              </div>
            ))}
          </div>
          <p className="mt-1 text-xs text-frost/50">Colonnes : format · prix (FCFA) · stock</p>
          <button type="button" onClick={() => setFormats((fs) => [...fs, { label: "", price: 0, stock: 0 }])} className="mt-2 rounded-full border border-frost/20 px-4 py-2 text-sm hover:border-ice">+ Ajouter un format</button>
        </fieldset>

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block"><span className="mb-1 block text-sm text-frost/70">Ancien prix barré (FCFA, 0 = aucun)</span>
            <input name="oldPrice" type="number" min={0} defaultValue={product?.oldPrice ?? 0} className={field} /></label>
          <label className="block"><span className="mb-1 block text-sm text-frost/70">Couleur du visuel (sans photo)</span>
            <input name="color" type="color" value={color} onChange={(e) => setColor(e.target.value)} className="h-11 w-full cursor-pointer rounded-2xl border border-frost/15 bg-frost/5 p-1" /></label>
        </div>
        <div className="flex flex-wrap gap-6 text-sm">
          <label className="flex items-center gap-2"><input type="checkbox" name="active" defaultChecked={product?.active ?? true} /> Visible sur le site</label>
          <label className="flex items-center gap-2"><input type="checkbox" name="featured" defaultChecked={product?.featured ?? false} /> Mis en avant (accueil)</label>
        </div>

        {state?.error && <p role="alert" className="rounded-xl bg-red-500/15 p-3 text-sm text-red-300">{state.error}</p>}
        <div className="flex flex-wrap gap-3">
          <button disabled={pending} className="rounded-full bg-fire px-8 py-3 font-bold text-white hover:bg-fire-dark disabled:opacity-60">{pending ? "Enregistrement…" : "Enregistrer"}</button>
          <Link href="/admin/produits" className="rounded-full border border-frost/20 px-6 py-3 hover:border-ice">Annuler</Link>
        </div>
      </div>

      <aside className="space-y-4">
        <div className="glass rounded-3xl p-5">
          <p className="mb-3 text-sm font-semibold">Photo du produit</p>
          <div className="flex h-56 items-end justify-center rounded-2xl bg-frost-glow p-3">
            <ProductVisual product={{ name: product?.name ?? "Aperçu", brand: product?.brand ?? "Marque", image: product?.image ?? "", color, category: product?.category ?? "Sodas" }} className="h-full w-auto" />
          </div>
          <input type="file" name="image" accept="image/png,image/jpeg,image/webp" className="mt-3 w-full text-xs file:mr-3 file:rounded-full file:border-0 file:bg-ice file:px-4 file:py-2 file:font-bold file:text-frost" />
          <p className="mt-2 text-xs text-frost/50">Idéal : PNG détouré (fond transparent), vertical. 5 Mo max.</p>
          {product?.image && (
            <label className="mt-2 flex items-center gap-2 text-xs"><input type="checkbox" name="removeImage" /> Retirer la photo actuelle</label>
          )}
        </div>
        {product && (
          <button
            type="submit"
            formAction={async () => {
              if (confirm(`Supprimer « ${product.name} » définitivement ?`)) await deleteProduct(product.id);
            }}
            formNoValidate
            className="w-full rounded-full bg-red-500/15 py-3 text-sm font-bold text-red-300 hover:bg-red-500/25"
          >
            Supprimer ce produit
          </button>
        )}
      </aside>
    </form>
  );
}
