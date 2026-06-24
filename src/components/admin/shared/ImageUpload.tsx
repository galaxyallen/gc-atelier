"use client";

import { useRef, useState } from "react";
import { Upload, Trash2 } from "lucide-react";
import { uploadFile } from "@/lib/admin/api-fetch";

type Props = {
  src?: string;
  label?: string;
  width?: number;
  height?: number;
  accept?: string;
  onUpload: (url: string) => void;
  onRemove?: () => void;
  onError?: (message: string) => void;
};

export default function ImageUpload({
  src,
  label,
  width = 160,
  height = 100,
  accept = "image/*",
  onUpload,
  onRemove,
  onError,
}: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const handleUpload = async (file: File) => {
    setUploading(true);
    try {
      const { url, error } = await uploadFile(file);
      if (error) {
        onError?.(error);
        return;
      }
      if (url) onUpload(url);
    } finally {
      setUploading(false);
    }
  };

  if (!src) {
    return (
      <label
        className="flex items-center justify-center cursor-pointer border border-dashed border-border-2 hover:border-sage hover:text-sage text-fg-3 transition-colors rounded-lg"
        style={{ width, height }}
      >
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          className="hidden"
          disabled={uploading}
          onChange={(e) => e.target.files?.[0] && handleUpload(e.target.files[0])}
        />
        <span className="text-xl">{uploading ? "…" : "+"}</span>
      </label>
    );
  }

  return (
    <div
      className="relative group rounded-lg overflow-hidden border border-border"
      style={{ width, height }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt={label || ""} className="w-full h-full object-cover" />
      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
        <button type="button" onClick={() => inputRef.current?.click()} className="text-white" disabled={uploading}>
          <Upload size={18} />
        </button>
        {onRemove && (
          <button type="button" onClick={onRemove} className="text-white">
            <Trash2 size={18} />
          </button>
        )}
      </div>
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        className="hidden"
        disabled={uploading}
        onChange={(e) => e.target.files?.[0] && handleUpload(e.target.files[0])}
      />
    </div>
  );
}
