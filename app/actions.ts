"use server";

import { randomBytes } from "crypto";
import { revalidatePath } from "next/cache";
import { getOrders, getProducts, getSettings, saveOrders, saveProducts, withLock } from "@/lib/db";
import type { CartLine, Order, OrderItem } from "@/lib/types";

export type PlaceOrderInput = {
  name: string;
  phone: string;
  mode: "livraison" | "retrait";
  zone: string;
  address: string;
  note: string;
  lines: CartLine[];
};

export type PlaceOrderResult = { ok: true; id: string } | { ok: false; error: string };

function newId() {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const bytes = randomBytes(6);
  return "MG-" + Array.from(bytes, (b) => alphabet[b % alphabet.length]).join("");
}

export async function placeOrder(input: PlaceOrderInput): Promise<PlaceOrderResult> {
  const name = String(input.name ?? "").trim().slice(0, 80);
  const phone = String(input.phone ?? "").replace(/[\s.\-()]/g, "");
  const note = String(input.note ?? "").trim().slice(0, 300);
  const address = String(input.address ?? "").trim().slice(0, 200);
  const mode = input.mode === "retrait" ? "retrait" : "livraison";

  if (name.length < 2) return { ok: false, error: "Indique ton nom." };
  if (!/^(\+?225)?\d{8,10}$/.test(phone)) return { ok: false, error: "Numéro de téléphone invalide." };
  if (!Array.isArray(input.lines) || input.lines.length === 0) return { ok: false, error: "Ton panier est vide." };
  if (input.lines.length > 60) return { ok: false, error: "Panier trop volumineux." };

  const settings = await getSettings();
  let zoneName = "";
  let fee = 0;
  if (mode === "livraison") {
    const zone = settings.zones.find((z) => z.name === input.zone);
    if (!zone) return { ok: false, error: "Choisis ton quartier de livraison." };
    if (address.length < 4) return { ok: false, error: "Indique ton adresse ou un point de repère." };
    zoneName = zone.name;
    fee = zone.fee;
  }

  return withLock(async () => {
    const products = await getProducts();
    const items: OrderItem[] = [];
    // regroupe les doublons éventuels
    const merged = new Map<string, number>();
    for (const l of input.lines) {
      const qty = Math.floor(Number(l.qty));
      if (!Number.isFinite(qty) || qty <= 0 || qty > 500) return { ok: false as const, error: "Quantité invalide." };
      const key = `${l.productId}\u0000${l.format}`;
      merged.set(key, (merged.get(key) ?? 0) + qty);
    }

    for (const [key, qty] of merged) {
      const [productId, formatLabel] = key.split("\u0000");
      const product = products.find((p) => p.id === productId && p.active);
      const format = product?.formats.find((f) => f.label === formatLabel);
      if (!product || !format) return { ok: false as const, error: "Un produit de ton panier n'est plus disponible." };
      if (format.stock < qty) {
        return {
          ok: false as const,
          error: format.stock > 0
            ? `Il ne reste que ${format.stock} × ${product.name} (${format.label}).`
            : `${product.name} (${format.label}) est en rupture.`,
        };
      }
      items.push({ productId, name: product.name, format: format.label, price: format.price, qty });
    }

    const subtotal = items.reduce((n, i) => n + i.price * i.qty, 0);
    if (subtotal < settings.minOrder) {
      return { ok: false as const, error: `Commande minimum : ${settings.minOrder} FCFA.` };
    }
    if (mode === "livraison" && subtotal >= settings.freeDeliveryFrom) fee = 0;

    for (const it of items) {
      const p = products.find((x) => x.id === it.productId)!;
      const f = p.formats.find((x) => x.label === it.format)!;
      f.stock -= it.qty;
    }

    const orders = await getOrders();
    let id = newId();
    while (orders.some((o) => o.id === id)) id = newId();

    const order: Order = {
      id,
      createdAt: new Date().toISOString(),
      status: "nouvelle",
      mode,
      customer: { name, phone },
      zone: zoneName,
      address: mode === "livraison" ? address : "",
      note,
      items,
      subtotal,
      fee,
      total: subtotal + fee,
    };
    orders.unshift(order);
    await saveProducts(products);
    await saveOrders(orders);
    revalidatePath("/admin", "layout");
    return { ok: true as const, id };
  });
}
