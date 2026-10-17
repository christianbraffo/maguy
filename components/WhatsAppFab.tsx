"use client";

import { usePathname } from "next/navigation";
import type { Settings } from "@/lib/types";
import { whatsappLink } from "@/lib/shop";

export default function WhatsAppFab({ settings }: { settings: Settings }) {
  const path = usePathname();
  if (path.startsWith("/admin")) return null;
  return (
    <a
      href={whatsappLink(settings, "Bonjour Maguy, je voudrais passer une commande 🍺")}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Commander sur WhatsApp"
      className="pulse-ring fixed bottom-5 right-5 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-[#25d366] text-white shadow-xl transition hover:scale-110"
    >
      <svg viewBox="0 0 32 32" className="h-7 w-7" fill="currentColor" aria-hidden>
        <path d="M19.1 17.4c-.3-.1-1.7-.8-2-.9-.3-.1-.5-.1-.7.1-.2.3-.8.9-.9 1.1-.2.2-.3.2-.6.1-.3-.1-1.2-.4-2.3-1.4-.9-.8-1.4-1.7-1.6-2-.2-.3 0-.4.1-.6l.4-.5c.1-.1.2-.3.3-.5.1-.2 0-.4 0-.5-.1-.1-.7-1.6-.9-2.2-.2-.6-.5-.5-.7-.5h-.6c-.2 0-.5.1-.8.4-.3.3-1 1-1 2.5s1.1 2.9 1.2 3.1c.1.2 2.100 3.200 5.100 4.500.7.3 1.300.5 1.700.6.7.2 1.400.2 1.900.1.600-.1 1.700-.7 2-1.400.2-.7.2-1.300.2-1.400-.1-.1-.3-.2-.6-.3zM16 4C9.400 4 4 9.400 4 16c0 2.100.6 4.200 1.600 6L4 28l6.200-1.600c1.700.9 3.700 1.400 5.800 1.400 6.600 0 12-5.400 12-12S22.600 4 16 4zm0 21.900c-1.900 0-3.700-.5-5.300-1.500l-.4-.2-3.700 1 1-3.600-.2-.4c-1-1.600-1.600-3.500-1.600-5.500 0-5.500 4.500-10 10-10s10 4.500 10 10-4.500 10.200-9.800 10.200z" />
      </svg>
    </a>
  );
}
