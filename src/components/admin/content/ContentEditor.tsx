"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import type { HomeContent } from "@/lib/page-content";
import HomeContentForm from "./HomeContentForm";
import PageImagesForm from "@/components/admin/media/PageImagesForm";

type ImageRow = { key: string; value: string };

export default function ContentEditor({
  homeContent,
  imageRows,
}: {
  homeContent: HomeContent;
  imageRows: ImageRow[];
}) {
  const searchParams = useSearchParams();
  const initialTab = searchParams.get("tab") === "images" ? "images" : "copy";
  const [tab, setTab] = useState<"copy" | "images">(initialTab);

  return (
    <div>
      <div className="flex items-start justify-between gap-4 mb-8 flex-wrap">
        <div>
          <h1 className="font-display text-3xl font-light mb-2">网站内容</h1>
          <p className="text-fg-3 text-sm">修改前端页面文案与图片，保存后刷新前台即可看到更新。</p>
        </div>
        <a
          href="/"
          target="_blank"
          rel="noreferrer"
          className="text-xs tracking-widest uppercase border border-border px-4 py-2 rounded hover:border-sage hover:text-sage transition-colors"
        >
          预览前台 →
        </a>
      </div>

      <div className="flex gap-2 mb-8 border-b border-border pb-4">
        {[
          ["copy", "文案编辑"],
          ["images", "图片上传"],
        ].map(([id, label]) => (
          <button
            key={id}
            type="button"
            onClick={() => setTab(id as "copy" | "images")}
            className={`text-sm px-5 py-2 rounded-full transition-all ${
              tab === id
                ? "bg-sage text-bg"
                : "text-fg-3 hover:text-fg hover:bg-bg-3"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {tab === "copy" ? <HomeContentForm initial={homeContent} /> : <PageImagesForm initial={imageRows} />}
    </div>
  );
}
