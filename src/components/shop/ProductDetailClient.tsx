"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useCartStore } from "@/lib/store";
import { formatPrice, productCategoryLabels } from "@/lib/utils";
import { productImageSrc } from "@/lib/placeholders";
import CmsImage from "@/components/ui/CmsImage";

interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  salePrice: number | null;
  badge: string | null;
  description: string | null;
  specs: string;
  stock: number;
  images: string;
}

export default function ProductDetailClient({ product }: { product: Product }) {
  const router = useRouter();
  const add = useCartStore((s) => s.add);
  const setOpen = useCartStore((s) => s.setOpen);
  const [added, setAdded] = useState(false);

  const specs = JSON.parse(product.specs || "[]") as [string, string][];
  const price = product.salePrice ?? product.price;
  const imageSrc = productImageSrc(product.images, product.category);

  const handleAdd = () => {
    add({ id: product.id, name: product.name, price });
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <div className="pt-28 pb-24 px-6 md:px-12 max-w-6xl mx-auto">
      <button
        type="button"
        onClick={() => router.back()}
        className="text-xs text-fg-3 hover:text-sage mb-8 flex items-center gap-2"
      >
        ← Back to shop
      </button>

      <div className="grid md:grid-cols-2 gap-12">
        <div className={`aspect-square bg-bg-3 rounded-lg flex items-center justify-center relative border border-border overflow-hidden${imageSrc ? " has-image" : ""}`}>
          <CmsImage src={imageSrc} alt={product.name} className="cms-img-fill" placeholder="Product image" />
          {product.badge && (
            <span className="absolute top-4 left-4 text-[10px] bg-sage text-bg px-2.5 py-1 rounded">
              {product.badge}
            </span>
          )}
        </div>

        <div>
          <p className="text-[11px] text-sage uppercase tracking-wide mb-2">
            {productCategoryLabels[product.category]}
          </p>
          <h1 className="font-display text-[clamp(28px,4vw,40px)] font-light mb-3">
            {product.name}
          </h1>
          <div className="flex items-baseline gap-3 mb-6">
            <span className="text-2xl text-sage-light font-medium">{formatPrice(price)}</span>
            {product.salePrice && (
              <span className="text-fg-3 line-through text-sm">{formatPrice(product.price)}</span>
            )}
          </div>
          <p className="text-[15px] text-fg-2 leading-relaxed mb-8">{product.description}</p>

          {specs.length > 0 && (
            <div className="border-t border-border pt-6 mb-8 space-y-3">
              {specs.map(([k, v]) => (
                <div key={k} className="flex justify-between text-sm">
                  <span className="text-fg-3">{k}</span>
                  <span>{v}</span>
                </div>
              ))}
            </div>
          )}

          <p className="text-xs text-fg-3 mb-6">
            {product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}
          </p>

          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={handleAdd}
              disabled={product.stock <= 0}
              className={`text-xs tracking-widest uppercase px-10 py-3.5 transition-colors disabled:opacity-40 ${
                added
                  ? "bg-sage text-bg"
                  : "bg-sage text-bg hover:bg-sage-light"
              }`}
            >
              {added ? "Added ✓" : "Add to cart"}
            </button>
            <button
              type="button"
              onClick={() => {
                handleAdd();
                setOpen(true);
              }}
              disabled={product.stock <= 0}
              className="text-xs tracking-widest uppercase border border-border-2 px-10 py-3.5 hover:border-sage hover:text-sage transition-colors disabled:opacity-40"
            >
              Buy now
            </button>
            <Link
              href="/#sec-contact"
              className="text-xs tracking-widest uppercase border border-border-2 px-10 py-3.5 hover:border-sage hover:text-sage transition-colors inline-flex items-center"
            >
              Bulk inquiry
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
