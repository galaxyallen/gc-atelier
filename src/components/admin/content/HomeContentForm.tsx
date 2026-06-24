"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type { HomeContent } from "@/lib/page-content";
import { Field, SectionCard, inputClass, textareaClass } from "./form-fields";

export default function HomeContentForm({ initial }: { initial: HomeContent }) {
  const router = useRouter();
  const [data, setData] = useState(initial);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const set = <K extends keyof HomeContent>(section: K, patch: Partial<HomeContent[K]>) => {
    setData((prev) => ({ ...prev, [section]: { ...prev[section], ...patch } }));
  };

  const save = async () => {
    setLoading(true);
    setMessage("");
    try {
      const res = await fetch("/api/content/homepage", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sections: data }),
      });
      if (!res.ok) throw new Error("Save failed");
      setMessage("首页文案已保存。");
      router.refresh();
    } catch {
      setMessage("保存失败，请重试。");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <SectionCard title="首屏 Hero" description="首页顶部视频区域的标题与按钮文案">
        <div className="grid md:grid-cols-2 gap-4">
          <Field label="标题第一行">
            <input
              className={inputClass}
              value={data.hero.line1}
              onChange={(e) => set("hero", { line1: e.target.value })}
            />
          </Field>
          <Field label="标题第二行（斜体）">
            <input
              className={inputClass}
              value={data.hero.line2}
              onChange={(e) => set("hero", { line2: e.target.value })}
            />
          </Field>
        </div>
        <Field label="副标题">
          <textarea
            className={textareaClass}
            value={data.hero.subtitle}
            onChange={(e) => set("hero", { subtitle: e.target.value })}
          />
        </Field>
        <Field label="按钮文字">
          <input
            className={inputClass}
            value={data.hero.cta}
            onChange={(e) => set("hero", { cta: e.target.value })}
          />
        </Field>
      </SectionCard>

      <SectionCard title="关于区块">
        <Field label="小标题">
          <input
            className={inputClass}
            value={data.intro.label}
            onChange={(e) => set("intro", { label: e.target.value })}
          />
        </Field>
        <Field label="主标题">
          <textarea
            className={textareaClass}
            value={data.intro.heading}
            onChange={(e) => set("intro", { heading: e.target.value })}
          />
        </Field>
        <Field label="正文">
          <textarea
            className={textareaClass}
            rows={4}
            value={data.intro.body}
            onChange={(e) => set("intro", { body: e.target.value })}
          />
        </Field>
        <div className="grid grid-cols-3 gap-4">
          <Field label="数据：学科数">
            <input
              type="number"
              className={inputClass}
              value={data.intro.statsDisciplines}
              onChange={(e) => set("intro", { statsDisciplines: Number(e.target.value) })}
            />
          </Field>
          <Field label="数据：年限">
            <input
              type="number"
              className={inputClass}
              value={data.intro.statsYears}
              onChange={(e) => set("intro", { statsYears: Number(e.target.value) })}
            />
          </Field>
          <Field label="数据：项目数">
            <input
              type="number"
              className={inputClass}
              value={data.intro.statsProjects}
              onChange={(e) => set("intro", { statsProjects: Number(e.target.value) })}
            />
          </Field>
        </div>
      </SectionCard>

      <SectionCard title="项目区块">
        <div className="grid md:grid-cols-3 gap-4">
          <Field label="小标题">
            <input className={inputClass} value={data.projects.label} onChange={(e) => set("projects", { label: e.target.value })} />
          </Field>
          <Field label="主标题">
            <input className={inputClass} value={data.projects.heading} onChange={(e) => set("projects", { heading: e.target.value })} />
          </Field>
          <Field label="链接文字">
            <input className={inputClass} value={data.projects.linkText} onChange={(e) => set("projects", { linkText: e.target.value })} />
          </Field>
        </div>
        <p className="text-xs text-fg-3">项目卡片内容在「项目管理」中编辑。</p>
      </SectionCard>

      <SectionCard title="能力区块（Two disciplines）">
        <div className="grid md:grid-cols-2 gap-4">
          <Field label="小标题">
            <input className={inputClass} value={data.capability.label} onChange={(e) => set("capability", { label: e.target.value })} />
          </Field>
          <Field label="主标题">
            <input className={inputClass} value={data.capability.heading} onChange={(e) => set("capability", { heading: e.target.value })} />
          </Field>
        </div>
        <Field label="查看服务链接">
          <input className={inputClass} value={data.capability.linkText} onChange={(e) => set("capability", { linkText: e.target.value })} />
        </Field>
        <div className="grid md:grid-cols-2 gap-4">
          <Field label="左栏标题">
            <input className={inputClass} value={data.capability.residentialTitle} onChange={(e) => set("capability", { residentialTitle: e.target.value })} />
          </Field>
          <Field label="右栏标题">
            <input className={inputClass} value={data.capability.productTitle} onChange={(e) => set("capability", { productTitle: e.target.value })} />
          </Field>
          <Field label="左栏描述">
            <input className={inputClass} value={data.capability.residentialDesc} onChange={(e) => set("capability", { residentialDesc: e.target.value })} />
          </Field>
          <Field label="右栏描述">
            <input className={inputClass} value={data.capability.productDesc} onChange={(e) => set("capability", { productDesc: e.target.value })} />
          </Field>
        </div>
      </SectionCard>

      <SectionCard title="产品区块">
        <div className="grid md:grid-cols-3 gap-4">
          <Field label="小标题">
            <input className={inputClass} value={data.products.label} onChange={(e) => set("products", { label: e.target.value })} />
          </Field>
          <Field label="主标题">
            <input className={inputClass} value={data.products.heading} onChange={(e) => set("products", { heading: e.target.value })} />
          </Field>
          <Field label="链接文字">
            <input className={inputClass} value={data.products.linkText} onChange={(e) => set("products", { linkText: e.target.value })} />
          </Field>
        </div>
        <p className="text-xs text-fg-3">产品在「产品管理」中编辑。</p>
      </SectionCard>

      <SectionCard title="流程区块">
        <div className="grid md:grid-cols-2 gap-4">
          <Field label="小标题">
            <input className={inputClass} value={data.process.label} onChange={(e) => set("process", { label: e.target.value })} />
          </Field>
          <Field label="主标题">
            <input className={inputClass} value={data.process.heading} onChange={(e) => set("process", { heading: e.target.value })} />
          </Field>
        </div>
        <Field label="链接文字">
          <input className={inputClass} value={data.process.linkText} onChange={(e) => set("process", { linkText: e.target.value })} />
        </Field>
        <div className="space-y-3">
          {data.process.steps.map((step, i) => (
            <div key={step.num} className="grid md:grid-cols-3 gap-3 p-3 bg-bg-3 rounded border border-border">
              <input
                className={inputClass}
                value={step.title}
                placeholder="步骤标题"
                onChange={(e) => {
                  const steps = [...data.process.steps];
                  steps[i] = { ...steps[i], title: e.target.value };
                  set("process", { steps });
                }}
              />
              <input
                className={`${inputClass} md:col-span-2`}
                value={step.desc}
                placeholder="步骤描述"
                onChange={(e) => {
                  const steps = [...data.process.steps];
                  steps[i] = { ...steps[i], desc: e.target.value };
                  set("process", { steps });
                }}
              />
            </div>
          ))}
        </div>
      </SectionCard>

      <SectionCard title="Studio 预览区块">
        <div className="grid md:grid-cols-2 gap-4">
          <Field label="小标题">
            <input className={inputClass} value={data.studio.label} onChange={(e) => set("studio", { label: e.target.value })} />
          </Field>
          <Field label="主标题">
            <input className={inputClass} value={data.studio.heading} onChange={(e) => set("studio", { heading: e.target.value })} />
          </Field>
          <Field label="名称">
            <input className={inputClass} value={data.studio.name} onChange={(e) => set("studio", { name: e.target.value })} />
          </Field>
          <Field label="角色/地点">
            <input className={inputClass} value={data.studio.role} onChange={(e) => set("studio", { role: e.target.value })} />
          </Field>
        </div>
        <Field label="简介段落 1">
          <textarea className={textareaClass} value={data.studio.bio1} onChange={(e) => set("studio", { bio1: e.target.value })} />
        </Field>
        <Field label="简介段落 2">
          <textarea className={textareaClass} value={data.studio.bio2} onChange={(e) => set("studio", { bio2: e.target.value })} />
        </Field>
        <Field label="设计原则标题">
          <input
            className={inputClass}
            value={data.studio.principlesLabel}
            onChange={(e) => set("studio", { principlesLabel: e.target.value })}
          />
        </Field>
        <Field label="设计原则（每行一条）">
          <textarea
            className={textareaClass}
            rows={4}
            value={data.studio.principles.join("\n")}
            onChange={(e) =>
              set("studio", {
                principles: e.target.value.split("\n").filter(Boolean),
              })
            }
          />
        </Field>
        <Field label="链接文字">
          <input className={inputClass} value={data.studio.linkText} onChange={(e) => set("studio", { linkText: e.target.value })} />
        </Field>
      </SectionCard>

      <SectionCard title="联系预览区块">
        <Field label="小标题">
          <input className={inputClass} value={data.contact.label} onChange={(e) => set("contact", { label: e.target.value })} />
        </Field>
        <Field label="主标题">
          <input className={inputClass} value={data.contact.heading} onChange={(e) => set("contact", { heading: e.target.value })} />
        </Field>
        <Field label="描述">
          <textarea className={textareaClass} value={data.contact.description} onChange={(e) => set("contact", { description: e.target.value })} />
        </Field>
        <Field label="链接文字">
          <input className={inputClass} value={data.contact.linkText} onChange={(e) => set("contact", { linkText: e.target.value })} />
        </Field>
        <p className="text-xs text-fg-3">邮箱、电话等在「站点设置」中修改。</p>
      </SectionCard>

      {message && (
        <p className={`text-sm px-4 py-3 rounded-md ${message.includes("失败") ? "text-red-400 bg-red-400/10" : "text-sage bg-sage-dim"}`}>
          {message}
        </p>
      )}

      <button
        type="button"
        onClick={save}
        disabled={loading}
        className="text-xs tracking-widest uppercase bg-sage text-bg px-8 py-3 hover:bg-sage-light transition-colors disabled:opacity-50"
      >
        {loading ? "保存中…" : "保存首页文案"}
      </button>
    </div>
  );
}
