"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import type { ServicesContent } from "@/lib/page-content";
import ContentSection from "@/components/admin/shared/ContentSection";
import ImageUpload from "@/components/admin/shared/ImageUpload";
import DynamicList from "@/components/admin/shared/DynamicList";
import Toast from "@/components/admin/shared/Toast";
import AdminTopBar from "@/components/admin/layout/AdminTopBar";
import { Field, inputClass, textareaClass } from "@/components/admin/content/form-fields";
import { adminFetch } from "@/lib/admin/api-fetch";
import { persistSiteImage } from "@/lib/admin/persist-site-image";

const D2P_KEYS = ["services_d2p_01", "services_d2p_02", "services_d2p_03", "services_d2p_04", "services_d2p_05"] as const;
const FEAT_KEYS = [
  "services_feat_interior",
  "services_feat_villa",
  "services_feat_landscape",
  "services_feat_diffuser",
  "services_feat_backpack",
  "services_feat_speaker",
] as const;

export default function ServicesEditor({
  initial,
  images: initialImages,
}: {
  initial: ServicesContent;
  images: Record<string, string>;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [data, setData] = useState(initial);
  const [images, setImages] = useState(initialImages);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const setServiceImage = (key: string, value: string) => {
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
      const imageSettings = [...D2P_KEYS, ...FEAT_KEYS].map((key) => ({
        key,
        value: images[key] || "",
      }));
      const [contentRes, settingsRes] = await Promise.all([
        adminFetch("/api/content/services", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ sections: data }),
        }),
        adminFetch("/api/settings", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ settings: imageSettings }),
        }),
      ]);
      if (!contentRes.ok || !settingsRes.ok) throw new Error();
      setMessage("Services page saved.");
      router.refresh();
    } catch {
      setMessage("Save failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <AdminTopBar title="Services" breadcrumbs={["Pages", "Services"]} previewHref="/services" onSave={save} saving={loading} />
      <Toast message={message} type={message.includes("failed") ? "error" : "success"} />

      <ContentSection id="section-hero" title="Hero" defaultOpen>
        <Field label="Title"><textarea className={textareaClass} value={data.hero.title} onChange={(e) => setData({ ...data, hero: { ...data.hero, title: e.target.value } })} /></Field>
        <Field label="Subtitle"><input className={inputClass} value={data.hero.subtitle} onChange={(e) => setData({ ...data, hero: { ...data.hero, subtitle: e.target.value } })} /></Field>
        <div className="grid md:grid-cols-2 gap-4">
          <Field label="Left label"><input className={inputClass} value={data.hero.labelLeft} onChange={(e) => setData({ ...data, hero: { ...data.hero, labelLeft: e.target.value } })} /></Field>
          <Field label="Right label"><input className={inputClass} value={data.hero.labelRight} onChange={(e) => setData({ ...data, hero: { ...data.hero, labelRight: e.target.value } })} /></Field>
        </div>
      </ContentSection>

      <ContentSection id="section-panels" title="Interactive panels">
        <Field label="Section label"><input className={inputClass} value={data.panels.label} onChange={(e) => setData({ ...data, panels: { ...data.panels, label: e.target.value } })} /></Field>
        <Field label="Heading"><input className={inputClass} value={data.panels.heading} onChange={(e) => setData({ ...data, panels: { ...data.panels, heading: e.target.value } })} /></Field>
        {(["left", "right"] as const).map((side) => (
          <div key={side} className="p-4 border border-border rounded space-y-3">
            <p className="text-xs text-fg-3 uppercase tracking-widest">{side} panel</p>
            <input className={inputClass} value={data.panels[side].title} onChange={(e) => setData({ ...data, panels: { ...data.panels, [side]: { ...data.panels[side], title: e.target.value } } })} />
            <input className={inputClass} value={data.panels[side].subtitle} onChange={(e) => setData({ ...data, panels: { ...data.panels, [side]: { ...data.panels[side], subtitle: e.target.value } } })} />
            {data.panels[side].services.map((svc, i) => (
              <div key={i} className="grid md:grid-cols-2 gap-2">
                <input className={inputClass} value={svc.name} onChange={(e) => {
                  const services = [...data.panels[side].services];
                  services[i] = { ...services[i], name: e.target.value };
                  setData({ ...data, panels: { ...data.panels, [side]: { ...data.panels[side], services } } });
                }} />
                <input className={inputClass} value={svc.desc} onChange={(e) => {
                  const services = [...data.panels[side].services];
                  services[i] = { ...services[i], desc: e.target.value };
                  setData({ ...data, panels: { ...data.panels, [side]: { ...data.panels[side], services } } });
                }} />
              </div>
            ))}
          </div>
        ))}
      </ContentSection>

      <ContentSection id="section-service-modules" title="Service modules">
        {data.modules.map((mod, mi) => (
          <div key={mod.id} className="p-4 border border-border rounded mb-3 space-y-2">
            <p className="text-sm font-medium">{mod.title}</p>
            <ImageUpload
              src={images[FEAT_KEYS[mi]]}
              width={120}
              height={80}
              onUpload={(url) => setServiceImage(FEAT_KEYS[mi], url)}
              onRemove={() => setServiceImage(FEAT_KEYS[mi], "")}
            />
            <div className="grid md:grid-cols-3 gap-2">
              <input className={inputClass} value={mod.icon} onChange={(e) => {
                const modules = [...data.modules];
                modules[mi] = { ...modules[mi], icon: e.target.value };
                setData({ ...data, modules });
              }} />
              <input className={inputClass} value={mod.title} onChange={(e) => {
                const modules = [...data.modules];
                modules[mi] = { ...modules[mi], title: e.target.value };
                setData({ ...data, modules });
              }} />
              <input className={inputClass} value={mod.feat} onChange={(e) => {
                const modules = [...data.modules];
                modules[mi] = { ...modules[mi], feat: e.target.value };
                setData({ ...data, modules });
              }} />
            </div>
            <textarea className={textareaClass} value={mod.oneliner} onChange={(e) => {
              const modules = [...data.modules];
              modules[mi] = { ...modules[mi], oneliner: e.target.value };
              setData({ ...data, modules });
            }} />
          </div>
        ))}
      </ContentSection>

      <ContentSection id="section-d2p-strip" title="D2P strip">
        <Field label="Heading"><input className={inputClass} value={data.d2p.heading} onChange={(e) => setData({ ...data, d2p: { ...data.d2p, heading: e.target.value } })} /></Field>
        {data.d2p.stages.map((stage, i) => (
          <div key={stage.num} className="flex gap-3 items-start p-3 bg-bg-3 rounded border border-border">
            <ImageUpload
              src={images[D2P_KEYS[i]]}
              width={80}
              height={56}
              onUpload={(url) => setServiceImage(D2P_KEYS[i], url)}
              onRemove={() => setServiceImage(D2P_KEYS[i], "")}
            />
            <div className="flex-1 grid md:grid-cols-3 gap-2">
              <input className={inputClass} value={stage.num} readOnly />
              <input className={inputClass} value={stage.name} onChange={(e) => {
                const stages = [...data.d2p.stages];
                stages[i] = { ...stages[i], name: e.target.value };
                setData({ ...data, d2p: { ...data.d2p, stages } });
              }} />
              <input className={inputClass} value={stage.desc} onChange={(e) => {
                const stages = [...data.d2p.stages];
                stages[i] = { ...stages[i], desc: e.target.value };
                setData({ ...data, d2p: { ...data.d2p, stages } });
              }} />
            </div>
          </div>
        ))}
      </ContentSection>

      <ContentSection id="section-engagement" title="Engagement models">
        <Field label="Label"><input className={inputClass} value={data.engagement.label} onChange={(e) => setData({ ...data, engagement: { ...data.engagement, label: e.target.value } })} /></Field>
        <Field label="Heading"><input className={inputClass} value={data.engagement.heading} onChange={(e) => setData({ ...data, engagement: { ...data.engagement, heading: e.target.value } })} /></Field>
        {data.engagement.cards.map((card, i) => (
          <div key={i} className="p-3 bg-bg-3 rounded border border-border space-y-2">
            <input className={inputClass} value={card.name} onChange={(e) => {
              const cards = [...data.engagement.cards];
              cards[i] = { ...cards[i], name: e.target.value };
              setData({ ...data, engagement: { ...data.engagement, cards } });
            }} />
            <textarea className={textareaClass} value={card.desc} onChange={(e) => {
              const cards = [...data.engagement.cards];
              cards[i] = { ...cards[i], desc: e.target.value };
              setData({ ...data, engagement: { ...data.engagement, cards } });
            }} />
            <input className={inputClass} value={card.cta} placeholder="CTA text" onChange={(e) => {
              const cards = [...data.engagement.cards];
              cards[i] = { ...cards[i], cta: e.target.value };
              setData({ ...data, engagement: { ...data.engagement, cards } });
            }} />
          </div>
        ))}
      </ContentSection>

      <ContentSection id="section-faq" title="FAQ">
        <DynamicList
          items={data.faq}
          onChange={(faq) => setData({ ...data, faq })}
          createItem={() => ({ question: "New question", answer: "Answer" })}
          renderItem={(item, _i, update) => (
            <div className="space-y-2">
              <input className={inputClass} value={item.question} onChange={(e) => update({ question: e.target.value })} />
              <textarea className={textareaClass} value={item.answer} onChange={(e) => update({ answer: e.target.value })} />
            </div>
          )}
        />
      </ContentSection>

      <ContentSection id="section-cta" title="CTA">
        <Field label="Heading"><input className={inputClass} value={data.cta.heading} onChange={(e) => setData({ ...data, cta: { ...data.cta, heading: e.target.value } })} /></Field>
        <div className="grid md:grid-cols-2 gap-4">
          <Field label="Button 1 text"><input className={inputClass} value={data.cta.button1Text} onChange={(e) => setData({ ...data, cta: { ...data.cta, button1Text: e.target.value } })} /></Field>
          <Field label="Button 1 link"><input className={inputClass} value={data.cta.button1Link} onChange={(e) => setData({ ...data, cta: { ...data.cta, button1Link: e.target.value } })} /></Field>
          <Field label="Button 2 text"><input className={inputClass} value={data.cta.button2Text} onChange={(e) => setData({ ...data, cta: { ...data.cta, button2Text: e.target.value } })} /></Field>
          <Field label="Button 2 link"><input className={inputClass} value={data.cta.button2Link} onChange={(e) => setData({ ...data, cta: { ...data.cta, button2Link: e.target.value } })} /></Field>
        </div>
      </ContentSection>
    </div>
  );
}
