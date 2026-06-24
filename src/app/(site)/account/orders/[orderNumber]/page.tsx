import { getServerSession } from "next-auth";
import Link from "next/link";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { formatOrderDate, orderStatusLabels, paymentStatusLabels } from "@/lib/order-labels";
import { formatPrice } from "@/lib/utils";

export default async function OrderDetailPage({
  params,
}: {
  params: { orderNumber: string };
}) {
  const session = await getServerSession(authOptions);
  if (!session?.user || session.user.userType !== "customer") {
    redirect("/");
  }

  const order = await prisma.order.findFirst({
    where: {
      orderNumber: params.orderNumber,
      customerId: session.user.id,
    },
    include: {
      items: {
        include: { product: { select: { name: true, sku: true } } },
      },
    },
  });

  if (!order) {
    redirect("/account");
  }

  return (
    <main className="page-wrap account-page">
      <p className="eyebrow" style={{ marginBottom: 16 }}>
        <Link href="/account" className="hover:text-sage">
          ← My account
        </Link>
      </p>
      <h1 className="account-page-title">{order.orderNumber}</h1>
      <p className="account-order-date" style={{ marginBottom: 24 }}>
        Placed {formatOrderDate(order.createdAt)}
      </p>

      <section className="account-card">
        <h2 className="account-card-title">Status</h2>
        <div className="account-order-badges" style={{ marginBottom: 0 }}>
          <span className="account-badge">{paymentStatusLabels[order.paymentStatus]}</span>
          <span className="account-badge account-badge-muted">
            {orderStatusLabels[order.orderStatus]}
          </span>
        </div>
        {order.trackingNo && (
          <p className="account-order-tracking" style={{ marginTop: 16 }}>
            Tracking number: <strong>{order.trackingNo}</strong>
          </p>
        )}
      </section>

      <section className="account-card">
        <h2 className="account-card-title">Items</h2>
        <ul className="account-order-items">
          {order.items.map((item) => (
            <li key={item.id}>
              <span>{item.product.name}</span>
              {item.product.sku && (
                <span className="account-order-sku"> · SKU {item.product.sku}</span>
              )}
              <span> — × {item.quantity} — {formatPrice(item.price * item.quantity)}</span>
            </li>
          ))}
        </ul>
        <dl className="account-summary">
          <div>
            <dt>Subtotal</dt>
            <dd>{formatPrice(order.subtotal)}</dd>
          </div>
          <div>
            <dt>Shipping</dt>
            <dd>{formatPrice(order.shipping)}</dd>
          </div>
          <div className="account-summary-total">
            <dt>Total</dt>
            <dd>{formatPrice(order.total)}</dd>
          </div>
        </dl>
      </section>
    </main>
  );
}
