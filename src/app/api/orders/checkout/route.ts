import { NextRequest, NextResponse } from "next/server";
import { createPendingOrder, fulfillPaidOrder } from "@/lib/create-pending-order";
import { resolveCheckoutCustomer } from "@/lib/checkout-customer";
import { isStripeEnabled } from "@/lib/stripe";

/** Offline checkout fallback when Stripe is not configured (local dev only). */
export async function POST(req: NextRequest) {
  if (isStripeEnabled()) {
    return NextResponse.json(
      { error: "Use /api/payments/create-checkout-session for online payment" },
      { status: 400 }
    );
  }

  const body = await req.json();
  const { items } = body as {
    items: { productId: string; quantity: number }[];
  };

  try {
    const { customer, customerId } = await resolveCheckoutCustomer(body);
    const order = await createPendingOrder(customer, items, customerId ? { customerId } : undefined);
    await fulfillPaidOrder(order.id);

    return NextResponse.json({ orderNumber: order.orderNumber, id: order.id }, { status: 201 });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Checkout failed";
    const status =
      message.includes("unavailable") || message.includes("Missing")
        ? 400
        : message.includes("sign in") || message.includes("Unauthorized")
          ? 401
          : 500;
    return NextResponse.json({ error: message }, { status });
  }
}
