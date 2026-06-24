"use client";

import { useRef, useState } from "react";

const labelClass = "block text-[11px] tracking-widest text-fg-3 uppercase mb-2";
const inputClass =
  "w-full py-2.5 text-sm bg-transparent border-b border-border-2 outline-none focus:border-sage transition-colors";

type Props = {
  name: string;
  label: string;
  defaultValue?: string;
  hint?: string;
  accept?: string;
  onChange?: (url: string) => void;
};

export default function ImageUploadField({
  name,
  label,
  defaultValue = "",
  hint,
  accept = "image/*",
  onChange,
}: Props) {
  const [url, setUrl] = useState(defaultValue);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  const upload = async (file: File) => {
    setUploading(true);
    setError("");
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Upload failed");
      }
      const { url: newUrl } = await res.json();
      setUrl(newUrl);
      onChange?.(newUrl);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  return (
    <div>
      <label className={labelClass}>{label}</label>
      {hint && <p className="text-xs text-fg-3 mb-2">{hint}</p>}
      <input type="hidden" name={name} value={url} />

      {url ? (
        <div className="mb-3 relative inline-block">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={url}
            alt=""
            className="max-h-40 rounded border border-border object-cover"
          />
          <button
            type="button"
            onClick={() => {
              setUrl("");
              onChange?.("");
            }}
            className="absolute top-1 right-1 text-[10px] bg-bg/90 text-fg-3 px-2 py-0.5 rounded hover:text-red-400"
          >
            Remove
          </button>
        </div>
      ) : (
        <div className="mb-3 h-24 w-40 rounded border border-dashed border-border-2 flex items-center justify-center text-xs text-fg-3">
          No image
        </div>
      )}

      <div className="flex flex-wrap gap-2 mb-2">
        <input
          ref={fileRef}
          type="file"
          accept={accept}
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) upload(file);
          }}
        />
        <button
          type="button"
          disabled={uploading}
          onClick={() => fileRef.current?.click()}
          className="text-xs tracking-widest uppercase border border-border px-4 py-2 hover:border-sage hover:text-sage transition-colors disabled:opacity-50"
        >
          {uploading ? "Uploading…" : "Upload image"}
        </button>
      </div>

      <input
        type="text"
        value={url}
        onChange={(e) => {
          setUrl(e.target.value);
          onChange?.(e.target.value);
        }}
        placeholder="Or paste image path / URL (e.g. /uploads/…)"
        className={inputClass}
      />

      {error && <p className="text-xs text-red-400 mt-1">{error}</p>}
    </div>
  );
}
