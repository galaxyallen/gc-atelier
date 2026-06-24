import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { createPendingOrder } from "@/lib/create-pending-order";
import { resolveCheckoutCustomer } from "@/lib/checkout-customer";
import {
  getSiteUrl,
  getStripe,
  getStripeCurrency,
  isStripeEnabled,
  toStripeAmount,
} from "@/lib/stripe";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { items } = body as {
    items: { productId: string; quantity: number }[];
  };

  if (!items?.length) {
    return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
  }

  try {
    const { customer, customerId } = await resolveCheckoutCustomer(body);
    const order = await createPendingOrder(customer, items, customerId ? { customerId } : undefined);

    if (!isStripeEnabled()) {
      return NextResponse.json(
        { error: "Online payment is not configured. Please contact us to complete your order." },
        { status: 503 }
      );
    }

    const stripe = getStripe();
    const currency = getStripeCurrency();
    const siteUrl = getSiteUrl();

    const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = order.items.map(
      (item) => ({
        price_data: {
          currency,
          product_data: {
            name: item.product.name,
            metadata: {
              productId: item.productId,
              sku: item.product.sku,
            },
          },
          unit_amount: toStripeAmount(item.price),
        },
        quantity: item.quantity,
      })
    );

    if (order.shipping > 0) {
      lineItems.push({
        price_data: {
          currency,
          product_data: { name: "Shipping" },
          unit_amount: toStripeAmount(order.shipping),
        },
        quantity: 1,
      });
    }

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      customer_email: customer.email,
      line_items: lineItems,
      metadata: {
        orderId: order.id,
        orderNumber: order.orderNumber,
      },
      success_url: `${siteUrl}/shop/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${siteUrl}/shop/checkout/cancel?order=${order.orderNumber}`,
    });

    return NextResponse.json({
      url: session.url,
      orderNumber: order.orderNumber,
      orderId: order.id,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Checkout failed";
    const status =
      message.includes("unavailable") || message.includes("Missing") || message.includes("empty")
        ? 400
        : message.includes("sign in") || message.includes("Unauthorized")
          ? 401
          : 500;
    return NextResponse.json({ error: message }, { status });
  }
}
