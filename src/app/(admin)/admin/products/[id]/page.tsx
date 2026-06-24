import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import ProductForm from "@/components/admin/products/ProductForm";

type PageProps = { params: { id: string } };

export default async function EditProductPage({ params }: PageProps) {
  const product = await prisma.product.findUnique({ where: { id: params.id } });
  if (!product) notFound();

  return (
    <div>
      <div className="mb-8">
        <Link href="/admin/products" className="text-xs text-fg-3 hover:text-sage mb-2 inline-block">
          ← Back to products
        </Link>
        <h1 className="font-display text-3xl font-light">Edit product</h1>
        <p className="text-fg-3 text-sm mt-1">{product.name}</p>
      </div>
      <ProductForm
        initial={{
          id: product.id,
          name: product.name,
          sku: product.sku,
          category: product.category,
          price: product.price,
          salePrice: product.salePrice,
          description: product.description ?? "",
          images: product.images,
          specs: product.specs,
          stock: product.stock,
          lowStockAt: product.lowStockAt,
          badge: product.badge ?? "",
          status: product.status,
        }}
      />
    </div>
  );
}
