"use client";

import { useRef, useState } from "react";
import { Upload, Trash2 } from "lucide-react";
import { uploadFile } from "@/lib/admin/api-fetch";

type Props = {
  src?: string;
  poster?: string;
  label?: string;
  onUpload: (url: string) => void;
  onRemove?: () => void;
  onError?: (message: string) => void;
};

export default function VideoUpload({ src, poster, label, onUpload, onRemove, onError }: Props) {
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

  return (
    <div className="space-y-2">
      {label && <p className="text-[11px] tracking-widest text-fg-3 uppercase">{label}</p>}
      <div className="relative rounded-lg overflow-hidden border border-border bg-bg-3 aspect-video max-w-md">
        {src ? (
          <video src={src} poster={poster} className="w-full h-full object-cover" controls muted />
        ) : (
          <div className="flex items-center justify-center h-full text-fg-3 text-sm">No video</div>
        )}
        <div className="absolute top-2 right-2 flex gap-2">
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={uploading}
            className="p-2 rounded bg-bg/90 text-fg hover:text-sage transition-colors"
          >
            <Upload size={16} />
          </button>
          {src && onRemove && (
            <button
              type="button"
              onClick={onRemove}
              className="p-2 rounded bg-bg/90 text-fg hover:text-red-400 transition-colors"
            >
              <Trash2 size={16} />
            </button>
          )}
        </div>
        <input
          ref={inputRef}
          type="file"
          accept="video/mp4,video/webm"
          className="hidden"
          disabled={uploading}
          onChange={(e) => e.target.files?.[0] && handleUpload(e.target.files[0])}
        />
      </div>
      {src && <p className="text-xs text-fg-3 truncate max-w-md">{src}</p>}
      {uploading && <p className="text-xs text-fg-3">Uploading…</p>}
    </div>
  );
}
