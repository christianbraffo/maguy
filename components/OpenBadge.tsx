"use client";

import { useEffect, useState } from "react";
import type { Settings } from "@/lib/types";
import { isOpenNow } from "@/lib/shop";

export default function OpenBadge({ settings }: { settings: Settings }) {
  const [open, setOpen] = useState<boolean | null>(null);
  useEffect(() => {
    const tick = () => setOpen(isOpenNow(settings));
    tick();
    const id = setInterval(tick, 60000);
    return () => clearInterval(id);
  }, [settings]);
  if (open === null) return null;
  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold ${
        open ? "bg-leaf/20 text-emerald-300" : "bg-red-500/20 text-red-300"
      }`}
    >
      <span className={`h-2 w-2 rounded-full ${open ? "bg-emerald-400 animate-pulse" : "bg-red-400"}`} />
      {open ? "Ouvert maintenant" : "Fermé pour le moment"}
    </span>
  );
}
