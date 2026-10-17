"use server";

import { promises as fs } from "fs";
import path from "path";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { checkPassword, clearAdminCookie, requireAdmin, setAdminCookie } from "@/lib/auth";
import { getOrders, getProducts, getSettings, saveOrders, saveProducts, saveSettings, withLock } from "@/lib/db";
import { slugify } from "@/lib/format";
import { CATEGORIES, type Badge, type Category, type OrderStatus, type Product, type Settings } from "@/lib/types";

export type FormState = { error?: string; ok?: boolean } | undefined;

/* ---------- Auth ---------- */
let fails = 0;
let lockedUntil = 0;

export async function login(_prev: FormState, fd: FormData): Promise<FormState> {
  if (Date.now() < lockedUntil) return { error: "Trop d'essais. Réessaie dans quelques minutes." };
  const pw = String(fd.get("password") ?? "");
  if (!checkPassword(pw)) {
    fails++;
    if (fails >= 8) {
      lockedUntil = Date.now() + 5 * 60_000;
      fails = 0;
    }
    await new Promise((r) => setTimeout(r, 700));
    return { error: "Mot de passe incorrect." };
  }
  fails = 0;
  await setAdminCookie();
  redirect("/admin");
}

export async function logout() {
  await clearAdminCookie();
  redirect("/admin/login");
}

function refresh() {
  revalidatePath("/", "layout");
}

/* ---------- Commandes ---------- */
const STATUSES: OrderStatus[] = ["nouvelle", "preparation", "en_route", "terminee", "annulee"];

export async function setOrderStatus(id: string, status: OrderStatus) {
  await requireAdmin();
  if (!STATUSES.includes(status)) return;
  await withLock(async () => {
    const orders = await getOrders();
    const o = orders.find((x) => x.id === id);
    if (!o || o.status === status || o.status === "annulee") return;
    if (status === "annulee") {
      // remet les stocks
      const products = await getProducts();
      for (const it of o.items) {
        const f = products.find((p) => p.id === it.productId)?.formats.find((x) => x.label === it.format);
        if (f) f.stock += it.qty;
      }
      await saveProducts(products);
    }
    o.status = status;
    await saveOrders(orders);
  });
  refresh();
}

/* ---------- Produits ---------- */
export async function quickUpdateProduct(id: string, patch: { stock?: { label: string; value: number }; active?: boolean; featured?: boolean }) {
  await requireAdmin();
  await withLock(async () => {
    const products = await getProducts();
    const p = products.find((x) => x.id === id);
    if (!p) return;
    if (patch.stock) {
      const f = p.formats.find((x) => x.label === patch.stock!.label);
      if (f) f.stock = Math.max(0, Math.floor(patch.stock.value) || 0);
    }
    if (typeof patch.active === "boolean") p.active = patch.active;
    if (typeof patch.featured === "boolean") p.featured = patch.featured;
    await saveProducts(products);
  });
  refresh();
}

const BADGES: Badge[] = ["", "Best-seller", "Promo", "Nouveau", "Pack"];

async function saveImage(file: File, id: string): Promise<string | { error: string }> {
  const ext = ({ "image/png": ".png", "image/jpeg": ".jpg", "image/webp": ".webp" } as Record<string, string>)[file.type];
  if (!ext) return { error: "Image : PNG, JPG ou WebP uniquement." };
  if (file.size > 5 * 1024 * 1024) return { error: "Image trop lourde (5 Mo max)." };
  const name = `${id}-${Date.now()}${ext}`;
  await fs.mkdir(path.join(process.cwd(), "data", "uploads"), { recursive: true });
  await fs.writeFile(path.join(process.cwd(), "data", "uploads", name), Buffer.from(await file.arrayBuffer()));
  return `/uploads/${name}`;
}

export async function saveProduct(_prev: FormState, fd: FormData): Promise<FormState> {
  await requireAdmin();
  const existingId = String(fd.get("id") ?? "");
  const name = String(fd.get("name") ?? "").trim().slice(0, 80);
  const brand = String(fd.get("brand") ?? "").trim().slice(0, 60);
  const category = String(fd.get("category") ?? "") as Category;
  if (!name) return { error: "Le nom est obligatoire." };
  if (!CATEGORIES.includes(category)) return { error: "Catégorie invalide." };

  let formats: Product["formats"] = [];
  try {
    const raw = JSON.parse(String(fd.get("formats") ?? "[]")) as { label: string; price: number; stock: number }[];
    formats = raw
      .map((f) => ({ label: String(f.label).trim().slice(0, 40), price: Math.max(0, Math.round(Number(f.price))), stock: Math.max(0, Math.floor(Number(f.stock))) }))
      .filter((f) => f.label);
  } catch {
    return { error: "Formats invalides." };
  }
  if (formats.length === 0) return { error: "Ajoute au moins un format avec un prix." };
  if (new Set(formats.map((f) => f.label)).size !== formats.length) return { error: "Deux formats ont le même nom." };
  if (formats.some((f) => !Number.isFinite(f.price) || f.price <= 0)) return { error: "Chaque format doit avoir un prix supérieur à 0." };

  const badge = String(fd.get("badge") ?? "") as Badge;

  const result = await withLock(async (): Promise<FormState & { id?: string }> => {
    const products = await getProducts();
    let p = existingId ? products.find((x) => x.id === existingId) : undefined;
    const isNew = !p;
    if (!p) {
      let id = slugify(name) || "produit";
      const base = id;
      let n = 2;
      while (products.some((x) => x.id === id)) id = `${base}-${n++}`;
      p = { id, name, brand, category, description: "", image: "", color: "#22d3ee", badge: "", oldPrice: 0, featured: false, active: true, formats };
    }
    p.name = name;
    p.brand = brand;
    p.category = category;
    p.description = String(fd.get("description") ?? "").trim().slice(0, 500);
    p.color = /^#[0-9a-f]{6}$/i.test(String(fd.get("color"))) ? String(fd.get("color")) : p.color;
    p.badge = BADGES.includes(badge) ? badge : "";
    p.oldPrice = Math.max(0, Math.round(Number(fd.get("oldPrice")) || 0));
    p.featured = fd.get("featured") === "on";
    p.active = fd.get("active") === "on";
    p.formats = formats;

    if (fd.get("removeImage") === "on") p.image = "";
    const file = fd.get("image");
    if (file instanceof File && file.size > 0) {
      const saved = await saveImage(file, p.id);
      if (typeof saved !== "string") return saved;
      p.image = saved;
    }
    if (isNew) products.push(p);
    await saveProducts(products);
    return { ok: true, id: p.id };
  });
  if (result?.error) return { error: result.error };
  refresh();
  redirect("/admin/produits");
}

export async function deleteProduct(id: string) {
  await requireAdmin();
  await withLock(async () => {
    const products = await getProducts();
    await saveProducts(products.filter((p) => p.id !== id));
  });
  refresh();
  redirect("/admin/produits");
}

/* ---------- Paramètres ---------- */
export async function saveSettingsAction(_prev: FormState, fd: FormData): Promise<FormState> {
  await requireAdmin();
  try {
    const current = await getSettings();
    const zones = (JSON.parse(String(fd.get("zones") ?? "[]")) as Settings["zones"])
      .map((z) => ({ name: String(z.name).trim().slice(0, 50), fee: Math.max(0, Math.round(Number(z.fee))), eta: String(z.eta).trim().slice(0, 30) }))
      .filter((z) => z.name);
    const hours = (JSON.parse(String(fd.get("hours") ?? "[]")) as Settings["hours"])
      .map((h) => ({ days: String(h.days).trim().slice(0, 40), open: String(h.open), close: String(h.close) }))
      .filter((h) => h.days && /^\d{2}:\d{2}$/.test(h.open) && /^\d{2}:\d{2}$/.test(h.close));
    const whatsapp = String(fd.get("whatsapp") ?? "").replace(/\D/g, "");
    if (whatsapp.length < 8) return { error: "Numéro WhatsApp invalide (format international, ex : 2250700000000)." };
    const next: Settings = {
      ...current,
      shopName: String(fd.get("shopName") ?? "").trim().slice(0, 30) || current.shopName,
      tagline: String(fd.get("tagline") ?? "").trim().slice(0, 120),
      whatsapp,
      phone: String(fd.get("phone") ?? "").trim().slice(0, 30),
      address: String(fd.get("address") ?? "").trim().slice(0, 150),
      banner: String(fd.get("banner") ?? "").trim().slice(0, 140),
      freeDeliveryFrom: Math.max(0, Math.round(Number(fd.get("freeDeliveryFrom")) || 0)),
      minOrder: Math.max(0, Math.round(Number(fd.get("minOrder")) || 0)),
      zones,
      hours,
    };
    await saveSettings(next);
  } catch {
    return { error: "Données invalides." };
  }
  refresh();
  return { ok: true };
}
