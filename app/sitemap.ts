import type { MetadataRoute } from "next";
import { getActiveProducts } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = process.env.SITE_URL || "http://localhost:3000";
  const products = await getActiveProducts();
  return [
    { url: base, changeFrequency: "daily", priority: 1 },
    { url: `${base}/boissons`, changeFrequency: "daily", priority: 0.9 },
    ...products.map((p) => ({ url: `${base}/boissons/${p.id}`, changeFrequency: "weekly" as const, priority: 0.7 })),
  ];
}
