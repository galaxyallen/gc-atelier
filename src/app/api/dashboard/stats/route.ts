import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const [inquiries, orders, products, users, projects, newInquiries, pendingOrders] =
    await Promise.all([
      prisma.inquiry.count(),
      prisma.order.count(),
      prisma.product.count(),
      prisma.user.count(),
      prisma.project.count(),
      prisma.inquiry.count({ where: { status: "NEW" } }),
      prisma.order.count({ where: { orderStatus: "PENDING" } }),
    ]);

  return NextResponse.json({
    inquiries,
    orders,
    products,
    users,
    projects,
    newInquiries,
    pendingOrders,
  });
}
