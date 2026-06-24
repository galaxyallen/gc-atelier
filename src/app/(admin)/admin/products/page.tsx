import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { productCategoryLabels, formatPrice } from "@/lib/utils";
import DeleteButton from "@/components/admin/DeleteButton";

export default async function ProductsPage() {
  const products = await prisma.product.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-display text-3xl font-light">Products</h1>
        <Link
          href="/admin/products/new"
          className="text-xs tracking-widest uppercase bg-sage text-bg px-6 py-3 hover:bg-sage-light transition-colors"
        >
          New product
        </Link>
      </div>

      <div className="bg-bg-2 border border-border rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-[11px] tracking-widest uppercase text-fg-3 border-b border-border">
              <th className="px-5 py-3 font-normal">Name</th>
              <th className="px-5 py-3 font-normal">SKU</th>
              <th className="px-5 py-3 font-normal">Category</th>
              <th className="px-5 py-3 font-normal">Price</th>
              <th className="px-5 py-3 font-normal">Stock</th>
              <th className="px-5 py-3 font-normal">Status</th>
              <th className="px-5 py-3 font-normal">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-5 py-8 text-center text-fg-3">
                  No products yet.
                </td>
              </tr>
            ) : (
              products.map((product) => (
                <tr key={product.id} className="border-b border-border last:border-0">
                  <td className="px-5 py-3">
                    <Link
                      href={`/admin/products/${product.id}`}
                      className="hover:text-sage transition-colors"
                    >
                      {product.name}
                    </Link>
                  </td>
                  <td className="px-5 py-3 text-fg-2 font-mono text-xs">{product.sku}</td>
                  <td className="px-5 py-3 text-fg-2">
                    {productCategoryLabels[product.category] ?? product.category}
                  </td>
                  <td className="px-5 py-3 text-fg-2">{formatPrice(product.price)}</td>
                  <td className="px-5 py-3 text-fg-2">{product.stock}</td>
                  <td className="px-5 py-3">
                    <span className="text-[10px] tracking-wider uppercase px-2 py-1 rounded bg-sage-dim text-sage">
                      {product.status}
                    </span>
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-4">
                      <Link
                        href={`/admin/products/${product.id}`}
                        className="text-xs text-sage hover:text-sage-light"
                      >
                        Edit
                      </Link>
                      <DeleteButton endpoint={`/api/products/${product.id}`} />
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
