"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import ImageUploadField from "@/components/admin/ImageUploadField";
import { SITE_IMAGE_GROUPS } from "@/lib/site-images";

type Row = { key: string; value: string };

export default function PageImagesForm({ initial }: { initial: Row[] }) {
  const router = useRouter();
  const [activeGroup, setActiveGroup] = useState(SITE_IMAGE_GROUPS[0].id);
  const [rows, setRows] = useState<Row[]>(initial);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const valueOf = (key: string) => rows.find((r) => r.key === key)?.value ?? "";

  const updateRow = (key: string, value: string) => {
    setRows((prev) => {
      const i = prev.findIndex((r) => r.key === key);
      if (i === -1) return [...prev, { key, value }];
      const next = [...prev];
      next[i] = { key, value };
      return next;
    });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    try {
      const res = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ settings: rows }),
      });
      if (!res.ok) throw new Error("Save failed");
      setMessage("图片已保存。");
      router.refresh();
    } catch {
      setMessage("保存失败，请重试。");
    } finally {
      setLoading(false);
    }
  };

  const group = SITE_IMAGE_GROUPS.find((g) => g.id === activeGroup)!;

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl">
      <div className="flex gap-2 mb-8 flex-wrap">
        {SITE_IMAGE_GROUPS.map((g) => (
          <button
            key={g.id}
            type="button"
            onClick={() => setActiveGroup(g.id)}
            className={`text-xs px-4 py-2 rounded-full border transition-all ${
              activeGroup === g.id
                ? "bg-sage text-bg border-sage"
                : "border-border text-fg-3 hover:border-border-2"
            }`}
          >
            {g.label}
          </button>
        ))}
      </div>

      <div className="space-y-8 mb-8">
        {group.images.map((img) => (
          <ImageUploadField
            key={img.key}
            name={img.key}
            label={img.label}
            hint={img.hint}
            accept={img.accept ?? "image/*"}
            defaultValue={valueOf(img.key)}
            onChange={(url) => updateRow(img.key, url)}
          />
        ))}
      </div>

      <p className="text-xs text-fg-3 mb-6">
        项目与产品图片请在「项目管理」「产品管理」中上传。
      </p>

      {message && (
        <p
          className={`text-sm px-4 py-3 rounded-md mb-4 ${
            message.includes("失败") ? "text-red-400 bg-red-400/10" : "text-sage bg-sage-dim"
          }`}
        >
          {message}
        </p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="text-xs tracking-widest uppercase bg-sage text-bg px-8 py-3 hover:bg-sage-light transition-colors disabled:opacity-50"
      >
        {loading ? "保存中…" : "保存图片"}
      </button>
    </form>
  );
}
