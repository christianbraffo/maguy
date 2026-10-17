"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import type { Product, Settings } from "@/lib/types";
import ProductVisual from "./ProductVisual";
import OpenBadge from "./OpenBadge";

/** Héro parallax : le gros titre passe DERRIÈRE les bouteilles. */
export default function Hero({ products, settings }: { products: Product[]; settings: Settings }) {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let raf = 0;
    const update = () => {
      raf = 0;
      const y = Math.min(window.scrollY, 900);
      el.style.setProperty("--y", String(y));
    };
    const on = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", on, { passive: true });
    return () => {
      window.removeEventListener("scroll", on);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  // 5 bouteilles en éventail
  const stars = products.slice(0, 5);
  const layout = [
    { x: 16, h: 66, rot: -9, speed: 0.18, z: 1 },
    { x: 33, h: 78, rot: -4, speed: 0.28, z: 2 },
    { x: 50, h: 95, rot: 0, speed: 0.4, z: 4 },
    { x: 67, h: 78, rot: 4, speed: 0.28, z: 2 },
    { x: 84, h: 66, rot: 9, speed: 0.18, z: 1 },
  ];

  return (
    <section ref={root} className="bg-frost-glow relative isolate overflow-hidden" style={{ ["--y" as string]: 0 }}>
      {/* bulles */}
      <div className="pointer-events-none absolute inset-0 -z-10" aria-hidden>
        {[8, 18, 30, 44, 58, 70, 82, 92].map((l, i) => (
          <span
            key={i}
            className="bubble"
            style={{ left: `${l}%`, bottom: `${(i * 13) % 40}%`, width: 8 + (i % 4) * 6, height: 8 + (i % 4) * 6, animationDelay: `${i * 0.9}s` }}
          />
        ))}
      </div>

      <div className="mx-auto flex min-h-[calc(100dvh-6.5rem)] max-w-7xl flex-col justify-between px-4 pb-10 pt-8 sm:px-6">
        <div className="flex flex-wrap items-center gap-3">
          <OpenBadge settings={settings} />
          <span className="rounded-full bg-frost/10 px-3 py-1 text-xs font-semibold text-ice">❄️ Glacé à 3°C</span>
          <span className="rounded-full bg-frost/10 px-3 py-1 text-xs font-semibold text-gold">🚚 Livraison 30 min</span>
        </div>

        <div className="relative my-6 flex flex-1 flex-col justify-center">
          {/* Titre géant derrière */}
          <h1
            className="font-display pointer-events-none select-none text-center text-[clamp(6.5rem,32vw,19rem)] sm:text-[clamp(5rem,22vw,19rem)] leading-[0.85] will-change-transform"
            style={{ transform: "translate3d(0, calc(var(--y) * 0.12px), 0)" }}
          >
            <span className="block text-frost">T&apos;as</span>
            <span className="block bg-gradient-to-r from-ice via-frost to-fire bg-clip-text text-transparent">soif ?</span>
          </h1>

          {/* Bouteilles devant */}
          <div className="pointer-events-none absolute inset-x-0 bottom-0 top-[48%] z-10 sm:top-[18%]" aria-hidden>
            {stars.map((p, i) => {
              const l = layout[i];
              return (
                <div
                  key={p.id}
                  className="absolute bottom-0 flex items-end will-change-transform"
                  style={{
                    left: `${l.x}%`,
                    height: `${l.h}%`,
                    zIndex: l.z,
                    transform: `translate3d(-50%, calc(var(--y) * -${l.speed}px), 0) rotate(${l.rot}deg)`,
                  }}
                >
                  <ProductVisual product={p} priority={i === 2} className="h-full w-auto" />
                </div>
              );
            })}
          </div>
        </div>

        <div className="relative z-20 grid items-end gap-6 md:grid-cols-[1fr_auto]">
          <div>
            <p className="max-w-xl text-base text-frost/80 sm:text-lg">
              Bières, sodas, jus et boissons énergisantes <strong className="text-frost">bien glacés</strong>, livrés
              chez toi à Abidjan ou prêts à récupérer à la cave. Commande en 3 clics, sans compte.
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <Link
                href="/boissons"
                className="rounded-full bg-fire px-7 py-4 text-base font-extrabold text-white shadow-xl shadow-fire/40 transition hover:-translate-y-0.5 hover:bg-fire-dark active:scale-95"
              >
                Commander maintenant →
              </Link>
              <Link
                href="/boissons?cat=Packs"
                className="rounded-full border border-frost/25 px-7 py-4 text-base font-bold transition hover:border-ice hover:text-ice"
              >
                Voir les packs soirée
              </Link>
            </div>
          </div>

          <a href="#categories" className="relative hidden h-28 w-28 items-center justify-center md:flex" aria-label="Défiler vers le bas">
            <svg viewBox="0 0 120 120" className="spin-slow absolute inset-0 h-full w-full" aria-hidden>
              <defs>
                <path id="circ" d="M60 60 m-46 0 a46 46 0 1 1 92 0 a46 46 0 1 1 -92 0" />
              </defs>
              <text fontSize="11.5" fontWeight="600" letterSpacing="3.2" fill="#0e9bb5">
                <textPath href="#circ">SCROLL · DOWN · BIEN GLACÉ ·</textPath>
              </text>
            </svg>
            <span className="text-3xl text-frost">↓</span>
          </a>
        </div>
      </div>
    </section>
  );
}
