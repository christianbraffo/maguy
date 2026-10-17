"use client";

import { useActionState, useState } from "react";
import { saveSettingsAction } from "../../actions";
import type { Settings } from "@/lib/types";

const field = "w-full rounded-2xl border border-frost/15 bg-frost/5 px-4 py-2.5 outline-none transition focus:border-ice";

export default function SettingsForm({ settings }: { settings: Settings }) {
  const [state, action, pending] = useActionState(saveSettingsAction, undefined);
  const [zones, setZones] = useState(settings.zones);
  const [hours, setHours] = useState(settings.hours);

  return (
    <form action={action} className="space-y-8">
      <input type="hidden" name="zones" value={JSON.stringify(zones)} />
      <input type="hidden" name="hours" value={JSON.stringify(hours)} />

      <section className="glass space-y-4 rounded-3xl p-5">
        <h2 className="font-display text-2xl">La boutique</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block"><span className="mb-1 block text-sm text-frost/70">Nom</span><input name="shopName" defaultValue={settings.shopName} className={field} /></label>
          <label className="block"><span className="mb-1 block text-sm text-frost/70">Slogan</span><input name="tagline" defaultValue={settings.tagline} className={field} /></label>
          <label className="block"><span className="mb-1 block text-sm text-frost/70">WhatsApp (format international, sans +)</span><input name="whatsapp" defaultValue={settings.whatsapp} placeholder="2250700000000" className={field} /></label>
          <label className="block"><span className="mb-1 block text-sm text-frost/70">Téléphone affiché</span><input name="phone" defaultValue={settings.phone} className={field} /></label>
          <label className="block sm:col-span-2"><span className="mb-1 block text-sm text-frost/70">Adresse de la cave</span><input name="address" defaultValue={settings.address} className={field} /></label>
          <label className="block sm:col-span-2"><span className="mb-1 block text-sm text-frost/70">Bandeau d&apos;annonce (en haut du site)</span><input name="banner" defaultValue={settings.banner} className={field} /></label>
        </div>
      </section>

      <section className="glass space-y-4 rounded-3xl p-5">
        <h2 className="font-display text-2xl">Commande & livraison</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block"><span className="mb-1 block text-sm text-frost/70">Livraison offerte dès (FCFA)</span><input name="freeDeliveryFrom" type="number" min={0} defaultValue={settings.freeDeliveryFrom} className={field} /></label>
          <label className="block"><span className="mb-1 block text-sm text-frost/70">Commande minimum (FCFA)</span><input name="minOrder" type="number" min={0} defaultValue={settings.minOrder} className={field} /></label>
        </div>
        <div>
          <p className="mb-2 text-sm font-semibold">Zones de livraison</p>
          <div className="space-y-2">
            {zones.map((z, i) => (
              <div key={i} className="grid grid-cols-[1fr_100px_110px_auto] items-center gap-2">
                <input aria-label="Quartier" placeholder="Quartier" value={z.name} onChange={(e) => setZones((a) => a.map((x, j) => j === i ? { ...x, name: e.target.value } : x))} className={field} />
                <input aria-label="Frais" type="number" min={0} placeholder="Frais" value={z.fee} onChange={(e) => setZones((a) => a.map((x, j) => j === i ? { ...x, fee: Number(e.target.value) } : x))} className={field} />
                <input aria-label="Délai" placeholder="30 – 45 min" value={z.eta} onChange={(e) => setZones((a) => a.map((x, j) => j === i ? { ...x, eta: e.target.value } : x))} className={field} />
                <button type="button" onClick={() => setZones((a) => a.filter((_, j) => j !== i))} aria-label="Supprimer la zone" className="h-10 w-10 rounded-full bg-frost/10 hover:bg-red-500/30">✕</button>
              </div>
            ))}
          </div>
          <button type="button" onClick={() => setZones((a) => [...a, { name: "", fee: 1000, eta: "30 – 45 min" }])} className="mt-2 rounded-full border border-frost/20 px-4 py-2 text-sm hover:border-ice">+ Ajouter une zone</button>
        </div>
      </section>

      <section className="glass space-y-3 rounded-3xl p-5">
        <h2 className="font-display text-2xl">Horaires</h2>
        <p className="text-xs text-frost/50">Jours : « Lundi – Jeudi », « Vendredi – Samedi » ou « Dimanche ». Fermeture après minuit possible (ex : 02:00).</p>
        {hours.map((h, i) => (
          <div key={i} className="grid grid-cols-[1fr_110px_110px_auto] items-center gap-2">
            <input aria-label="Jours" value={h.days} onChange={(e) => setHours((a) => a.map((x, j) => j === i ? { ...x, days: e.target.value } : x))} className={field} />
            <input aria-label="Ouverture" type="time" value={h.open} onChange={(e) => setHours((a) => a.map((x, j) => j === i ? { ...x, open: e.target.value } : x))} className={field} />
            <input aria-label="Fermeture" type="time" value={h.close} onChange={(e) => setHours((a) => a.map((x, j) => j === i ? { ...x, close: e.target.value } : x))} className={field} />
            <button type="button" onClick={() => setHours((a) => a.filter((_, j) => j !== i))} aria-label="Supprimer" className="h-10 w-10 rounded-full bg-frost/10 hover:bg-red-500/30">✕</button>
          </div>
        ))}
        <button type="button" onClick={() => setHours((a) => [...a, { days: "Lundi – Dimanche", open: "10:00", close: "23:00" }])} className="rounded-full border border-frost/20 px-4 py-2 text-sm hover:border-ice">+ Ajouter une plage</button>
      </section>

      {state?.error && <p role="alert" className="rounded-xl bg-red-500/15 p-3 text-sm text-red-300">{state.error}</p>}
      {state?.ok && <p role="status" className="rounded-xl bg-leaf/20 p-3 text-sm text-emerald-300">Paramètres enregistrés ✓</p>}
      <button disabled={pending} className="rounded-full bg-fire px-8 py-3 font-bold text-white hover:bg-fire-dark disabled:opacity-60">{pending ? "Enregistrement…" : "Enregistrer"}</button>
    </form>
  );
}
