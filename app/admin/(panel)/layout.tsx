import Link from "next/link";
import { redirect } from "next/navigation";
import { isAdmin } from "@/lib/auth";
import { getOrders } from "@/lib/db";
import { logout } from "../actions";
import AdminNav from "./AdminNav";

export const metadata = { title: "Admin", robots: { index: false } };

export default async function PanelLayout({ children }: { children: React.ReactNode }) {
  if (!(await isAdmin())) redirect("/admin/login");
  const newCount = (await getOrders()).filter((o) => o.status === "nouvelle").length;
  return (
    <div className="min-h-dvh bg-night">
      <header className="sticky top-0 z-30 border-b border-frost/10 bg-night-2/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-6">
          <div className="flex items-center gap-3">
            <Link href="/admin" className="rounded-b-xl bg-ice px-3 pb-1.5 pt-2 font-display text-2xl leading-none text-frost">Maguy</Link>
            <span className="text-xs font-semibold uppercase tracking-widest text-frost/50">Admin</span>
          </div>
          <AdminNav newCount={newCount} />
          <div className="flex items-center gap-2">
            <Link href="/" target="_blank" className="rounded-full border border-frost/20 px-4 py-2 text-sm hover:border-ice">Voir le site ↗</Link>
            <form action={logout}>
              <button className="rounded-full bg-frost/10 px-4 py-2 text-sm hover:bg-frost/20">Déconnexion</button>
            </form>
          </div>
        </div>
      </header>
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">{children}</div>
    </div>
  );
}
