import { prisma } from "@/lib/prisma";
import { nanoid } from "nanoid";

export type CheckoutItem = { productId: string; quantity: number };

export type CheckoutCustomer = {
  email: string;
  name: string;
  phone?: string;
};

export async function createPendingOrder(
  customer: CheckoutCustomer,
  items: CheckoutItem[],
  options?: { customerId?: string }
) {
  const { email, name, phone } = customer;

  if (!email || !name || !items.length) {
    throw new Error("Missing required fields");
  }

  let user = options?.customerId
    ? await prisma.user.findUnique({ where: { id: options.customerId } })
    : await prisma.user.findUnique({ where: { email } });

  if (!user && !options?.customerId) {
    user = await prisma.user.create({
      data: {
        email,
        name,
        phone: phone || null,
        password: "",
      },
    });
  }

  if (!user) {
    throw new Error("Customer not found");
  }

  let subtotal = 0;
  const orderItems: { productId: string; quantity: number; price: number }[] = [];

  for (const item of items) {
    const product = await prisma.product.findUnique({ where: { id: item.productId } });
    if (!product || product.stock < item.quantity) {
      throw new Error(`Product unavailable: ${item.productId}`);
    }
    const price = product.salePrice ?? product.price;
    subtotal += price * item.quantity;
    orderItems.push({ productId: product.id, quantity: item.quantity, price });
  }

  const shipping = 0;
  const total = subtotal + shipping;
  const orderNumber = `GC-${nanoid(8).toUpperCase()}`;

  const order = await prisma.order.create({
    data: {
      orderNumber,
      customerId: user.id,
      subtotal,
      shipping,
      total,
      paymentStatus: "PENDING",
      orderStatus: "PENDING",
      items: {
        create: orderItems,
      },
    },
    include: {
      items: { include: { product: true } },
      customer: true,
    },
  });

  return order;
}

export async function fulfillPaidOrder(orderId: string) {
  return prisma.$transaction(async (tx) => {
    const order = await tx.order.findUnique({
      where: { id: orderId },
      include: { items: true },
    });

    if (!order) {
      throw new Error(`Order not found: ${orderId}`);
    }

    if (order.paymentStatus === "PAID") {
      return order;
    }

    for (const item of order.items) {
      const product = await tx.product.findUnique({ where: { id: item.productId } });
      if (!product || product.stock < item.quantity) {
        throw new Error(`Insufficient stock for product ${item.productId}`);
      }
      await tx.product.update({
        where: { id: item.productId },
        data: { stock: { decrement: item.quantity } },
      });
    }

    return tx.order.update({
      where: { id: orderId },
      data: {
        paymentStatus: "PAID",
        orderStatus: "CONFIRMED",
      },
      include: { items: { include: { product: true } } },
    });
  });
}

export async function markOrderPaymentFailed(orderId: string) {
  return prisma.order.update({
    where: { id: orderId },
    data: {
      paymentStatus: "FAILED",
      orderStatus: "CANCELLED",
    },
  });
}
