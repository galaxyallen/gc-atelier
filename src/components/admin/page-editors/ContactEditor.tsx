"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import type { ContactContent } from "@/lib/page-content";
import ContentSection from "@/components/admin/shared/ContentSection";
import ImageUpload from "@/components/admin/shared/ImageUpload";
import Toast from "@/components/admin/shared/Toast";
import AdminTopBar from "@/components/admin/layout/AdminTopBar";
import { Field, inputClass, textareaClass } from "@/components/admin/content/form-fields";
import { adminFetch } from "@/lib/admin/api-fetch";
import { persistSiteImage } from "@/lib/admin/persist-site-image";

export default function ContactEditor({
  initial,
  mapImage: initialMap,
}: {
  initial: ContactContent;
  mapImage: string;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [data, setData] = useState(initial);
  const [mapImage, setMapImage] = useState(initialMap);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const updateMapImage = (value: string) => {
    setMapImage(value);
    void persistSiteImage("contact_map_image", value);
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
        adminFetch("/api/content/contact", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ sections: data }),
        }),
        adminFetch("/api/settings", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ settings: [{ key: "contact_map_image", value: mapImage }] }),
        }),
      ]);
      if (!contentRes.ok || !settingsRes.ok) throw new Error();
      setMessage("Contact page saved.");
      router.refresh();
    } catch {
      setMessage("Save failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <AdminTopBar title="Contact" breadcrumbs={["Pages", "Contact"]} previewHref="/contact" onSave={save} saving={loading} />
      <Toast message={message} type={message.includes("failed") ? "error" : "success"} />

      <ContentSection id="section-channels" title="Channels" defaultOpen>
        <Field label="Hero title"><textarea className={textareaClass} value={data.hero.title} onChange={(e) => setData({ ...data, hero: { ...data.hero, title: e.target.value } })} /></Field>
        <Field label="Hero subtitle"><textarea className={textareaClass} value={data.hero.subtitle} onChange={(e) => setData({ ...data, hero: { ...data.hero, subtitle: e.target.value } })} /></Field>
        <Field label="Intro text"><textarea className={textareaClass} value={data.channels.intro} onChange={(e) => setData({ ...data, channels: { ...data.channels, intro: e.target.value } })} /></Field>
        <div className="grid md:grid-cols-2 gap-4">
          <Field label="Email"><input className={inputClass} value={data.channels.email} onChange={(e) => setData({ ...data, channels: { ...data.channels, email: e.target.value } })} /></Field>
          <Field label="WhatsApp"><input className={inputClass} value={data.channels.whatsapp} onChange={(e) => setData({ ...data, channels: { ...data.channels, whatsapp: e.target.value } })} /></Field>
          <Field label="WeChat"><input className={inputClass} value={data.channels.wechat} onChange={(e) => setData({ ...data, channels: { ...data.channels, wechat: e.target.value } })} /></Field>
          <Field label="Phone"><input className={inputClass} value={data.channels.phone} onChange={(e) => setData({ ...data, channels: { ...data.channels, phone: e.target.value } })} /></Field>
        </div>
        <Field label="Address"><textarea className={textareaClass} value={data.channels.address} onChange={(e) => setData({ ...data, channels: { ...data.channels, address: e.target.value } })} /></Field>
        <div>
          <p className="text-[11px] tracking-widest text-fg-3 uppercase mb-2">Map image</p>
          <ImageUpload src={mapImage} width={200} height={120} onUpload={updateMapImage} onRemove={() => updateMapImage("")} />
        </div>
      </ContentSection>

      <ContentSection id="section-form-config" title="Form config">
        <Field label="Form title"><input className={inputClass} value={data.form.title} onChange={(e) => setData({ ...data, form: { ...data.form, title: e.target.value } })} /></Field>
        <Field label="Submit button text"><input className={inputClass} value={data.form.submitText} onChange={(e) => setData({ ...data, form: { ...data.form, submitText: e.target.value } })} /></Field>
        <Field label="Sending button text"><input className={inputClass} value={data.form.sendingText} onChange={(e) => setData({ ...data, form: { ...data.form, sendingText: e.target.value } })} /></Field>
        <div className="grid md:grid-cols-2 gap-4">
          <Field label="Name label"><input className={inputClass} value={data.form.nameLabel} onChange={(e) => setData({ ...data, form: { ...data.form, nameLabel: e.target.value } })} /></Field>
          <Field label="Company label"><input className={inputClass} value={data.form.companyLabel} onChange={(e) => setData({ ...data, form: { ...data.form, companyLabel: e.target.value } })} /></Field>
          <Field label="Email label"><input className={inputClass} value={data.form.emailLabel} onChange={(e) => setData({ ...data, form: { ...data.form, emailLabel: e.target.value } })} /></Field>
          <Field label="Project type label"><input className={inputClass} value={data.form.projectTypeLabel} onChange={(e) => setData({ ...data, form: { ...data.form, projectTypeLabel: e.target.value } })} /></Field>
          <Field label="Message label"><input className={inputClass} value={data.form.messageLabel} onChange={(e) => setData({ ...data, form: { ...data.form, messageLabel: e.target.value } })} /></Field>
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          <Field label="Name placeholder"><input className={inputClass} value={data.form.namePlaceholder} onChange={(e) => setData({ ...data, form: { ...data.form, namePlaceholder: e.target.value } })} /></Field>
          <Field label="Company placeholder"><input className={inputClass} value={data.form.companyPlaceholder} onChange={(e) => setData({ ...data, form: { ...data.form, companyPlaceholder: e.target.value } })} /></Field>
          <Field label="Email placeholder"><input className={inputClass} value={data.form.emailPlaceholder} onChange={(e) => setData({ ...data, form: { ...data.form, emailPlaceholder: e.target.value } })} /></Field>
          <Field label="Project type placeholder"><input className={inputClass} value={data.form.projectTypePlaceholder} onChange={(e) => setData({ ...data, form: { ...data.form, projectTypePlaceholder: e.target.value } })} /></Field>
          <Field label="Message placeholder"><input className={inputClass} value={data.form.messagePlaceholder} onChange={(e) => setData({ ...data, form: { ...data.form, messagePlaceholder: e.target.value } })} /></Field>
        </div>
        <Field label="Success title"><input className={inputClass} value={data.form.successTitle} onChange={(e) => setData({ ...data, form: { ...data.form, successTitle: e.target.value } })} /></Field>
        <Field label="Success description"><textarea className={textareaClass} value={data.form.successDesc} onChange={(e) => setData({ ...data, form: { ...data.form, successDesc: e.target.value } })} /></Field>
        <p className="text-xs text-fg-3 mb-2">Project type options</p>
        <div className="space-y-2">
          {data.form.projectTypes.map((opt, i) => (
            <input
              key={i}
              className={inputClass}
              value={opt}
              onChange={(e) => {
                const projectTypes = [...data.form.projectTypes];
                projectTypes[i] = e.target.value;
                setData({ ...data, form: { ...data.form, projectTypes } });
              }}
            />
          ))}
          <button
            type="button"
            className="text-xs text-sage"
            onClick={() =>
              setData({
                ...data,
                form: { ...data.form, projectTypes: [...data.form.projectTypes, "New option"] },
              })
            }
          >
            + Add option
          </button>
        </div>
        <p className="text-xs text-fg-3 mb-2 mt-4">Budget options</p>
        <div className="space-y-2">
          {data.form.budgets.map((opt, i) => (
            <input
              key={i}
              className={inputClass}
              value={opt}
              onChange={(e) => {
                const budgets = [...data.form.budgets];
                budgets[i] = e.target.value;
                setData({ ...data, form: { ...data.form, budgets } });
              }}
            />
          ))}
          <button
            type="button"
            className="text-xs text-sage"
            onClick={() =>
              setData({
                ...data,
                form: { ...data.form, budgets: [...data.form.budgets, "New budget"] },
              })
            }
          >
            + Add budget
          </button>
        </div>
      </ContentSection>

      <ContentSection id="section-availability" title="Availability">
        <Field label="Label"><input className={inputClass} value={data.availability.label} onChange={(e) => setData({ ...data, availability: { ...data.availability, label: e.target.value } })} /></Field>
        <Field label="Heading"><input className={inputClass} value={data.availability.heading} onChange={(e) => setData({ ...data, availability: { ...data.availability, heading: e.target.value } })} /></Field>
        {data.availability.cards.map((card, i) => (
          <div key={i} className="grid md:grid-cols-4 gap-2 p-3 bg-bg-3 rounded border border-border">
            <input className={inputClass} value={card.icon} onChange={(e) => {
              const cards = [...data.availability.cards];
              cards[i] = { ...cards[i], icon: e.target.value };
              setData({ ...data, availability: { ...data.availability, cards } });
            }} />
            <input className={inputClass} value={card.title} onChange={(e) => {
              const cards = [...data.availability.cards];
              cards[i] = { ...cards[i], title: e.target.value };
              setData({ ...data, availability: { ...data.availability, cards } });
            }} />
            <input className={inputClass} value={card.detail} onChange={(e) => {
              const cards = [...data.availability.cards];
              cards[i] = { ...cards[i], detail: e.target.value };
              setData({ ...data, availability: { ...data.availability, cards } });
            }} />
            <input className={inputClass} value={card.note} onChange={(e) => {
              const cards = [...data.availability.cards];
              cards[i] = { ...cards[i], note: e.target.value };
              setData({ ...data, availability: { ...data.availability, cards } });
            }} />
          </div>
        ))}
      </ContentSection>
    </div>
  );
}
