import Link from "next/link";
import { getOrders, getProducts } from "@/lib/db";
import { fcfa } from "@/lib/format";
import { STATUS_LABEL } from "@/lib/types";

function sameDay(iso: string) {
  const f = (d: Date) => d.toLocaleDateString("fr-FR", { timeZone: "Africa/Abidjan" });
  return f(new Date(iso)) === f(new Date());
}

export default async function Dashboard() {
  const [orders, products] = await Promise.all([getOrders(), getProducts()]);
  const valid = orders.filter((o) => o.status !== "annulee");
  const today = valid.filter((o) => sameDay(o.createdAt));
  const revenue = (list: typeof valid) => list.reduce((n, o) => n + o.total, 0);
  const pending = orders.filter((o) => o.status === "nouvelle" || o.status === "preparation");
  const lowStock = products.flatMap((p) => p.formats.filter((f) => f.stock <= 10).map((f) => ({ p, f }))).sort((a, b) => a.f.stock - b.f.stock);

  const stats = [
    { label: "Commandes aujourd'hui", value: String(today.length), tone: "text-ice" },
    { label: "Chiffre du jour", value: fcfa(revenue(today)), tone: "text-fire" },
    { label: "À traiter", value: String(pending.length), tone: "text-gold" },
    { label: "Chiffre total", value: fcfa(revenue(valid)), tone: "text-emerald-300" },
  ];

  return (
    <div className="space-y-8">
      <h1 className="font-display text-4xl sm:text-5xl">Tableau de bord</h1>
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="glass rounded-3xl p-5">
            <p className="text-xs font-semibold uppercase tracking-wider text-frost/60">{s.label}</p>
            <p className={`mt-2 font-display text-3xl sm:text-4xl ${s.tone}`}>{s.value}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="glass rounded-3xl p-5">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="font-display text-2xl">Dernières commandes</h2>
            <Link href="/admin/commandes" className="text-sm text-ice hover:underline">Tout voir →</Link>
          </div>
          {orders.length === 0 ? (
            <p className="text-frost/60">Aucune commande pour le moment.</p>
          ) : (
            <ul className="divide-y divide-frost/10">
              {orders.slice(0, 6).map((o) => (
                <li key={o.id} className="flex items-center justify-between gap-3 py-3">
                  <div>
                    <p className="font-semibold">{o.id} · {o.customer.name}</p>
                    <p className="text-xs text-frost/60">{o.mode === "livraison" ? `🚚 ${o.zone}` : "🏪 Retrait"} · {new Date(o.createdAt).toLocaleString("fr-FR", { timeZone: "Africa/Abidjan", dateStyle: "short", timeStyle: "short" })}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-display text-lg text-fire">{fcfa(o.total)}</p>
                    <p className="text-xs text-frost/60">{STATUS_LABEL[o.status]}</p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="glass rounded-3xl p-5">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="font-display text-2xl">Stock faible</h2>
            <Link href="/admin/produits" className="text-sm text-ice hover:underline">Gérer →</Link>
          </div>
          {lowStock.length === 0 ? (
            <p className="text-frost/60">Tout est bien approvisionné 👍</p>
          ) : (
            <ul className="divide-y divide-frost/10">
              {lowStock.slice(0, 8).map(({ p, f }) => (
                <li key={p.id + f.label} className="flex items-center justify-between py-2.5">
                  <span>{p.name} <span className="text-xs text-frost/50">({f.label})</span></span>
                  <span className={`rounded-full px-3 py-0.5 text-xs font-bold ${f.stock === 0 ? "bg-red-500/20 text-red-300" : "bg-gold/20 text-gold"}`}>
                    {f.stock === 0 ? "Rupture" : `${f.stock} restants`}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}
