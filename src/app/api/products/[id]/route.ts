import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { revalidateSitePages } from "@/lib/revalidate-site";

type RouteParams = { params: { id: string } };

export async function GET(_request: Request, { params }: RouteParams) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const product = await prisma.product.findUnique({ where: { id: params.id } });
  if (!product) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json(product);
}

export async function PUT(request: Request, { params }: RouteParams) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();

  const product = await prisma.product.update({
    where: { id: params.id },
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
  return NextResponse.json(product);
}

export async function DELETE(_request: Request, { params }: RouteParams) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await prisma.product.delete({ where: { id: params.id } });
  return NextResponse.json({ ok: true });
}
