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
        open ? "bg-leaf/20 text-frost" : "bg-fire/20 text-frost"
      }`}
    >
      <span className={`h-2 w-2 rounded-full ${open ? "bg-fire animate-pulse" : "bg-frost/40"}`} />
      {open ? "Ouvert maintenant" : "Fermé pour le moment"}
    </span>
  );
}
