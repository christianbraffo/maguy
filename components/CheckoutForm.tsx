"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { placeOrder } from "@/app/actions";
import { useCart } from "@/lib/cart";
import { fcfa } from "@/lib/format";
import type { Settings } from "@/lib/types";
import ProductVisual from "./ProductVisual";

const input =
  "w-full rounded-2xl border border-frost/15 bg-frost/5 px-4 py-3 outline-none transition placeholder:text-frost/35 focus:border-ice";

export default function CheckoutForm({ settings }: { settings: Settings }) {
  const { items, subtotal, ready, clear, setQty, remove } = useCart();
  const router = useRouter();
  const [mode, setMode] = useState<"livraison" | "retrait">("livraison");
  const [zone, setZone] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [note, setNote] = useState("");
  const [error, setError] = useState("");
  const [pending, start] = useTransition();

  const zoneObj = settings.zones.find((z) => z.name === zone);
  const free = subtotal >= settings.freeDeliveryFrom;
  const fee = mode === "livraison" ? (free ? 0 : (zoneObj?.fee ?? 0)) : 0;
  const total = subtotal + fee;

  if (!ready) return <div className="h-64 animate-pulse rounded-3xl bg-frost/5" />;

  if (items.length === 0) {
    return (
      <div className="glass mx-auto max-w-lg rounded-3xl p-10 text-center">
        <p className="text-5xl">🧊</p>
        <h2 className="mt-3 font-display text-3xl">Ton panier est vide</h2>
        <p className="mt-1 text-frost/70">Ajoute des boissons avant de commander.</p>
        <Link href="/boissons" className="mt-5 inline-block rounded-full bg-fire px-7 py-3 font-bold text-white hover:bg-fire-dark">
          Voir les boissons
        </Link>
      </div>
    );
  }

  function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (subtotal < settings.minOrder) return setError(`Commande minimum : ${fcfa(settings.minOrder)}.`);
    start(async () => {
      const res = await placeOrder({
        name,
        phone,
        mode,
        zone,
        address,
        note,
        lines: items.map((i) => i.line),
      });
      if (res.ok) {
        clear();
        router.push(`/commande/confirmation/${res.id}`);
      } else {
        setError(res.error);
      }
    });
  }

  return (
    <form onSubmit={submit} className="grid gap-8 lg:grid-cols-[1fr_420px]">
      <div className="space-y-8">
        <fieldset className="space-y-3">
          <legend className="mb-2 font-display text-2xl">1. Comment tu veux recevoir ?</legend>
          <div className="grid grid-cols-2 gap-3">
            {(
              [
                ["livraison", "🚚", "Livraison", "Chez toi, bien glacé"],
                ["retrait", "🏪", "Retrait à la cave", "Gratuit, on te prépare tout"],
              ] as const
            ).map(([v, icon, t, d]) => (
              <label
                key={v}
                className={`cursor-pointer rounded-2xl border p-4 transition ${
                  mode === v ? "border-fire bg-fire/10" : "border-frost/15 hover:border-ice/60"
                }`}
              >
                <input type="radio" name="mode" value={v} checked={mode === v} onChange={() => setMode(v)} className="sr-only" />
                <span className="text-2xl">{icon}</span>
                <span className="mt-1 block font-bold">{t}</span>
                <span className="block text-xs text-frost/60">{d}</span>
              </label>
            ))}
          </div>
        </fieldset>

        <fieldset className="space-y-3">
          <legend className="mb-2 font-display text-2xl">2. Tes coordonnées</legend>
          <label className="block">
            <span className="mb-1 block text-sm text-frost/70">Nom complet</span>
            <input required autoComplete="name" value={name} onChange={(e) => setName(e.target.value)} className={input} placeholder="Ex : Kouadio Yao" />
          </label>
          <label className="block">
            <span className="mb-1 block text-sm text-frost/70">Téléphone (WhatsApp de préférence)</span>
            <input required type="tel" inputMode="tel" autoComplete="tel" value={phone} onChange={(e) => setPhone(e.target.value)} className={input} placeholder="Ex : 07 00 00 00 00" />
          </label>
          {mode === "livraison" && (
            <>
              <label className="block">
                <span className="mb-1 block text-sm text-frost/70">Quartier / commune</span>
                <select required value={zone} onChange={(e) => setZone(e.target.value)} className={`${input} bg-night-2`}>
                  <option value="">Choisis ton quartier…</option>
                  {settings.zones.map((z) => (
                    <option key={z.name} value={z.name}>
                      {z.name} — {fcfa(z.fee)} ({z.eta})
                    </option>
                  ))}
                </select>
              </label>
              <label className="block">
                <span className="mb-1 block text-sm text-frost/70">Adresse / point de repère</span>
                <input required value={address} onChange={(e) => setAddress(e.target.value)} className={input} placeholder="Ex : Riviera 2, près de la pharmacie, portail bleu" />
              </label>
            </>
          )}
          <label className="block">
            <span className="mb-1 block text-sm text-frost/70">Note (facultatif)</span>
            <textarea value={note} onChange={(e) => setNote(e.target.value)} rows={2} maxLength={300} className={input} placeholder="Ex : Sonner deux fois, glaçons en plus…" />
          </label>
        </fieldset>

        <p className="rounded-2xl bg-frost/5 p-4 text-sm text-frost/75">
          💵 <strong>Paiement à la réception</strong> (livraison ou retrait). Rien à payer en ligne.
        </p>
      </div>

      <aside className="h-fit space-y-4 rounded-3xl border border-frost/10 bg-night-2 p-5 lg:sticky lg:top-32">
        <h2 className="font-display text-2xl">Ta commande</h2>
        <ul className="space-y-3">
          {items.map(({ line, product, format, subtotal: sub }) => (
            <li key={`${line.productId}|${line.format}`} className="flex items-center gap-3">
              <div className="flex h-14 w-11 shrink-0 items-end justify-center">
                <ProductVisual product={product} className="h-full w-auto" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold">{product.name}</p>
                <p className="text-xs text-frost/60">{format.label}</p>
                <div className="mt-1 flex items-center gap-1 text-sm">
                  <button type="button" aria-label="Moins" className="h-6 w-6 rounded-full bg-frost/10" onClick={() => setQty(line.productId, line.format, line.qty - 1)}>−</button>
                  <span className="w-5 text-center font-bold">{line.qty}</span>
                  <button type="button" aria-label="Plus" disabled={line.qty >= format.stock} className="h-6 w-6 rounded-full bg-frost/10 disabled:opacity-30" onClick={() => setQty(line.productId, line.format, line.qty + 1)}>+</button>
                  <button type="button" aria-label="Retirer" className="ml-2 text-xs text-frost/40 hover:text-red-400" onClick={() => remove(line.productId, line.format)}>Retirer</button>
                </div>
              </div>
              <p className="text-sm font-bold">{fcfa(sub)}</p>
            </li>
          ))}
        </ul>
        <dl className="space-y-2 border-t border-frost/10 pt-4 text-sm">
          <div className="flex justify-between"><dt className="text-frost/70">Sous-total</dt><dd>{fcfa(subtotal)}</dd></div>
          <div className="flex justify-between">
            <dt className="text-frost/70">Livraison</dt>
            <dd>{mode === "retrait" ? "Gratuit (retrait)" : free ? <span className="text-emerald-300">Offerte 🎉</span> : zoneObj ? fcfa(zoneObj.fee) : "Choisis ton quartier"}</dd>
          </div>
          <div className="flex justify-between border-t border-frost/10 pt-3 text-base">
            <dt className="font-bold">Total à payer</dt>
            <dd className="font-display text-3xl text-fire">{fcfa(total)}</dd>
          </div>
        </dl>
        {error && <p role="alert" className="rounded-xl bg-red-500/15 p-3 text-sm text-red-300">{error}</p>}
        <button
          type="submit"
          disabled={pending}
          className="w-full rounded-full bg-fire py-4 text-base font-extrabold text-white shadow-lg shadow-fire/30 transition hover:bg-fire-dark active:scale-[0.98] disabled:opacity-60"
        >
          {pending ? "Envoi en cours…" : "Confirmer ma commande"}
        </button>
        <p className="text-center text-xs text-frost/50">En commandant, tu confirmes avoir 18 ans ou plus pour les boissons alcoolisées.</p>
      </aside>
    </form>
  );
}
