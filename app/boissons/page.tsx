import type { Metadata } from "next";
import { getActiveProducts } from "@/lib/db";
import { CATEGORIES } from "@/lib/types";
import Catalogue from "@/components/Catalogue";

export const metadata: Metadata = {
  title: "Toutes les boissons",
  description: "Bières, sodas, jus, eaux, boissons énergisantes et packs bien glacés. Prix en FCFA, livraison à Abidjan.",
};

export default async function Boissons({ searchParams }: { searchParams: Promise<{ cat?: string }> }) {
  const { cat } = await searchParams;
  const products = await getActiveProducts();
  const initial = CATEGORIES.includes(cat as never) ? (cat as string) : "Tout";
  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <h1 className="font-display text-5xl sm:text-7xl">
        Nos <span className="text-fire">boissons</span>
      </h1>
      <p className="mb-8 mt-2 text-frost/70">Choisis, ajoute au panier, on te livre bien glacé.</p>
      <Catalogue products={products} initialCat={initial} />
    </div>
  );
}
