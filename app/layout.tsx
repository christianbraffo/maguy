import type { Metadata, Viewport } from "next";
import { Anton, Poppins } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/lib/cart";
import { getActiveProducts, getSettings } from "@/lib/db";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CartDrawer from "@/components/CartDrawer";
import WhatsAppFab from "@/components/WhatsAppFab";

export const dynamic = "force-dynamic";

const display = Anton({ weight: "400", subsets: ["latin"], variable: "--f-display" });
const body = Poppins({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--f-body",
});

export const metadata: Metadata = {
  title: {
    default: "Maguy – Boissons bien glacées livrées à Abidjan",
    template: "%s | Maguy",
  },
  description:
    "Bières, sodas, jus, eaux et boissons énergisantes bien glacés. Commande en ligne, livraison rapide à Abidjan ou retrait à la cave.",
};

export const viewport: Viewport = {
  themeColor: "#faf6f0",
};

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const [products, settings] = await Promise.all([getActiveProducts(), getSettings()]);
  return (
    <html lang="fr" className={`${display.variable} ${body.variable}`}>
      <body className="min-h-dvh flex flex-col">
        <CartProvider catalog={products}>
          <Header settings={settings} />
          <main className="flex-1">{children}</main>
          <Footer settings={settings} />
          <CartDrawer settings={settings} />
          <WhatsAppFab settings={settings} />
        </CartProvider>
      </body>
    </html>
  );
}
