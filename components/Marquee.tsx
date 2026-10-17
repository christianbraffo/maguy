const ITEMS = ["Bien glacé", "Livraison rapide", "Prix tout doux", "Paiement à la livraison", "Retrait à la cave", "Packs soirée"];

export default function Marquee() {
  const row = [...ITEMS, ...ITEMS];
  return (
    <div className="overflow-hidden border-y border-frost/10 bg-ice py-3 text-frost" aria-hidden>
      <div className="marquee-track">
        {[0, 1].map((k) => (
          <div key={k} className="flex shrink-0 items-center">
            {row.map((t, i) => (
              <span key={`${k}-${i}`} className="flex items-center font-display text-xl sm:text-2xl">
                <span className="px-6">{t}</span>
                <span className="text-fire">✦</span>
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
