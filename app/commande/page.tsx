import type { Metadata } from "next";
import { getSettings } from "@/lib/db";
import CheckoutForm from "@/components/CheckoutForm";

export const metadata: Metadata = { title: "Finaliser ma commande" };

export default async function Commande() {
  const settings = await getSettings();
  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <h1 className="font-display text-5xl sm:text-6xl">
        Finaliser ma <span className="text-fire">commande</span>
      </h1>
      <p className="mb-8 mt-2 text-frost/70">Deux minutes et c&apos;est parti. Pas de compte à créer.</p>
      <CheckoutForm settings={settings} />
    </div>
  );
}
