"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { CartLine, Format, Product } from "./types";

export type CartItem = {
  line: CartLine;
  product: Product;
  format: Format;
  subtotal: number;
};

type CartCtx = {
  items: CartItem[];
  count: number;
  subtotal: number;
  ready: boolean;
  open: boolean;
  setOpen: (v: boolean) => void;
  add: (productId: string, format: string, qty?: number) => void;
  setQty: (productId: string, format: string, qty: number) => void;
  remove: (productId: string, format: string) => void;
  clear: () => void;
};

const Ctx = createContext<CartCtx | null>(null);
const KEY = "maguy-cart-v1";

export function CartProvider({
  catalog,
  children,
}: {
  catalog: Product[];
  children: ReactNode;
}) {
  const [lines, setLines] = useState<CartLine[]>([]);
  const [ready, setReady] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setLines(JSON.parse(raw));
    } catch {}
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    try {
      localStorage.setItem(KEY, JSON.stringify(lines));
    } catch {}
  }, [lines, ready]);

  const stockOf = useCallback(
    (productId: string, format: string) =>
      catalog.find((p) => p.id === productId)?.formats.find((f) => f.label === format)
        ?.stock ?? 0,
    [catalog],
  );

  const add = useCallback(
    (productId: string, format: string, qty = 1) => {
      const max = stockOf(productId, format);
      setLines((prev) => {
        const i = prev.findIndex((l) => l.productId === productId && l.format === format);
        if (i >= 0) {
          const next = [...prev];
          next[i] = { ...next[i], qty: Math.min(max, next[i].qty + qty) };
          return next;
        }
        return max > 0 ? [...prev, { productId, format, qty: Math.min(max, qty) }] : prev;
      });
    },
    [stockOf],
  );

  const setQty = useCallback(
    (productId: string, format: string, qty: number) => {
      const max = stockOf(productId, format);
      setLines((prev) =>
        qty <= 0
          ? prev.filter((l) => !(l.productId === productId && l.format === format))
          : prev.map((l) =>
              l.productId === productId && l.format === format
                ? { ...l, qty: Math.min(max, qty) }
                : l,
            ),
      );
    },
    [stockOf],
  );

  const remove = useCallback((productId: string, format: string) => {
    setLines((prev) => prev.filter((l) => !(l.productId === productId && l.format === format)));
  }, []);

  const clear = useCallback(() => setLines([]), []);

  const value = useMemo<CartCtx>(() => {
    const items: CartItem[] = [];
    for (const line of lines) {
      const product = catalog.find((p) => p.id === line.productId);
      const format = product?.formats.find((f) => f.label === line.format);
      if (product && format && format.stock > 0) {
        items.push({
          line: { ...line, qty: Math.min(line.qty, format.stock) },
          product,
          format,
          subtotal: format.price * Math.min(line.qty, format.stock),
        });
      }
    }
    return {
      items,
      count: items.reduce((n, i) => n + i.line.qty, 0),
      subtotal: items.reduce((n, i) => n + i.subtotal, 0),
      ready,
      open,
      setOpen,
      add,
      setQty,
      remove,
      clear,
    };
  }, [lines, catalog, ready, open, add, setQty, remove, clear]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useCart() {
  const c = useContext(Ctx);
  if (!c) throw new Error("useCart hors CartProvider");
  return c;
}
