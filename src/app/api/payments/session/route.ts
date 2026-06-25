import { NextRequest, NextResponse } from "next/server";
import { fulfillPaidOrder } from "@/lib/create-pending-order";
import { prisma } from "@/lib/prisma";
import { getStripe, isStripeEnabled } from "@/lib/stripe";

export async function GET(req: NextRequest) {
  const sessionId = req.nextUrl.searchParams.get("session_id");
  if (!sessionId) {
    return NextResponse.json({ error: "session_id required" }, { status: 400 });
  }

  if (!isStripeEnabled()) {
    return NextResponse.json({ error: "Payment not configured" }, { status: 503 });
  }

  const stripe = getStripe();
  const session = await stripe.checkout.sessions.retrieve(sessionId);

  const orderId = session.metadata?.orderId;
  if (!orderId) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }

  if (session.payment_status === "paid") {
    await fulfillPaidOrder(orderId);
  }

  const order = await prisma.order.findUnique({
    where: { id: orderId },
    select: {
      orderNumber: true,
      total: true,
      paymentStatus: true,
      orderStatus: true,
    },
  });

  if (!order) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }

  return NextResponse.json({
    orderNumber: order.orderNumber,
    total: order.total,
    paymentStatus: order.paymentStatus,
    orderStatus: order.orderStatus,
    stripePaymentStatus: session.payment_status,
  });
}
