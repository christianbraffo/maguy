import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getActiveProducts } from "@/lib/db";
import ProductDetail from "@/components/ProductDetail";
import ProductCard from "@/components/ProductCard";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const p = (await getActiveProducts()).find((x) => x.id === id);
  return p ? { title: `${p.name} – ${p.brand}`, description: p.description } : { title: "Produit introuvable" };
}

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const all = await getActiveProducts();
  const product = all.find((p) => p.id === id);
  if (!product) notFound();
  const related = all.filter((p) => p.category === product.category && p.id !== product.id).slice(0, 4);
  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <ProductDetail product={product} />
      {related.length > 0 && (
        <section className="mt-20">
          <h2 className="font-display text-4xl">Tu aimeras aussi</h2>
          <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {related.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        </section>
      )}
    </div>
  );
}
