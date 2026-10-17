import "server-only";
import { promises as fs } from "fs";
import path from "path";
import type { Order, Product, Settings } from "./types";

const DIR = path.join(process.cwd(), "data");

async function read<T>(file: string): Promise<T> {
  const raw = await fs.readFile(path.join(DIR, file), "utf8");
  return JSON.parse(raw) as T;
}

// Écriture atomique + file d'attente pour éviter les écritures concurrentes.
let queue: Promise<unknown> = Promise.resolve();
function write(file: string, data: unknown): Promise<void> {
  const job = queue.then(async () => {
    const target = path.join(DIR, file);
    const tmp = `${target}.${process.pid}.tmp`;
    await fs.writeFile(tmp, JSON.stringify(data, null, 2), "utf8");
    await fs.rename(tmp, target);
  });
  queue = job.catch(() => undefined);
  return job;
}

// Verrou pour les cycles lecture-modification-écriture (stocks, commandes).
let lock: Promise<unknown> = Promise.resolve();
export function withLock<T>(fn: () => Promise<T>): Promise<T> {
  const run = lock.then(fn, fn);
  lock = run.catch(() => undefined);
  return run;
}

export const getProducts = () => read<Product[]>("products.json");
export const saveProducts = (p: Product[]) => write("products.json", p);
export const getOrders = () => read<Order[]>("orders.json");
export const saveOrders = (o: Order[]) => write("orders.json", o);
export const getSettings = () => read<Settings>("settings.json");
export const saveSettings = (s: Settings) => write("settings.json", s);

export async function getActiveProducts() {
  return (await getProducts()).filter((p) => p.active);
}
