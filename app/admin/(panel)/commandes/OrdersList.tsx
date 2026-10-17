"use client";

import { useState, useTransition } from "react";
import { setOrderStatus } from "../../actions";
import { fcfa } from "@/lib/format";
import { STATUS_LABEL, type Order, type OrderStatus } from "@/lib/types";

const TONE: Record<OrderStatus, string> = {
  nouvelle: "bg-fire/20 text-fire",
  preparation: "bg-gold/20 text-gold",
  en_route: "bg-ice/20 text-ice",
  terminee: "bg-leaf/20 text-emerald-300",
  annulee: "bg-red-500/20 text-red-300",
};

export default function OrdersList({ orders, initialFilter }: { orders: Order[]; initialFilter: OrderStatus | "all" }) {
  const [filter, setFilter] = useState<OrderStatus | "all">(initialFilter);
  const [openId, setOpenId] = useState<string | null>(null);
  const [pending, start] = useTransition();

  const list = filter === "all" ? orders : orders.filter((o) => o.status === filter);
  const count = (s: OrderStatus) => orders.filter((o) => o.status === s).length;

  function change(id: string, status: OrderStatus) {
    if (status === "annulee" && !confirm("Annuler cette commande ? Le stock sera remis.")) return;
    start(() => setOrderStatus(id, status));
  }

  return (
    <div className={pending ? "opacity-70 transition" : "transition"}>
      <div className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 pb-2 sm:mx-0 sm:px-0">
        {(["all", ...Object.keys(STATUS_LABEL)] as (OrderStatus | "all")[]).map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`shrink-0 rounded-full border px-4 py-2 text-sm font-semibold ${filter === s ? "border-fire bg-fire text-white" : "border-frost/20 hover:border-ice"}`}
          >
            {s === "all" ? `Toutes (${orders.length})` : `${STATUS_LABEL[s]} (${count(s)})`}
          </button>
        ))}
      </div>

      {list.length === 0 ? (
        <p className="glass mt-6 rounded-3xl p-10 text-center text-frost/60">Aucune commande dans cette vue.</p>
      ) : (
        <ul className="mt-4 space-y-3">
          {list.map((o) => {
            const open = openId === o.id;
            return (
              <li key={o.id} className="glass overflow-hidden rounded-3xl">
                <button onClick={() => setOpenId(open ? null : o.id)} className="flex w-full flex-wrap items-center justify-between gap-3 p-4 text-left" aria-expanded={open}>
                  <div>
                    <p className="font-bold">{o.id} · {o.customer.name}</p>
                    <p className="text-xs text-frost/60">
                      {new Date(o.createdAt).toLocaleString("fr-FR", { timeZone: "Africa/Abidjan", dateStyle: "short", timeStyle: "short" })} · {o.mode === "livraison" ? `🚚 ${o.zone}` : "🏪 Retrait"} · {o.items.reduce((n, i) => n + i.qty, 0)} article(s)
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`rounded-full px-3 py-1 text-xs font-bold ${TONE[o.status]}`}>{STATUS_LABEL[o.status]}</span>
                    <span className="font-display text-xl text-fire">{fcfa(o.total)}</span>
                  </div>
                </button>
                {open && (
                  <div className="space-y-4 border-t border-frost/10 p-4">
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="text-sm">
                        <p className="font-semibold text-ice">Client</p>
                        <p>{o.customer.name}</p>
                        <p>
                          <a className="underline" href={`tel:${o.customer.phone}`}>{o.customer.phone}</a>{" · "}
                          <a className="text-emerald-300 underline" target="_blank" rel="noopener noreferrer" href={`https://wa.me/${o.customer.phone.replace(/\D/g, "").replace(/^(\d{10})$/, "225$1")}`}>WhatsApp</a>
                        </p>
                        {o.mode === "livraison" && <p className="mt-1 text-frost/80">{o.zone} — {o.address}</p>}
                        {o.note && <p className="mt-1 italic text-gold">« {o.note} »</p>}
                      </div>
                      <ul className="text-sm">
                        {o.items.map((i) => (
                          <li key={i.productId + i.format} className="flex justify-between py-0.5">
                            <span>{i.qty} × {i.name} <span className="text-frost/50">({i.format})</span></span>
                            <span>{fcfa(i.price * i.qty)}</span>
                          </li>
                        ))}
                        <li className="mt-1 flex justify-between border-t border-frost/10 pt-1 text-frost/70"><span>Livraison</span><span>{fcfa(o.fee)}</span></li>
                        <li className="flex justify-between font-bold"><span>Total</span><span>{fcfa(o.total)}</span></li>
                      </ul>
                    </div>
                    {o.status !== "annulee" && (
                      <div className="flex flex-wrap gap-2">
                        {(["nouvelle", "preparation", "en_route", "terminee"] as OrderStatus[]).map((s) => (
                          <button
                            key={s}
                            disabled={pending || o.status === s}
                            onClick={() => change(o.id, s)}
                            className={`rounded-full px-4 py-2 text-sm font-semibold ${o.status === s ? "bg-ice text-frost" : "bg-frost/10 hover:bg-frost/20"} disabled:cursor-default`}
                          >
                            {STATUS_LABEL[s]}
                          </button>
                        ))}
                        <button disabled={pending} onClick={() => change(o.id, "annulee")} className="rounded-full bg-red-500/15 px-4 py-2 text-sm font-semibold text-red-300 hover:bg-red-500/25">
                          Annuler
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
