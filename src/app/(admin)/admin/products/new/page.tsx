import Link from "next/link";
import ProductForm from "@/components/admin/products/ProductForm";

export default function NewProductPage() {
  return (
    <div>
      <div className="mb-8">
        <Link href="/admin/products" className="text-xs text-fg-3 hover:text-sage mb-2 inline-block">
          ← Back to products
        </Link>
        <h1 className="font-display text-3xl font-light">New product</h1>
      </div>
      <ProductForm />
    </div>
  );
}
