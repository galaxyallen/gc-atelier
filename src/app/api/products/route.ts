import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { revalidateSitePages } from "@/lib/revalidate-site";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const products = await prisma.product.findMany({
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(products);
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();

  const product = await prisma.product.create({
    data: {
      name: body.name,
      sku: body.sku,
      category: body.category,
      price: Number(body.price),
      salePrice: body.salePrice != null ? Number(body.salePrice) : null,
      description: body.description || null,
      images: body.images ?? "[]",
      specs: body.specs ?? "[]",
      stock: Number(body.stock) || 0,
      lowStockAt: Number(body.lowStockAt) || 10,
      badge: body.badge || null,
      status: body.status ?? "DRAFT",
    },
  });

  revalidateSitePages();
  return NextResponse.json(product, { status: 201 });
}
