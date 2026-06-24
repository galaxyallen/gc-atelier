import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const orderSelect = {
  id: true,
  orderNumber: true,
  total: true,
  subtotal: true,
  shipping: true,
  paymentStatus: true,
  orderStatus: true,
  trackingNo: true,
  notes: true,
  createdAt: true,
  items: {
    select: {
      id: true,
      quantity: true,
      price: true,
      product: { select: { name: true, sku: true } },
    },
  },
} as const;

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id || session.user.userType !== "customer") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      company: true,
      createdAt: true,
      orders: {
        orderBy: { createdAt: "desc" },
        take: 10,
        select: orderSelect,
      },
    },
  });

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  return NextResponse.json(user);
}

export async function PATCH(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id || session.user.userType !== "customer") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const name = String(body.name ?? "").trim();
  const phone = body.phone != null ? String(body.phone).trim() : undefined;
  const company = body.company != null ? String(body.company).trim() : undefined;

  if (!name) {
    return NextResponse.json({ error: "Name is required" }, { status: 400 });
  }

  const user = await prisma.user.update({
    where: { id: session.user.id },
    data: {
      name,
      phone: phone || null,
      company: company || null,
    },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      company: true,
      createdAt: true,
    },
  });

  return NextResponse.json(user);
}
