import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import { isAdminRole } from "@/lib/auth-roles";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const isAdmin = session.user.userType === "admin" || isAdminRole(session.user.role);

  const orders = await prisma.order.findMany({
    where: isAdmin ? undefined : { customerId: session.user.id },
    orderBy: { createdAt: "desc" },
    include: {
      customer: { select: { id: true, name: true, email: true } },
      items: { include: { product: { select: { id: true, name: true, sku: true } } } },
    },
  });

  return NextResponse.json(orders);
}
