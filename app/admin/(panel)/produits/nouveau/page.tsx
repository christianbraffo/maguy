import ProductForm from "../ProductForm";

export default function NouveauProduit() {
  return (
    <div className="space-y-6">
      <h1 className="font-display text-4xl sm:text-5xl">Nouveau produit</h1>
      <ProductForm />
    </div>
  );
}
