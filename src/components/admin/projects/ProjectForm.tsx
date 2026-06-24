"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import ImageUploadField from "@/components/admin/ImageUploadField";
import ImageListField from "@/components/admin/ImageListField";
import { slugify, categoryLabels } from "@/lib/utils";

type ProjectData = {
  id?: string;
  name: string;
  slug: string;
  category: string;
  year: number;
  location: string;
  client: string;
  scope: string;
  brief: string;
  approach: string;
  image: string;
  gallery: string;
  details: string;
  quote: string;
  isHero: boolean;
  status: string;
  sortOrder: number;
};

const categories = Object.keys(categoryLabels);

const inputClass =
  "w-full py-2.5 text-sm bg-transparent border-b border-border-2 outline-none focus:border-sage transition-colors";
const labelClass = "block text-[11px] tracking-widest text-fg-3 uppercase mb-2";

export default function ProjectForm({ initial }: { initial?: ProjectData }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const isEdit = Boolean(initial?.id);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const form = new FormData(e.currentTarget);
    const payload = {
      name: form.get("name") as string,
      slug: form.get("slug") as string,
      category: form.get("category") as string,
      year: Number(form.get("year")),
      location: form.get("location") as string,
      client: form.get("client") as string,
      scope: form.get("scope") as string,
      brief: form.get("brief") as string,
      approach: form.get("approach") as string,
      image: form.get("image") as string,
      gallery: form.get("gallery") as string,
      details: form.get("details") as string,
      quote: form.get("quote") as string,
      isHero: form.get("isHero") === "on",
      status: form.get("status") as string,
      sortOrder: Number(form.get("sortOrder")) || 0,
    };

    try {
      const url = isEdit ? `/api/projects/${initial!.id}` : "/api/projects";
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

      router.push("/admin/projects");
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
          <input
            name="name"
            required
            defaultValue={initial?.name}
            onChange={(e) => {
              if (!isEdit) {
                const slugInput = e.currentTarget.form?.elements.namedItem("slug") as HTMLInputElement;
                if (slugInput && !slugInput.dataset.touched) {
                  slugInput.value = slugify(e.currentTarget.value);
                }
              }
            }}
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass}>Slug</label>
          <input
            name="slug"
            required
            defaultValue={initial?.slug}
            onChange={(e) => {
              e.currentTarget.dataset.touched = "1";
            }}
            className={inputClass}
          />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-5">
        <div>
          <label className={labelClass}>Category</label>
          <select
            name="category"
            required
            defaultValue={initial?.category ?? "INTERIOR"}
            className={inputClass}
          >
            {categories.map((c) => (
              <option key={c} value={c}>
                {categoryLabels[c]}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className={labelClass}>Year</label>
          <input
            name="year"
            type="number"
            required
            defaultValue={initial?.year ?? new Date().getFullYear()}
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass}>Sort order</label>
          <input
            name="sortOrder"
            type="number"
            defaultValue={initial?.sortOrder ?? 0}
            className={inputClass}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-5">
        <div>
          <label className={labelClass}>Location</label>
          <input name="location" defaultValue={initial?.location ?? ""} className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>Client</label>
          <input name="client" defaultValue={initial?.client ?? ""} className={inputClass} />
        </div>
      </div>

      <div>
        <label className={labelClass}>Scope</label>
        <input name="scope" defaultValue={initial?.scope ?? ""} className={inputClass} />
      </div>

      <div>
        <label className={labelClass}>Brief</label>
        <textarea
          name="brief"
          rows={3}
          defaultValue={initial?.brief ?? ""}
          className={`${inputClass} resize-y`}
        />
      </div>

      <div>
        <label className={labelClass}>Approach</label>
        <textarea
          name="approach"
          rows={3}
          defaultValue={initial?.approach ?? ""}
          className={`${inputClass} resize-y`}
        />
      </div>

      <ImageUploadField
        name="image"
        label="列表预览图（Projects 页 & 首页）"
        defaultValue={initial?.image ?? ""}
        hint="用于 /projects 列表和首页 Selected projects 卡片。点 Upload image 上传，或留空则自动使用下方 Gallery 第一张。"
      />

      <ImageListField
        name="gallery"
        label="Gallery（详情页图集）"
        defaultValue={initial?.gallery ?? "[]"}
        hint="项目详情弹层中的图片。若未设置上方预览图，第一张会自动用作列表预览。"
      />

      <div>
        <label className={labelClass}>Details (JSON array)</label>
        <textarea
          name="details"
          rows={2}
          defaultValue={initial?.details ?? "[]"}
          className={`${inputClass} resize-y font-mono text-xs`}
        />
      </div>

      <div>
        <label className={labelClass}>Quote</label>
        <input name="quote" defaultValue={initial?.quote ?? ""} className={inputClass} />
      </div>

      <div className="flex items-center gap-6">
        <div>
          <label className={labelClass}>Status</label>
          <select name="status" defaultValue={initial?.status ?? "DRAFT"} className={inputClass}>
            <option value="DRAFT">Draft</option>
            <option value="PUBLISHED">Published</option>
            <option value="ARCHIVED">Archived</option>
          </select>
        </div>
        <label className="flex items-center gap-2 text-sm text-fg-2 pt-5">
          <input
            name="isHero"
            type="checkbox"
            defaultChecked={initial?.isHero}
            className="accent-sage"
          />
          Hero project
        </label>
      </div>

      <div className="flex gap-3 pt-4">
        <button
          type="submit"
          disabled={loading}
          className="text-xs tracking-widest uppercase bg-sage text-bg px-8 py-3 hover:bg-sage-light transition-colors disabled:opacity-50"
        >
          {loading ? "Saving..." : isEdit ? "Update project" : "Create project"}
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
