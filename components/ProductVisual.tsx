import Image from "next/image";
import type { Product } from "@/lib/types";

type Props = { product: Pick<Product, "name" | "brand" | "image" | "color" | "category">; className?: string; priority?: boolean };

/** Photo produit, ou visuel généré (bouteille / canette) tant qu'il n'y a pas de photo. */
export default function ProductVisual({ product, className = "", priority }: Props) {
  if (product.image) {
    return (
      <Image
        src={product.image}
        alt={`${product.brand} ${product.name}`}
        width={600}
        height={800}
        priority={priority}
        unoptimized={product.image.startsWith("/uploads/")}
        className={`object-contain drop-shadow-[0_18px_30px_rgba(59,36,24,0.3)] ${className}`}
      />
    );
  }
  const c = product.color || "#22d3ee";
  const can = product.category === "Énergisantes";
  const label = product.brand.length > 11 ? product.name : product.brand;
  return (
    <svg
      viewBox="0 0 200 300"
      role="img"
      aria-label={`${product.brand} ${product.name}`}
      className={`drop-shadow-[0_18px_30px_rgba(59,36,24,0.3)] ${className}`}
    >
      <defs>
        <linearGradient id={`g-${c.slice(1)}`} x1="0" x2="1">
          <stop offset="0" stopColor={c} stopOpacity="0.75" />
          <stop offset="0.45" stopColor={c} />
          <stop offset="1" stopColor={c} stopOpacity="0.65" />
        </linearGradient>
      </defs>
      {can ? (
        <>
          <rect x="52" y="40" width="96" height="230" rx="14" fill={`url(#g-${c.slice(1)})`} />
          <rect x="58" y="30" width="84" height="16" rx="6" fill="#cfd8e3" />
          <rect x="58" y="262" width="84" height="12" rx="5" fill="#cfd8e3" />
        </>
      ) : (
        <>
          <path
            d="M82 18h36v14l-4 6v46c0 10 28 26 28 60v108c0 12-8 20-20 20h-48c-12 0-20-8-20-20V164c0-34 28-50 28-60V38l-4-6z"
            fill={`url(#g-${c.slice(1)})`}
          />
          <rect x="80" y="8" width="40" height="14" rx="4" fill="#e2e8f0" />
        </>
      )}
      <rect x="62" y="150" width="76" height="70" rx="8" fill="#fff" fillOpacity="0.92" />
      <text x="100" y="180" textAnchor="middle" fontSize="13" fontWeight="800" fill="#3b2418" fontFamily="Impact, sans-serif">
        {label.toUpperCase().slice(0, 12)}
      </text>
      <text x="100" y="200" textAnchor="middle" fontSize="9" fontWeight="600" fill="#334155">
        {product.category.toUpperCase().slice(0, 14)}
      </text>
      <path d="M70 110c-4 30-4 100 0 130" stroke="#fff" strokeOpacity="0.35" strokeWidth="6" strokeLinecap="round" fill="none" />
    </svg>
  );
}
