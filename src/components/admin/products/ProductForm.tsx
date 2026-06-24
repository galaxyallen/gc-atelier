"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import ImageListField from "@/components/admin/ImageListField";
import { productCategoryLabels, formatPrice } from "@/lib/utils";

type ProductData = {
  id?: string;
  name: string;
  sku: string;
  category: string;
  price: number;
  salePrice: number | null;
  description: string;
  images: string;
  specs: string;
  stock: number;
  lowStockAt: number;
  badge: string;
  status: string;
};

const categories = Object.keys(productCategoryLabels);

const inputClass =
  "w-full py-2.5 text-sm bg-transparent border-b border-border-2 outline-none focus:border-sage transition-colors";
const labelClass = "block text-[11px] tracking-widest text-fg-3 uppercase mb-2";

export default function ProductForm({ initial }: { initial?: ProductData }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const isEdit = Boolean(initial?.id);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const form = new FormData(e.currentTarget);
    const salePriceRaw = form.get("salePrice") as string;
    const payload = {
      name: form.get("name") as string,
      sku: form.get("sku") as string,
      category: form.get("category") as string,
      price: Number(form.get("price")),
      salePrice: salePriceRaw ? Number(salePriceRaw) : null,
      description: form.get("description") as string,
      images: form.get("images") as string,
      specs: form.get("specs") as string,
      stock: Number(form.get("stock")) || 0,
      lowStockAt: Number(form.get("lowStockAt")) || 10,
      badge: form.get("badge") as string,
      status: form.get("status") as string,
    };

    try {
      const url = isEdit ? `/api/products/${initial!.id}` : "/api/products";
      const method = isEdit ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Save failed");
      }

      router.push("/admin/products");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl space-y-5">
      {error && (
        <p className="text-sm text-red-400 bg-red-400/10 px-4 py-3 rounded-md">{error}</p>
      )}

      <div className="grid grid-cols-2 gap-5">
        <div>
          <label className={labelClass}>Name</label>
          <input name="name" required defaultValue={initial?.name} className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>SKU</label>
          <input name="sku" required defaultValue={initial?.sku} className={inputClass} />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-5">
        <div>
          <label className={labelClass}>Category</label>
          <select
            name="category"
            required
            defaultValue={initial?.category ?? "DIFFUSER"}
            className={inputClass}
          >
            {categories.map((c) => (
              <option key={c} value={c}>
                {productCategoryLabels[c]}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className={labelClass}>Price</label>
          <input
            name="price"
            type="number"
            required
            defaultValue={initial?.price ?? 0}
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass}>Sale price</label>
          <input
            name="salePrice"
            type="number"
            defaultValue={initial?.salePrice ?? ""}
            className={inputClass}
          />
        </div>
      </div>

      <div>
        <label className={labelClass}>Description</label>
        <textarea
          name="description"
          rows={3}
          defaultValue={initial?.description ?? ""}
          className={`${inputClass} resize-y`}
        />
      </div>

      <ImageListField
        name="images"
        label="Product images"
        defaultValue={initial?.images ?? "[]"}
        hint="Used on shop page and homepage featured products."
      />

      <div>
        <label className={labelClass}>Specs (JSON array)</label>
        <textarea
          name="specs"
          rows={2}
          defaultValue={initial?.specs ?? "[]"}
          className={`${inputClass} resize-y font-mono text-xs`}
        />
      </div>

      <div className="grid grid-cols-3 gap-5">
        <div>
          <label className={labelClass}>Stock</label>
          <input
            name="stock"
            type="number"
            defaultValue={initial?.stock ?? 0}
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass}>Low stock at</label>
          <input
            name="lowStockAt"
            type="number"
            defaultValue={initial?.lowStockAt ?? 10}
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass}>Badge</label>
          <input name="badge" defaultValue={initial?.badge ?? ""} className={inputClass} />
        </div>
      </div>

      <div>
        <label className={labelClass}>Status</label>
        <select name="status" defaultValue={initial?.status ?? "DRAFT"} className={inputClass}>
          <option value="DRAFT">Draft</option>
          <option value="PUBLISHED">Published</option>
          <option value="ARCHIVED">Archived</option>
        </select>
      </div>

      {initial?.price != null && (
        <p className="text-xs text-fg-3">Current price: {formatPrice(initial.price)}</p>
      )}

      <div className="flex gap-3 pt-4">
        <button
          type="submit"
          disabled={loading}
          className="text-xs tracking-widest uppercase bg-sage text-bg px-8 py-3 hover:bg-sage-light transition-colors disabled:opacity-50"
        >
          {loading ? "Saving..." : isEdit ? "Update product" : "Create product"}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="text-xs tracking-widest uppercase text-fg-3 px-8 py-3 hover:text-fg transition-colors"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
