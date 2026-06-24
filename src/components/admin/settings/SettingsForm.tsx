"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

type SettingRow = { key: string; value: string };

const labelClass = "block text-[11px] tracking-widest text-fg-3 uppercase mb-2";
const inputClass =
  "w-full py-2.5 text-sm bg-transparent border-b border-border-2 outline-none focus:border-sage transition-colors";
const sectionClass = "pt-6 mt-6 border-t border-border";

const keyLabels: Record<string, string> = {
  site_name: "网站名称（导航栏 Logo 文字）",
  footer_copyright: "页脚版权文字",
  social_facebook: "Facebook 链接",
  social_instagram: "Instagram 链接",
  social_linkedin: "LinkedIn 链接",
  shop_page_label: "Shop 页 — 小标题",
  shop_page_title: "Shop 页 — 主标题",
  shop_page_subtitle: "Shop 页 — 副标题",
  projects_page_label: "Projects 页 — 小标题",
  projects_page_title: "Projects 页 — 主标题",
  projects_page_count_text: "Projects 页 — 数量说明（数字自动显示在前）",
  contact_email: "联系邮箱（备用，首页以 Contact 页面为准）",
  contact_phone: "联系电话（备用）",
  contact_wechat: "微信号（备用）",
  studio_address: "工作室地址（备用）",
};

const SECTIONS: { title: string; keys: string[] }[] = [
  {
    title: "站点与页脚",
    keys: ["site_name", "footer_copyright", "social_facebook", "social_instagram", "social_linkedin"],
  },
  {
    title: "Shop 页面标题",
    keys: ["shop_page_label", "shop_page_title", "shop_page_subtitle"],
  },
  {
    title: "Projects 页面标题",
    keys: ["projects_page_label", "projects_page_title", "projects_page_count_text"],
  },
  {
    title: "联系信息（备用）",
    keys: ["contact_email", "contact_phone", "contact_wechat", "studio_address"],
  },
];

export default function SettingsForm({ initial }: { initial: SettingRow[] }) {
  const router = useRouter();
  const [rows, setRows] = useState(initial);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const valueFor = (key: string) => rows.find((r) => r.key === key)?.value ?? "";

  const setValue = (key: string, value: string) => {
    setRows((prev) => {
      const i = prev.findIndex((r) => r.key === key);
      if (i >= 0) {
        const next = [...prev];
        next[i] = { ...next[i], value };
        return next;
      }
      return [...prev, { key, value }];
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
      setMessage("设置已保存。");
      router.refresh();
    } catch {
      setMessage("保存失败。");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-xl space-y-2">
      {message && (
        <p
          className={`text-sm px-4 py-3 rounded-md mb-4 ${
            message.includes("失败")
              ? "text-red-400 bg-red-400/10"
              : "text-sage bg-sage-dim"
          }`}
        >
          {message}
        </p>
      )}

      {SECTIONS.map((section) => (
        <div key={section.title} className={sectionClass}>
          <h2 className="text-sm font-medium text-fg mb-4">{section.title}</h2>
          <div className="space-y-5">
            {section.keys.map((key) => (
              <div key={key}>
                <label className={labelClass}>{keyLabels[key] ?? key}</label>
                <input
                  value={valueFor(key)}
                  onChange={(e) => setValue(key, e.target.value)}
                  className={inputClass}
                />
              </div>
            ))}
          </div>
        </div>
      ))}

      <button
        type="submit"
        disabled={loading}
        className="mt-8 text-xs tracking-widest uppercase bg-sage text-bg px-8 py-3 hover:bg-sage-light transition-colors disabled:opacity-50"
      >
        {loading ? "保存中…" : "保存设置"}
      </button>
    </form>
  );
}
