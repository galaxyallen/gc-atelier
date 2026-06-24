"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import type { StudioContent } from "@/lib/page-content";
import ContentSection from "@/components/admin/shared/ContentSection";
import ImageUpload from "@/components/admin/shared/ImageUpload";
import DynamicList from "@/components/admin/shared/DynamicList";
import Toast from "@/components/admin/shared/Toast";
import AdminTopBar from "@/components/admin/layout/AdminTopBar";
import { Field, inputClass, textareaClass } from "@/components/admin/content/form-fields";
import { adminFetch } from "@/lib/admin/api-fetch";
import { persistSiteImage } from "@/lib/admin/persist-site-image";

export default function StudioEditor({
  initial,
  images: initialImages,
}: {
  initial: StudioContent;
  images: Record<string, string>;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [data, setData] = useState(initial);
  const [images, setImages] = useState(initialImages);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const setStudioImage = (key: string, value: string) => {
    setImages((p) => ({ ...p, [key]: value }));
    void persistSiteImage(key, value);
  };

  useEffect(() => {
    const section = searchParams.get("section");
    if (!section) return;
    document.getElementById(`section-${section}`)?.scrollIntoView({ behavior: "smooth" });
  }, [searchParams]);

  const save = async () => {
    setLoading(true);
    setMessage("");
    try {
      const [contentRes, settingsRes] = await Promise.all([
        adminFetch("/api/content/studio", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ sections: data }),
        }),
        adminFetch("/api/settings", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            settings: [
              { key: "studio_hero_image", value: images.studio_hero_image || "" },
              { key: "studio_origin_image", value: images.studio_origin_image || "" },
            ],
          }),
        }),
      ]);
      if (!contentRes.ok || !settingsRes.ok) throw new Error();
      setMessage("Studio page saved.");
      router.refresh();
    } catch {
      setMessage("Save failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <AdminTopBar title="Studio" breadcrumbs={["Pages", "Studio"]} previewHref="/studio" onSave={save} saving={loading} />
      <Toast message={message} type={message.includes("failed") ? "error" : "success"} />

      <ContentSection id="section-hero" title="Hero" defaultOpen>
        <ImageUpload
          src={images.studio_hero_image}
          width={240}
          height={120}
          onUpload={(url) => setStudioImage("studio_hero_image", url)}
          onRemove={() => setStudioImage("studio_hero_image", "")}
        />
        <div className="grid md:grid-cols-3 gap-4 mt-4">
          <Field label="Mark text"><input className={inputClass} value={data.hero.mark} onChange={(e) => setData({ ...data, hero: { ...data.hero, mark: e.target.value } })} /></Field>
          <Field label="Title"><input className={inputClass} value={data.hero.title} onChange={(e) => setData({ ...data, hero: { ...data.hero, title: e.target.value } })} /></Field>
          <Field label="Subtitle"><input className={inputClass} value={data.hero.subtitle} onChange={(e) => setData({ ...data, hero: { ...data.hero, subtitle: e.target.value } })} /></Field>
        </div>
      </ContentSection>

      <ContentSection id="section-manifesto" title="Manifesto">
        {data.manifesto.map((line, i) => (
          <div key={i} className="flex gap-3 items-center">
            <input className={`${inputClass} flex-1`} value={line.text} onChange={(e) => {
              const manifesto = [...data.manifesto];
              manifesto[i] = { ...manifesto[i], text: e.target.value };
              setData({ ...data, manifesto });
            }} />
            <label className="text-xs text-fg-3 flex items-center gap-1 shrink-0">
              <input type="checkbox" checked={line.italic} onChange={(e) => {
                const manifesto = [...data.manifesto];
                manifesto[i] = { ...manifesto[i], italic: e.target.checked };
                setData({ ...data, manifesto });
              }} />
              Italic sage
            </label>
          </div>
        ))}
      </ContentSection>

      <ContentSection id="section-origin-story" title="Origin story">
        <ImageUpload
          src={images.studio_origin_image}
          width={140}
          height={180}
          onUpload={(url) => setStudioImage("studio_origin_image", url)}
          onRemove={() => setStudioImage("studio_origin_image", "")}
        />
        <Field label="Label"><input className={inputClass} value={data.origin.label} onChange={(e) => setData({ ...data, origin: { ...data.origin, label: e.target.value } })} /></Field>
        <Field label="Heading"><textarea className={textareaClass} value={data.origin.heading} onChange={(e) => setData({ ...data, origin: { ...data.origin, heading: e.target.value } })} /></Field>
        {data.origin.paragraphs.map((p, i) => (
          <Field key={i} label={`Paragraph ${i + 1}`}>
            <textarea className={textareaClass} value={p} onChange={(e) => {
              const paragraphs = [...data.origin.paragraphs];
              paragraphs[i] = e.target.value;
              setData({ ...data, origin: { ...data.origin, paragraphs } });
            }} />
          </Field>
        ))}
        <Field label="Signature"><input className={inputClass} value={data.origin.signature} onChange={(e) => setData({ ...data, origin: { ...data.origin, signature: e.target.value } })} /></Field>
      </ContentSection>

      <ContentSection id="section-philosophy" title="Philosophy">
        <Field label="Label"><input className={inputClass} value={data.philo.label} onChange={(e) => setData({ ...data, philo: { ...data.philo, label: e.target.value } })} /></Field>
        <Field label="Heading"><input className={inputClass} value={data.philo.heading} onChange={(e) => setData({ ...data, philo: { ...data.philo, heading: e.target.value } })} /></Field>
        {data.philo.cards.map((card, i) => (
          <div key={card.num} className="p-3 bg-bg-3 rounded border border-border space-y-2">
            <input className={inputClass} value={card.title} placeholder="Title" onChange={(e) => {
              const cards = [...data.philo.cards];
              cards[i] = { ...cards[i], title: e.target.value };
              setData({ ...data, philo: { ...data.philo, cards } });
            }} />
            <textarea className={textareaClass} value={card.desc} onChange={(e) => {
              const cards = [...data.philo.cards];
              cards[i] = { ...cards[i], desc: e.target.value };
              setData({ ...data, philo: { ...data.philo, cards } });
            }} />
          </div>
        ))}
      </ContentSection>

      <ContentSection id="section-capabilities" title="Capabilities">
        <Field label="Label"><input className={inputClass} value={data.capabilities.label} onChange={(e) => setData({ ...data, capabilities: { ...data.capabilities, label: e.target.value } })} /></Field>
        <Field label="Heading"><input className={inputClass} value={data.capabilities.heading} onChange={(e) => setData({ ...data, capabilities: { ...data.capabilities, heading: e.target.value } })} /></Field>
        {data.capabilities.cards.map((card, i) => (
          <div key={card.name} className="p-3 bg-bg-3 rounded border border-border grid md:grid-cols-2 gap-2">
            <input className={inputClass} value={card.icon} placeholder="Icon" onChange={(e) => {
              const cards = [...data.capabilities.cards];
              cards[i] = { ...cards[i], icon: e.target.value };
              setData({ ...data, capabilities: { ...data.capabilities, cards } });
            }} />
            <input className={inputClass} value={card.name} placeholder="Name" onChange={(e) => {
              const cards = [...data.capabilities.cards];
              cards[i] = { ...cards[i], name: e.target.value };
              setData({ ...data, capabilities: { ...data.capabilities, cards } });
            }} />
            <textarea className={`${textareaClass} md:col-span-2`} value={card.desc} onChange={(e) => {
              const cards = [...data.capabilities.cards];
              cards[i] = { ...cards[i], desc: e.target.value };
              setData({ ...data, capabilities: { ...data.capabilities, cards } });
            }} />
            <input className={`${inputClass} md:col-span-2`} value={card.tags.join(", ")} placeholder="Tags (comma-separated)" onChange={(e) => {
              const cards = [...data.capabilities.cards];
              cards[i] = { ...cards[i], tags: e.target.value.split(",").map((t) => t.trim()).filter(Boolean) };
              setData({ ...data, capabilities: { ...data.capabilities, cards } });
            }} />
          </div>
        ))}
      </ContentSection>

      <ContentSection id="section-network" title="Network">
        <Field label="Label"><input className={inputClass} value={data.network.label} onChange={(e) => setData({ ...data, network: { ...data.network, label: e.target.value } })} /></Field>
        <Field label="Heading"><input className={inputClass} value={data.network.heading} onChange={(e) => setData({ ...data, network: { ...data.network, heading: e.target.value } })} /></Field>
        <div className="grid md:grid-cols-2 gap-3">
          {data.network.stats.map((stat, i) => (
            <div key={i} className="grid grid-cols-3 gap-2">
              <input type="number" className={inputClass} value={stat.num} onChange={(e) => {
                const stats = [...data.network.stats];
                stats[i] = { ...stats[i], num: Number(e.target.value) };
                setData({ ...data, network: { ...data.network, stats } });
              }} />
              <input className={inputClass} value={stat.suffix} onChange={(e) => {
                const stats = [...data.network.stats];
                stats[i] = { ...stats[i], suffix: e.target.value };
                setData({ ...data, network: { ...data.network, stats } });
              }} />
              <input className={inputClass} value={stat.label} onChange={(e) => {
                const stats = [...data.network.stats];
                stats[i] = { ...stats[i], label: e.target.value };
                setData({ ...data, network: { ...data.network, stats } });
              }} />
            </div>
          ))}
        </div>
        {data.network.regions.map((region, i) => (
          <div key={i} className="grid md:grid-cols-2 gap-2">
            <input className={inputClass} value={region.name} onChange={(e) => {
              const regions = [...data.network.regions];
              regions[i] = { ...regions[i], name: e.target.value };
              setData({ ...data, network: { ...data.network, regions } });
            }} />
            <input className={inputClass} value={region.categories} onChange={(e) => {
              const regions = [...data.network.regions];
              regions[i] = { ...regions[i], categories: e.target.value };
              setData({ ...data, network: { ...data.network, regions } });
            }} />
          </div>
        ))}
      </ContentSection>

      <ContentSection id="section-milestones" title="Milestones">
        <Field label="Label"><input className={inputClass} value={data.milestones.label} onChange={(e) => setData({ ...data, milestones: { ...data.milestones, label: e.target.value } })} /></Field>
        <Field label="Heading"><input className={inputClass} value={data.milestones.heading} onChange={(e) => setData({ ...data, milestones: { ...data.milestones, heading: e.target.value } })} /></Field>
        <DynamicList
          items={data.milestones.items}
          onChange={(items) => setData({ ...data, milestones: { ...data.milestones, items } })}
          createItem={() => ({ year: "2026", label: "New milestone" })}
          minItems={1}
          renderItem={(item, _i, update) => (
            <div className="grid md:grid-cols-2 gap-2">
              <input className={inputClass} value={item.year} onChange={(e) => update({ year: e.target.value })} />
              <textarea className={textareaClass} value={item.label} onChange={(e) => update({ label: e.target.value })} />
            </div>
          )}
        />
      </ContentSection>

      <ContentSection id="section-cta" title="CTA">
        <Field label="Heading"><textarea className={textareaClass} value={data.cta.heading} onChange={(e) => setData({ ...data, cta: { ...data.cta, heading: e.target.value } })} /></Field>
        <div className="grid md:grid-cols-2 gap-4">
          <Field label="Button text"><input className={inputClass} value={data.cta.buttonText} onChange={(e) => setData({ ...data, cta: { ...data.cta, buttonText: e.target.value } })} /></Field>
          <Field label="Button link"><input className={inputClass} value={data.cta.buttonLink} onChange={(e) => setData({ ...data, cta: { ...data.cta, buttonLink: e.target.value } })} /></Field>
        </div>
      </ContentSection>
    </div>
  );
}
