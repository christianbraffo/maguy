export type Category =
  | "Bières"
  | "Sodas"
  | "Jus"
  | "Eaux"
  | "Énergisantes"
  | "Vins & Liqueurs"
  | "Packs";

export const CATEGORIES: Category[] = [
  "Bières",
  "Sodas",
  "Jus",
  "Eaux",
  "Énergisantes",
  "Vins & Liqueurs",
  "Packs",
];

export const ALCOHOL_CATEGORIES: Category[] = ["Bières", "Vins & Liqueurs"];

export type Format = { label: string; price: number; stock: number };

export type Badge = "Best-seller" | "Promo" | "Nouveau" | "Pack" | "";

export type Product = {
  id: string;
  name: string;
  brand: string;
  category: Category;
  description: string;
  image: string; // chemin public, vide = visuel généré
  color: string; // couleur du visuel généré
  badge: Badge;
  oldPrice: number; // prix barré (0 = aucun), s'applique au premier format
  featured: boolean;
  active: boolean;
  formats: Format[];
};

export type DeliveryZone = { name: string; fee: number; eta: string };

export type Settings = {
  shopName: string;
  tagline: string;
  whatsapp: string; // format international sans +, ex 2250700000000
  phone: string;
  address: string;
  hours: { days: string; open: string; close: string }[];
  zones: DeliveryZone[];
  freeDeliveryFrom: number;
  minOrder: number;
  banner: string;
};

export type OrderStatus =
  | "nouvelle"
  | "preparation"
  | "en_route"
  | "terminee"
  | "annulee";

export const STATUS_LABEL: Record<OrderStatus, string> = {
  nouvelle: "Nouvelle",
  preparation: "En préparation",
  en_route: "En route / Prête",
  terminee: "Terminée",
  annulee: "Annulée",
};

export type OrderItem = {
  productId: string;
  name: string;
  format: string;
  price: number;
  qty: number;
};

export type Order = {
  id: string;
  createdAt: string;
  status: OrderStatus;
  mode: "livraison" | "retrait";
  customer: { name: string; phone: string };
  zone: string;
  address: string;
  note: string;
  items: OrderItem[];
  subtotal: number;
  fee: number;
  total: number;
};

export type CartLine = { productId: string; format: string; qty: number };
