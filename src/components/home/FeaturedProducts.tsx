"use client";

import type { HomeProductsSection } from "@/lib/page-content";
import Link from "next/link";
import { useState } from "react";
import { useReveal } from "@/components/ui/RevealOnScroll";
import { useCartStore } from "@/lib/store";
import { formatPrice } from "@/lib/utils";
import { productImageSrc } from "@/lib/placeholders";

interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  images?: string | null;
}

export default function FeaturedProducts({
  products,
  content,
}: {
  products: Product[];
  content: HomeProductsSection;
}) {
  const headerRef = useReveal<HTMLDivElement>(0);

  return (
    <section className="products" id="sec-shop">
      <div className="sec-h" ref={headerRef}>
        <div>
          <div className="sl">{content.label}</div>
          <h2 className="sh">{content.heading}</h2>
        </div>
        <Link href="/shop" className="sec-link">
          {content.linkText}
        </Link>
      </div>
      <div className="prod-grid">
        {products.slice(0, 4).map((p, i) => (
          <ProductCard key={p.id} product={p} content={content} delay={i * 0.12} />
        ))}
      </div>
    </section>
  );
}

function ProductCard({
  product,
  content,
  delay,
}: {
  product: Product;
  content: HomeProductsSection;
  delay: number;
}) {
  const ref = useReveal<HTMLDivElement>(delay);
  const add = useCartStore((s) => s.add);
  const [added, setAdded] = useState(false);
  const src = productImageSrc(product.images ?? null, product.category);

  const handleAdd = () => {
    add({ id: product.id, name: product.name, price: product.price });
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <div ref={ref} className="prod-card">
      <div className="prod-img has-image">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={src} alt={product.name} className="prod-img-fill" />
      </div>
      <div className="prod-body">
        <p className="prod-name">{product.name}</p>
        <p className="prod-price">{formatPrice(product.price)}</p>
        <button type="button" onClick={handleAdd} className={`prod-atc${added ? " added" : ""}`}>
          {added ? (content.addedText ?? "Added ✓") : (content.addToCartText ?? "Add to cart")}
        </button>
      </div>
    </div>
  );
}
