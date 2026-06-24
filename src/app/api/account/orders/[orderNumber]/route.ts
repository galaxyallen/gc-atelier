import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(
  _req: Request,
  { params }: { params: { orderNumber: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id || session.user.userType !== "customer") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
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
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }

  return NextResponse.json(order);
}
