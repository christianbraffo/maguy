import type { Product, Settings } from "./types";

export function minPrice(p: Product): number {
  const prices = p.formats.filter((f) => f.stock > 0).map((f) => f.price);
  return prices.length ? Math.min(...prices) : (p.formats[0]?.price ?? 0);
}

export function inStock(p: Product): boolean {
  return p.formats.some((f) => f.stock > 0);
}

export function whatsappLink(settings: Settings, text: string): string {
  return `https://wa.me/${settings.whatsapp}?text=${encodeURIComponent(text)}`;
}

// Parse "HH:MM" -> minutes
function mins(t: string) {
  const [h, m] = t.split(":").map(Number);
  return h * 60 + (m || 0);
}

const DAY_RANGES: Record<string, number[]> = {};
function daysOf(label: string): number[] {
  if (DAY_RANGES[label]) return DAY_RANGES[label];
  const names = ["dimanche", "lundi", "mardi", "mercredi", "jeudi", "vendredi", "samedi"];
  const norm = label
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "");
  const found = norm.split(/[–-]/).map((s) => names.findIndex((n) => s.trim().startsWith(n)));
  let out: number[] = [];
  if (found.length === 2 && found[0] >= 0 && found[1] >= 0) {
    let d = found[0];
    out.push(d);
    while (d !== found[1]) {
      d = (d + 1) % 7;
      out.push(d);
    }
  } else {
    out = found.filter((d) => d >= 0);
  }
  DAY_RANGES[label] = out;
  return out;
}

/** Ouvert maintenant (heure d'Abidjan, GMT). */
export function isOpenNow(settings: Settings, now = new Date()): boolean {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Africa/Abidjan",
    weekday: "short",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).formatToParts(now);
  const wd = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].indexOf(
    parts.find((p) => p.type === "weekday")!.value,
  );
  const cur =
    Number(parts.find((p) => p.type === "hour")!.value) * 60 +
    Number(parts.find((p) => p.type === "minute")!.value);
  for (const h of settings.hours) {
    const days = daysOf(h.days);
    const open = mins(h.open);
    const close = mins(h.close);
    if (close > open) {
      if (days.includes(wd) && cur >= open && cur < close) return true;
    } else {
      // passe minuit
      if (days.includes(wd) && cur >= open) return true;
      if (days.includes((wd + 6) % 7) && cur < close) return true;
    }
  }
  return false;
}
