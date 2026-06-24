import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/utils";
import Link from "next/link";

export default async function OrdersPage() {
  const orders = await prisma.order.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      customer: { select: { name: true, email: true } },
      items: { include: { product: { select: { name: true } } } },
    },
  });

  return (
    <div>
      <h1 className="font-display text-3xl font-light mb-8">Orders</h1>

      <div className="bg-bg-2 border border-border rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-[11px] tracking-widest uppercase text-fg-3 border-b border-border">
              <th className="px-5 py-3 font-normal">Order #</th>
              <th className="px-5 py-3 font-normal">Customer</th>
              <th className="px-5 py-3 font-normal">Items</th>
              <th className="px-5 py-3 font-normal">Total</th>
              <th className="px-5 py-3 font-normal">Payment</th>
              <th className="px-5 py-3 font-normal">Status</th>
              <th className="px-5 py-3 font-normal">Date</th>
            </tr>
          </thead>
          <tbody>
            {orders.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-5 py-8 text-center text-fg-3">
                  No orders yet.
                </td>
              </tr>
            ) : (
              orders.map((order) => (
                <tr key={order.id} className="border-b border-border last:border-0 hover:bg-bg-3/50">
                  <td className="px-5 py-3 font-mono text-xs">
                    <Link href={`/admin/orders/${order.id}`} className="hover:text-sage">
                      {order.orderNumber}
                    </Link>
                  </td>
                  <td className="px-5 py-3">
                    <p>{order.customer.name}</p>
                    <code className="text-fg-3 text-xs">{order.customer.email}</code>
                  </td>
                  <td className="px-5 py-3 text-fg-2">
                    {order.items.map((item) => (
                      <span key={item.id} className="block text-xs">
                        {item.quantity}× {item.product.name}
                      </span>
                    ))}
                  </td>
                  <td className="px-5 py-3">{formatPrice(order.total)}</td>
                  <td className="px-5 py-3">
                    <StatusBadge status={order.paymentStatus} />
                  </td>
                  <td className="px-5 py-3">
                    <StatusBadge status={order.orderStatus} />
                  </td>
                  <td className="px-5 py-3 text-fg-3">
                    {order.createdAt.toLocaleDateString()}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  return (
    <span className="text-[10px] tracking-wider uppercase px-2 py-1 rounded bg-sage-dim text-sage">
      {status}
    </span>
  );
}
