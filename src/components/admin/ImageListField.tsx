"use client";

import { useRef, useState } from "react";

const labelClass = "block text-[11px] tracking-widest text-fg-3 uppercase mb-2";

function parseImages(raw: string): string[] {
  try {
    const parsed = JSON.parse(raw || "[]");
    return Array.isArray(parsed) ? parsed.filter((u) => typeof u === "string" && u) : [];
  } catch {
    return [];
  }
}

type Props = {
  name: string;
  label: string;
  defaultValue?: string;
  hint?: string;
  firstBadgeLabel?: string;
  footerHint?: string;
};

export default function ImageListField({
  name,
  label,
  defaultValue = "[]",
  hint,
  firstBadgeLabel = "详情封面",
  footerHint = "第一张用于详情页顶部封面。",
}: Props) {
  const [urls, setUrls] = useState<string[]>(() => parseImages(defaultValue));
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  const uploadFiles = async (files: FileList) => {
    setUploading(true);
    setError("");
    const added: string[] = [];

    try {
      for (const file of Array.from(files)) {
        const fd = new FormData();
        fd.append("file", file);
        const res = await fetch("/api/upload", { method: "POST", body: fd });
        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          throw new Error(data.error || "Upload failed");
        }
        const { url } = await res.json();
        added.push(url);
      }
      setUrls((prev) => [...prev, ...added]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  const removeAt = (index: number) => {
    setUrls((prev) => prev.filter((_, i) => i !== index));
  };

  const move = (index: number, dir: -1 | 1) => {
    const next = index + dir;
    if (next < 0 || next >= urls.length) return;
    setUrls((prev) => {
      const copy = [...prev];
      [copy[index], copy[next]] = [copy[next], copy[index]];
      return copy;
    });
  };

  return (
    <div>
      <label className={labelClass}>{label}</label>
      {hint && <p className="text-xs text-fg-3 mb-2">{hint}</p>}
      <input type="hidden" name={name} value={JSON.stringify(urls)} />

      {urls.length > 0 ? (
        <div className="flex flex-wrap gap-3 mb-3">
          {urls.map((url, i) => (
            <div key={`${url}-${i}`} className="relative group">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={url}
                alt=""
                className="h-24 w-24 object-cover rounded border border-border"
              />
              <div className="absolute inset-x-0 bottom-0 flex justify-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity bg-bg/80 py-0.5">
                <button
                  type="button"
                  onClick={() => move(i, -1)}
                  disabled={i === 0}
                  className="text-[10px] text-fg-3 disabled:opacity-30"
                >
                  ←
                </button>
                <button
                  type="button"
                  onClick={() => removeAt(i)}
                  className="text-[10px] text-red-400"
                >
                  ×
                </button>
                <button
                  type="button"
                  onClick={() => move(i, 1)}
                  disabled={i === urls.length - 1}
                  className="text-[10px] text-fg-3 disabled:opacity-30"
                >
                  →
                </button>
              </div>
              {i === 0 && firstBadgeLabel && (
                <span className="absolute top-1 left-1 text-[9px] bg-sage text-bg px-1 rounded">
                  {firstBadgeLabel}
                </span>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="mb-3 h-24 w-full max-w-xs rounded border border-dashed border-border-2 flex items-center justify-center text-xs text-fg-3">
          No images yet
        </div>
      )}

      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={(e) => {
          if (e.target.files?.length) uploadFiles(e.target.files);
        }}
      />
      <button
        type="button"
        disabled={uploading}
        onClick={() => fileRef.current?.click()}
        className="text-xs tracking-widest uppercase border border-border px-4 py-2 hover:border-sage hover:text-sage transition-colors disabled:opacity-50"
      >
        {uploading ? "Uploading…" : "Upload images"}
      </button>

      {error && <p className="text-xs text-red-400 mt-1">{error}</p>}
      {footerHint && <p className="text-[10px] text-fg-3 mt-2">{footerHint}</p>}
    </div>
  );
}
