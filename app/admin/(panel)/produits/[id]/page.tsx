import { notFound } from "next/navigation";
import { getProducts } from "@/lib/db";
import ProductForm from "../ProductForm";

export default async function EditProduit({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = (await getProducts()).find((p) => p.id === id);
  if (!product) notFound();
  return (
    <div className="space-y-6">
      <h1 className="font-display text-4xl sm:text-5xl">Modifier <span className="text-fire">{product.name}</span></h1>
      <ProductForm key={product.id} product={product} />
    </div>
  );
}
