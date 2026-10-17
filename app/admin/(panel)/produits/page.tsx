import Link from "next/link";
import { getProducts } from "@/lib/db";
import ProductsTable from "./ProductsTable";

export default async function ProduitsPage() {
  const products = await getProducts();
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-display text-4xl sm:text-5xl">Produits & stocks</h1>
        <Link href="/admin/produits/nouveau" className="rounded-full bg-fire px-6 py-3 font-bold text-white hover:bg-fire-dark">
          + Nouveau produit
        </Link>
      </div>
      <ProductsTable products={products} />
    </div>
  );
}
