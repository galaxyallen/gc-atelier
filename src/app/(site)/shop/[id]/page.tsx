import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { createMetadata } from "@/lib/seo";
import ProductDetailClient from "@/components/shop/ProductDetailClient";

export async function generateMetadata({ params }: { params: { id: string } }) {
  const product = await prisma.product.findUnique({ where: { id: params.id } });
  if (!product) return {};
  return createMetadata({
    title: product.name,
    description: product.description || `${product.name} — GC ATELIER`,
    path: `/shop/${params.id}`,
  });
}

export default async function ProductDetailPage({ params }: { params: { id: string } }) {
  const product = await prisma.product.findUnique({
    where: { id: params.id, status: "PUBLISHED" },
  });

  if (!product) notFound();

  return <ProductDetailClient product={product} />;
}
