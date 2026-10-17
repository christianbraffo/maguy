import { getOrders } from "@/lib/db";
import { STATUS_LABEL, type OrderStatus } from "@/lib/types";
import OrdersList from "./OrdersList";

export default async function CommandesPage({ searchParams }: { searchParams: Promise<{ s?: string }> }) {
  const { s } = await searchParams;
  const orders = await getOrders();
  const filter = s && s in STATUS_LABEL ? (s as OrderStatus) : "all";
  return (
    <div className="space-y-6">
      <h1 className="font-display text-4xl sm:text-5xl">Commandes</h1>
      <OrdersList orders={orders} initialFilter={filter} />
    </div>
  );
}
