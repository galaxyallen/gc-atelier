import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import OrderDetailForm from "@/components/admin/orders/OrderDetailForm";

export default async function OrderDetailPage({ params }: { params: { id: string } }) {
  const order = await prisma.order.findUnique({
    where: { id: params.id },
    include: {
      customer: true,
      items: { include: { product: { select: { name: true } } } },
    },
  });

  if (!order) notFound();

  return (
    <OrderDetailForm
      order={{
        id: order.id,
        orderNumber: order.orderNumber,
        subtotal: order.subtotal,
        shipping: order.shipping,
        total: order.total,
        paymentStatus: order.paymentStatus,
        orderStatus: order.orderStatus,
        trackingNo: order.trackingNo,
        notes: order.notes,
        createdAt: order.createdAt.toISOString(),
        customer: order.customer,
        items: order.items,
      }}
    />
  );
}
