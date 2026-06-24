"use client";

import { useEffect } from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

function isMediaUrl(value: string) {
  return value.startsWith("/") || value.startsWith("http");
}

export default function Lightbox({
  images,
  open,
  index,
  onClose,
  onNavigate,
}: {
  images: string[];
  open: boolean;
  index: number;
  onClose: () => void;
  onNavigate: (i: number) => void;
}) {
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") onNavigate(index - 1);
      if (e.key === "ArrowRight") onNavigate(index + 1);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, index, onClose, onNavigate]);

  if (!open) return null;

  const safeIndex = ((index % images.length) + images.length) % images.length;
  const current = images[safeIndex] || "";

  return (
    <div className="fixed inset-0 z-[400] bg-black/92 flex items-center justify-center">
      <button
        type="button"
        onClick={onClose}
        className="absolute top-6 right-6 w-10 h-10 rounded-full bg-white/8 text-fg flex items-center justify-center hover:bg-white/15 transition-colors"
      >
        <X size={20} />
      </button>
      <button
        type="button"
        onClick={() => onNavigate(index - 1)}
        className="absolute left-6 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/6 border border-white/10 flex items-center justify-center hover:bg-white/12"
      >
        <ChevronLeft size={20} />
      </button>
      <div className="max-w-[80vw] max-h-[80vh] bg-bg-4 rounded-md flex items-center justify-center p-4 min-w-[200px] min-h-[200px] overflow-hidden">
        {isMediaUrl(current) ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={current} alt="" className="max-w-full max-h-[75vh] object-contain rounded" />
        ) : (
          <span className="text-sm text-fg-3 tracking-widest uppercase p-10">{current || "Image"}</span>
        )}
      </div>
      <button
        type="button"
        onClick={() => onNavigate(index + 1)}
        className="absolute right-6 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/6 border border-white/10 flex items-center justify-center hover:bg-white/12"
      >
        <ChevronRight size={20} />
      </button>
    </div>
  );
}
