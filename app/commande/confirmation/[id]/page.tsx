import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getOrders, getSettings } from "@/lib/db";
import { fcfa } from "@/lib/format";
import { whatsappLink } from "@/lib/shop";
import { STATUS_LABEL } from "@/lib/types";

export const metadata: Metadata = { title: "Commande confirmée", robots: { index: false } };

export default async function Confirmation({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [orders, settings] = await Promise.all([getOrders(), getSettings()]);
  const order = orders.find((o) => o.id === id);
  if (!order) notFound();

  const lines = order.items.map((i) => `• ${i.qty} × ${i.name} (${i.format}) — ${fcfa(i.price * i.qty)}`).join("\n");
  const msg = `Bonjour Maguy 👋\nCommande ${order.id}\n${lines}\n\nSous-total : ${fcfa(order.subtotal)}\n${
    order.mode === "livraison" ? `Livraison (${order.zone}) : ${order.fee ? fcfa(order.fee) : "offerte"}` : "Retrait à la cave"
  }\nTotal : ${fcfa(order.total)}\n\nNom : ${order.customer.name}\nTél : ${order.customer.phone}${
    order.mode === "livraison" ? `\nAdresse : ${order.zone}, ${order.address}` : ""
  }${order.note ? `\nNote : ${order.note}` : ""}`;

  return (
    <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6">
      <div className="text-center">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-leaf text-4xl shadow-[0_0_40px_rgba(25,167,90,0.6)]">✓</div>
        <h1 className="mt-5 font-display text-5xl sm:text-6xl">Commande <span className="text-ice">reçue !</span></h1>
        <p className="mt-2 text-frost/75">
          Merci {order.customer.name.split(" ")[0]} ! On prépare ta commande. Garde ton numéro :
        </p>
        <p className="mt-3 inline-block rounded-full border border-dashed border-ice px-6 py-2 font-display text-3xl tracking-widest text-ice">{order.id}</p>
      </div>

      <div className="glass mt-8 rounded-3xl p-6">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-2xl">Récapitulatif</h2>
          <span className="rounded-full bg-fire/20 px-3 py-1 text-xs font-bold text-fire">{STATUS_LABEL[order.status]}</span>
        </div>
        <ul className="mt-4 divide-y divide-frost/10">
          {order.items.map((i) => (
            <li key={i.productId + i.format} className="flex justify-between py-2 text-sm">
              <span>{i.qty} × {i.name} <span className="text-frost/50">({i.format})</span></span>
              <span className="font-semibold">{fcfa(i.price * i.qty)}</span>
            </li>
          ))}
        </ul>
        <dl className="mt-3 space-y-1 border-t border-frost/10 pt-3 text-sm">
          <div className="flex justify-between"><dt className="text-frost/70">Sous-total</dt><dd>{fcfa(order.subtotal)}</dd></div>
          <div className="flex justify-between"><dt className="text-frost/70">{order.mode === "livraison" ? `Livraison (${order.zone})` : "Retrait à la cave"}</dt><dd>{order.fee ? fcfa(order.fee) : "Gratuit"}</dd></div>
          <div className="flex justify-between pt-2 text-base"><dt className="font-bold">Total à payer</dt><dd className="font-display text-3xl text-fire">{fcfa(order.total)}</dd></div>
        </dl>
        <div className="mt-4 rounded-2xl bg-frost/5 p-4 text-sm text-frost/80">
          {order.mode === "livraison" ? (
            <>🚚 Livraison à <strong>{order.zone}</strong> — {order.address}</>
          ) : (
            <>🏪 Retrait à la cave : <strong>{settings.address}</strong></>
          )}
          <br />📞 On t&apos;appelle au {order.customer.phone} si besoin.
          <br />💵 Paiement à la réception.
        </div>
      </div>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <a href={whatsappLink(settings, msg)} target="_blank" rel="noopener noreferrer" className="flex-1 rounded-full bg-[#25d366] py-4 text-center font-extrabold text-white hover:brightness-110">
          Envoyer ma commande sur WhatsApp
        </a>
        <Link href="/boissons" className="flex-1 rounded-full border border-frost/25 py-4 text-center font-bold hover:border-ice hover:text-ice">
          Continuer mes achats
        </Link>
      </div>
    </div>
  );
}
