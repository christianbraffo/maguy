import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-xl flex-col items-center px-4 py-24 text-center">
      <p className="text-6xl">🧊</p>
      <h1 className="mt-4 font-display text-6xl">Page <span className="text-fire">introuvable</span></h1>
      <p className="mt-3 text-frost/70">Cette page a fondu comme un glaçon. Retourne à la cave.</p>
      <Link href="/boissons" className="mt-6 rounded-full bg-fire px-7 py-3 font-bold text-white hover:bg-fire-dark">Voir les boissons</Link>
    </div>
  );
}
