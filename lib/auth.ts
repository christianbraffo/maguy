import "server-only";
import { createHmac, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";

const COOKIE = "maguy_admin";

function secret() {
  return process.env.ADMIN_SECRET || "maguy-dev-secret-change-me";
}
function password() {
  return process.env.ADMIN_PASSWORD || "maguy2026";
}
function token() {
  return createHmac("sha256", secret()).update(password()).digest("hex");
}

export function checkPassword(input: string): boolean {
  const a = Buffer.from(createHmac("sha256", secret()).update(input).digest("hex"));
  const b = Buffer.from(token());
  return a.length === b.length && timingSafeEqual(a, b);
}

export async function isAdmin(): Promise<boolean> {
  const store = await cookies();
  const v = store.get(COOKIE)?.value;
  if (!v) return false;
  const a = Buffer.from(v);
  const b = Buffer.from(token());
  return a.length === b.length && timingSafeEqual(a, b);
}

export async function requireAdmin() {
  if (!(await isAdmin())) throw new Error("Non autorisé");
}

export async function setAdminCookie() {
  const store = await cookies();
  store.set(COOKIE, token(), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 12,
  });
}

export async function clearAdminCookie() {
  (await cookies()).delete(COOKIE);
}
