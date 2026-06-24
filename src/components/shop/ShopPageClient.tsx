"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useCartStore } from "@/lib/store";
import { formatPrice, productCategoryLabels } from "@/lib/utils";
import { productImageSrc } from "@/lib/placeholders";

interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  badge: string | null;
  description: string | null;
  specs: string;
  images: string;
}

export default function ShopPageClient({
  products,
  pageHeader,
}: {
  products: Product[];
  pageHeader: { label: string; title: string; subtitle: string };
}) {
  const [filter, setFilter] = useState("all");
  const [shown, setShown] = useState<Set<string>>(new Set());
  const [active, setActive] = useState<Product | null>(null);
  const [addedId, setAddedId] = useState<string | null>(null);
  const add = useCartStore((s) => s.add);
  const toggleCart = useCartStore((s) => s.toggle);

  const filtered =
    filter === "all"
      ? products
      : products.filter((p) => p.category.toLowerCase() === filter);

  useEffect(() => {
    setShown(new Set());
    filtered.forEach((p, i) => {
      setTimeout(() => setShown((s) => new Set(s).add(p.id)), 80 + i * 70);
    });
  }, [filter, products, filtered]);

  const parseSpecs = (raw: string): [string, string][] => {
    try {
      const parsed = JSON.parse(raw) as [string, string][];
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  };

  const handleAdd = (p: Product, openCart = false) => {
    add({ id: p.id, name: p.name, price: p.price });
    setAddedId(p.id);
    setTimeout(() => setAddedId(null), 1200);
    if (openCart) {
      setActive(null);
      toggleCart();
    }
  };

  return (
    <>
      <section className="page-header">
        <div className="sl">{pageHeader.label}</div>
        <h1 className="ph-title">{pageHeader.title}</h1>
        <p className="ph-sub">{pageHeader.subtitle}</p>
      </section>

      <div className="filter-bar">
        {[
          ["all", "All"],
          ["diffuser", "Diffusers"],
          ["backpack", "Backpacks"],
          ["speaker", "Speakers"],
        ].map(([val, label]) => (
          <button
            key={val}
            type="button"
            className={`filter-btn${filter === val ? " active" : ""}`}
            onClick={() => setFilter(val)}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="shop-grid">
        {filtered.map((p) => (
          <div
            key={p.id}
            className={`prod-card${shown.has(p.id) ? " show" : ""}`}
            data-cat={p.category.toLowerCase()}
            onClick={() => setActive(p)}
            onKeyDown={(e) => e.key === "Enter" && setActive(p)}
            role="button"
            tabIndex={0}
          >
            <div className="prod-img has-image">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={productImageSrc(p.images, p.category)}
                alt={p.name}
                className="prod-img-fill"
              />
              {p.badge && <div className="prod-badge">{p.badge}</div>}
            </div>
            <div className="prod-body">
              <div className="prod-name">{p.name}</div>
              <div className="prod-type">{productCategoryLabels[p.category] || p.category}</div>
              <div className="prod-price-row">
                <span className="prod-price">{formatPrice(p.price)}</span>
                <button
                  type="button"
                  className={`prod-atc${addedId === p.id ? " added" : ""}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleAdd(p);
                  }}
                >
                  {addedId === p.id ? "Added ✓" : "Add to cart"}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div
        className={`pd-overlay${active ? " open" : ""}`}
        onClick={(e) => e.target === e.currentTarget && setActive(null)}
        role="presentation"
      >
        {active && (
          <div className="pd-modal" style={{ position: "relative" }}>
            <button type="button" className="pd-close" onClick={() => setActive(null)}>
              ✕
            </button>
            <div className="pd-img has-image">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={productImageSrc(active.images, active.category)}
                alt={active.name}
                className="prod-img-fill"
              />
            </div>
            <div className="pd-info">
              <div className="pd-cat">{productCategoryLabels[active.category]}</div>
              <div className="pd-name">{active.name}</div>
              <div className="pd-price">{formatPrice(active.price)}</div>
              <div className="pd-desc">{active.description || "Product description."}</div>
              <div className="pd-specs">
                {parseSpecs(active.specs).map(([label, value]) => (
                  <div key={label} className="pd-spec">
                    <span className="pd-spec-label">{label}</span>
                    <span>{value}</span>
                  </div>
                ))}
              </div>
              <div className="pd-btns">
                <button type="button" className="pd-add" onClick={() => handleAdd(active, true)}>
                  Add to cart
                </button>
                <Link href="/#sec-contact" className="pd-inquiry">
                  Bulk inquiry
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
