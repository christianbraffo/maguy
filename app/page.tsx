import Link from "next/link";
import { getActiveProducts, getSettings } from "@/lib/db";
import { CATEGORIES } from "@/lib/types";
import { whatsappLink } from "@/lib/shop";
import { fcfa } from "@/lib/format";
import Hero from "@/components/Hero";
import Marquee from "@/components/Marquee";
import ProductCard from "@/components/ProductCard";
import Reveal from "@/components/Reveal";

const CAT_EMOJI: Record<string, string> = {
  "Bières": "🍺",
  Sodas: "🥤",
  Jus: "🍊",
  Eaux: "💧",
  "Énergisantes": "⚡",
  "Vins & Liqueurs": "🍷",
  Packs: "🎉",
};

const WHY = [
  { icon: "❄️", title: "Toujours bien glacé", text: "Nos boissons restent au frais jusqu'à ta porte. Pas de tiède, jamais." },
  { icon: "🚚", title: "Livré en 30 min", text: "Un livreur rapide dans les quartiers d'Abidjan, de jour comme de nuit." },
  { icon: "💸", title: "Prix tout doux", text: "Des prix de cave, des packs et des promos pour que la soirée reste abordable." },
  { icon: "📦", title: "Retrait à la cave", text: "Tu préfères passer ? Commande en ligne, on prépare, tu récupères." },
];

const STEPS = [
  { n: "01", title: "Choisis", text: "Parcours le catalogue et remplis ton panier." },
  { n: "02", title: "Valide", text: "Donne ton nom, ton numéro et ton quartier. Pas de compte." },
  { n: "03", title: "Reçois", text: "On prépare, on livre bien glacé. Tu paies à la réception." },
];

const REVIEWS = [
  { name: "Kouadio A.", place: "Cocody", text: "Commandé à 21h, livré avant 21h40 et c'était glacé comme il faut. Je recommande !" },
  { name: "Aïcha T.", place: "Marcory", text: "Le pack soirée m'a sauvée pour l'anniversaire. Prix correct et livraison rapide." },
  { name: "Yao M.", place: "Yopougon", text: "Enfin une cave sérieuse en ligne. Le site est simple et le service au top." },
];

export default async function Home() {
  const [products, settings] = await Promise.all([getActiveProducts(), getSettings()]);
  const heroStars = ["bock", "coca", "heineken", "castel", "guinness"]
    .map((id) => products.find((p) => p.id === id))
    .filter((p): p is NonNullable<typeof p> => !!p);
  const stars = heroStars.length >= 5 ? heroStars : products.filter((p) => p.featured).slice(0, 5);
  const offers = products.filter((p) => p.badge === "Promo" || p.badge === "Pack" || p.oldPrice > 0).slice(0, 4);
  const best = products.filter((p) => p.badge === "Best-seller" || p.featured).slice(0, 8);

  return (
    <>
      <Hero products={stars} settings={settings} />
      <Marquee />

      <section id="categories" className="mx-auto max-w-7xl scroll-mt-28 px-4 py-16 sm:px-6">
        <Reveal>
          <h2 className="font-display text-4xl sm:text-6xl">
            Tu cherches <span className="text-ice">quoi</span> ?
          </h2>
        </Reveal>
        <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-7">
          {CATEGORIES.map((c, i) => (
            <Reveal key={c} delay={i * 60}>
              <Link
                href={`/boissons?cat=${encodeURIComponent(c)}`}
                className="glass group flex h-full flex-col items-center gap-2 rounded-3xl p-5 text-center transition hover:-translate-y-1 hover:border-fire/60 hover:bg-fire/10"
              >
                <span className="text-4xl transition group-hover:scale-125">{CAT_EMOJI[c]}</span>
                <span className="font-display text-lg leading-tight">{c}</span>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      {offers.length > 0 && (
        <section className="relative overflow-hidden bg-night-2 py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <Reveal>
              <p className="inline-block rounded-full bg-fire px-4 py-1 text-xs font-extrabold uppercase tracking-widest text-white">Offres du moment</p>
              <h2 className="mt-3 font-display text-4xl sm:text-6xl">
                Les <span className="text-fire">bons plans</span> du jour
              </h2>
              <p className="mt-2 max-w-xl text-frost/70">Packs et promos à durée limitée. Quand c&apos;est fini, c&apos;est fini.</p>
            </Reveal>
            <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {offers.map((p, i) => (
                <Reveal key={p.id} delay={i * 80}>
                  <ProductCard product={p} />
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <Reveal>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <h2 className="font-display text-4xl sm:text-6xl">
              Les plus <span className="text-ice">demandés</span>
            </h2>
            <Link href="/boissons" className="rounded-full border border-frost/25 px-5 py-2.5 text-sm font-bold hover:border-ice hover:text-ice">
              Tout le catalogue →
            </Link>
          </div>
        </Reveal>
        <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {best.map((p, i) => (
            <Reveal key={p.id} delay={(i % 4) * 70}>
              <ProductCard product={p} />
            </Reveal>
          ))}
        </div>
      </section>

      <section className="bg-night-2 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <Reveal>
            <h2 className="font-display text-4xl sm:text-6xl">
              Pourquoi <span className="text-fire">Maguy</span> ?
            </h2>
          </Reveal>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {WHY.map((w, i) => (
              <Reveal key={w.title} delay={i * 80}>
                <div className="glass h-full rounded-3xl p-6">
                  <div className="text-4xl">{w.icon}</div>
                  <h3 className="mt-3 font-display text-2xl">{w.title}</h3>
                  <p className="mt-2 text-sm text-frost/70">{w.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <Reveal>
          <h2 className="font-display text-4xl sm:text-6xl">
            Comment ça <span className="text-ice">marche</span> ?
          </h2>
        </Reveal>
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {STEPS.map((s, i) => (
            <Reveal key={s.n} delay={i * 100}>
              <div className="relative overflow-hidden rounded-3xl border border-frost/10 p-6">
                <span className="text-outline font-display absolute -right-2 -top-4 text-8xl opacity-60">{s.n}</span>
                <h3 className="relative font-display text-3xl text-fire">{s.title}</h3>
                <p className="relative mt-2 text-frost/75">{s.text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section id="livraison" className="scroll-mt-28 bg-night-2 py-16">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 sm:px-6 lg:grid-cols-2">
          <Reveal>
            <h2 className="font-display text-4xl sm:text-6xl">
              Zones de <span className="text-ice">livraison</span>
            </h2>
            <p className="mt-2 text-frost/70">
              Livraison offerte dès <strong className="text-frost">{fcfa(settings.freeDeliveryFrom)}</strong>. Retrait gratuit à la cave.
            </p>
            <ul className="mt-6 grid gap-2 sm:grid-cols-2">
              {settings.zones.map((z) => (
                <li key={z.name} className="glass flex items-center justify-between rounded-2xl px-4 py-3">
                  <div>
                    <p className="font-semibold">{z.name}</p>
                    <p className="text-xs text-frost/60">{z.eta}</p>
                  </div>
                  <span className="font-display text-lg text-fire">{fcfa(z.fee)}</span>
                </li>
              ))}
            </ul>
          </Reveal>
          <Reveal delay={120}>
            <div className="glass h-full rounded-3xl p-6">
              <h3 className="font-display text-3xl">Horaires</h3>
              <ul className="mt-4 space-y-3">
                {settings.hours.map((h) => (
                  <li key={h.days} className="flex justify-between border-b border-frost/10 pb-2">
                    <span>{h.days}</span>
                    <span className="font-semibold text-ice">{h.open} – {h.close}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-5 text-sm text-frost/70">📍 {settings.address}</p>
              <p className="text-sm text-frost/70">📞 {settings.phone}</p>
              <a
                href={whatsappLink(settings, "Bonjour Maguy, je voudrais passer une commande 🍺")}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-5 inline-block rounded-full bg-[#25d366] px-6 py-3 font-bold text-white hover:brightness-110"
              >
                Commander sur WhatsApp
              </a>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <Reveal>
          <h2 className="font-display text-4xl sm:text-6xl">
            Ils ont <span className="text-fire">goûté</span>
          </h2>
        </Reveal>
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {REVIEWS.map((r, i) => (
            <Reveal key={r.name} delay={i * 90}>
              <figure className="glass h-full rounded-3xl p-6">
                <div className="text-gold" aria-label="5 étoiles">★★★★★</div>
                <blockquote className="mt-3 text-frost/85">« {r.text} »</blockquote>
                <figcaption className="mt-4 text-sm font-semibold">
                  {r.name} <span className="font-normal text-frost/50">· {r.place}</span>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="px-4 pb-4 sm:px-6">
        <Reveal>
          <div className="mx-auto max-w-7xl overflow-hidden rounded-[2rem] bg-gradient-to-br from-fire to-[#ff3d00] p-8 text-center sm:p-14">
            <h2 className="font-display text-4xl sm:text-6xl">La soif n&apos;attend pas.</h2>
            <p className="mx-auto mt-2 max-w-xl text-white/90">Commande maintenant, on s&apos;occupe du reste. Bien glacé, bien livré.</p>
            <Link href="/boissons" className="mt-6 inline-block rounded-full bg-frost px-8 py-4 font-extrabold text-night transition hover:scale-105">
              Je commande →
            </Link>
          </div>
        </Reveal>
      </section>
    </>
  );
}
