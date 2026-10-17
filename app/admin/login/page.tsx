import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { isAdmin } from "@/lib/auth";
import LoginForm from "./LoginForm";

export const metadata: Metadata = { title: "Connexion admin", robots: { index: false } };

export default async function LoginPage() {
  if (await isAdmin()) redirect("/admin");
  return (
    <div className="bg-frost-glow flex min-h-dvh items-center justify-center px-4">
      <div className="glass w-full max-w-sm rounded-3xl p-8">
        <span className="rounded-b-xl bg-ice px-3 pb-1.5 pt-2 font-display text-3xl leading-none text-frost">Maguy</span>
        <h1 className="mt-5 font-display text-3xl">Espace admin</h1>
        <p className="mb-5 text-sm text-frost/70">Connecte-toi pour gérer ta cave.</p>
        <LoginForm />
      </div>
    </div>
  );
}
