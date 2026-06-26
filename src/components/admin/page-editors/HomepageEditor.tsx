"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Film, Type, FolderKanban, Layers, Package, ListOrdered, Building2, Mail } from "lucide-react";
import type { HomeContent, HomeProductCard, HomeProjectCard } from "@/lib/page-content";
import { pickHomeContactSection } from "@/lib/page-content";
import ContentSection from "@/components/admin/shared/ContentSection";
import ImageUpload from "@/components/admin/shared/ImageUpload";
import VideoUpload from "@/components/admin/shared/VideoUpload";
import Toast from "@/components/admin/shared/Toast";
import AdminTopBar from "@/components/admin/layout/AdminTopBar";
import { Field, inputClass, textareaClass } from "@/components/admin/content/form-fields";
import { adminFetch } from "@/lib/admin/api-fetch";
import { persistSiteImage } from "@/lib/admin/persist-site-image";
import { categoryLabels, productCategoryLabels } from "@/lib/utils";

const HOMEPAGE_IMAGE_KEYS = ["hero_poster", "hero_video", "studio_founder_image"] as const;

const EMPTY_PROJECT: HomeProjectCard = { name: "", category: "VILLA", image: "" };
const EMPTY_PRODUCT: HomeProductCard = { name: "", category: "DIFFUSER", price: 0, image: "" };

function padCards<T>(saved: T[] | undefined, fallback: T[], empty: T): T[] {
  const source = saved?.length ? saved : fallback;
  const cards = source.slice(0, 4);
  while (cards.length < 4) cards.push({ ...empty });
  return cards;
}

type Props = {
  initial: HomeContent;
  images: Record<string, string>;
  contactChannels: {
    email: string;
    phone: string;
    wechat: string;
    address: string;
  };
  dbProjectCards: HomeProjectCard[];
  dbProductCards: HomeProductCard[];
};

export default function HomepageEditor({
  initial,
  images: initialImages,
  contactChannels,
  dbProjectCards,
  dbProductCards,
}: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [images, setImages] = useState(initialImages);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const [data, setData] = useState<HomeContent>(() => ({
    ...initial,
    projects: {
      ...initial.projects,
      cards: padCards(initial.projects.cards, dbProjectCards, EMPTY_PROJECT),
    },
    products: {
      ...initial.products,
      cards: padCards(initial.products.cards, dbProductCards, EMPTY_PRODUCT),
    },
    contact: pickHomeContactSection(initial.contact),
  }));

  const projectCategories = useMemo(() => Object.keys(categoryLabels), []);
  const productCategories = useMemo(() => Object.keys(productCategoryLabels), []);

  const set = <K extends keyof HomeContent>(section: K, patch: Partial<HomeContent[K]>) => {
    setData((prev) => ({ ...prev, [section]: { ...prev[section], ...patch } }));
  };

  const setImage = (key: string, value: string) => {
    setImages((prev) => ({ ...prev, [key]: value }));
    void persistSiteImage(key, value).then((ok) => {
      if (!ok) setMessage("图片已上传，但保存到数据库失败，请点 Save all 重试。");
    });
  };

  const onUploadError = (msg: string) => setMessage(msg);

  useEffect(() => {
    const section = searchParams.get("section");
    if (!section) return;
    const el = document.getElementById(`section-${section}`);
    el?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [searchParams]);

  const save = async () => {
    setLoading(true);
    setMessage("");
    try {
      const projectCards = data.projects.cards?.filter((c) => c.name.trim()) ?? [];
      const productCards = data.products.cards?.filter((c) => c.name.trim()) ?? [];
      const homepagePayload: HomeContent = {
        ...data,
        projects: { ...data.projects, cards: projectCards.length ? projectCards : undefined },
        products: { ...data.products, cards: productCards.length ? productCards : undefined },
        contact: pickHomeContactSection(data.contact),
      };

      const [contentRes, settingsRes] = await Promise.all([
        adminFetch("/api/content/homepage", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ sections: homepagePayload }),
        }),
        adminFetch("/api/settings", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            settings: HOMEPAGE_IMAGE_KEYS.map((key) => ({ key, value: images[key] || "" })),
          }),
        }),
      ]);
      if (!contentRes.ok || !settingsRes.ok) throw new Error("Save failed");
      setMessage("Homepage saved.");
      router.refresh();
    } catch {
      setMessage("Save failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <AdminTopBar
        title="Homepage"
        breadcrumbs={["Pages", "Homepage"]}
        previewHref="/"
        onSave={save}
        saving={loading}
      />
      <Toast message={message} type={/failed|失败|Unauthorized/i.test(message) ? "error" : "success"} />

      <ContentSection id="section-hero-video" icon={<Film size={16} />} title="Hero video" defaultOpen>
        <div className="grid md:grid-cols-2 gap-6">
          <VideoUpload
            src={images.hero_video}
            poster={images.hero_poster}
            label="Background video"
            onUpload={(url) => setImage("hero_video", url)}
            onRemove={() => setImage("hero_video", "")}
            onError={onUploadError}
          />
          <div>
            <p className="text-[11px] tracking-widest text-fg-3 uppercase mb-2">Poster image</p>
            <ImageUpload
              src={images.hero_poster}
              width={200}
              height={120}
              onUpload={(url) => setImage("hero_poster", url)}
              onRemove={() => setImage("hero_poster", "")}
              onError={onUploadError}
            />
          </div>
        </div>
        <div className="grid md:grid-cols-2 gap-4 mt-4">
          <Field label="Tagline line 1">
            <input className={inputClass} value={data.hero.line1} onChange={(e) => set("hero", { line1: e.target.value })} />
          </Field>
          <Field label="Tagline line 2 (italic sage)">
            <input className={inputClass} value={data.hero.line2} onChange={(e) => set("hero", { line2: e.target.value })} />
          </Field>
        </div>
        <Field label="Subtitle">
          <textarea className={textareaClass} value={data.hero.subtitle} onChange={(e) => set("hero", { subtitle: e.target.value })} />
        </Field>
        <Field label="CTA text">
          <input className={inputClass} value={data.hero.cta} onChange={(e) => set("hero", { cta: e.target.value })} />
        </Field>
      </ContentSection>

      <ContentSection id="section-brand-intro" icon={<Type size={16} />} title="Brand intro">
        <Field label="Section label">
          <input className={inputClass} value={data.intro.label} onChange={(e) => set("intro", { label: e.target.value })} />
        </Field>
        <Field label="Heading">
          <textarea className={textareaClass} value={data.intro.heading} onChange={(e) => set("intro", { heading: e.target.value })} />
        </Field>
        <Field label="Paragraph">
          <textarea className={textareaClass} rows={4} value={data.intro.body} onChange={(e) => set("intro", { body: e.target.value })} />
        </Field>
        <div className="grid grid-cols-3 gap-4">
          <Field label="Stat: disciplines">
            <input type="number" className={inputClass} value={data.intro.statsDisciplines} onChange={(e) => set("intro", { statsDisciplines: Number(e.target.value) })} />
          </Field>
          <Field label="Stat: years">
            <input type="number" className={inputClass} value={data.intro.statsYears} onChange={(e) => set("intro", { statsYears: Number(e.target.value) })} />
          </Field>
          <Field label="Stat: projects">
            <input type="number" className={inputClass} value={data.intro.statsProjects} onChange={(e) => set("intro", { statsProjects: Number(e.target.value) })} />
          </Field>
        </div>
        <div className="grid grid-cols-3 gap-4 mt-4">
          <Field label="Stat label: disciplines">
            <input className={inputClass} value={data.intro.statsDisciplinesLabel} onChange={(e) => set("intro", { statsDisciplinesLabel: e.target.value })} />
          </Field>
          <Field label="Stat label: years">
            <input className={inputClass} value={data.intro.statsYearsLabel} onChange={(e) => set("intro", { statsYearsLabel: e.target.value })} />
          </Field>
          <Field label="Stat label: projects">
            <input className={inputClass} value={data.intro.statsProjectsLabel} onChange={(e) => set("intro", { statsProjectsLabel: e.target.value })} />
          </Field>
        </div>
      </ContentSection>

      <ContentSection id="section-selected-projects" icon={<FolderKanban size={16} />} title="Selected projects">
        <div className="grid md:grid-cols-3 gap-4">
          <Field label="Label">
            <input className={inputClass} value={data.projects.label} onChange={(e) => set("projects", { label: e.target.value })} />
          </Field>
          <Field label="Heading">
            <input className={inputClass} value={data.projects.heading} onChange={(e) => set("projects", { heading: e.target.value })} />
          </Field>
          <Field label="View all link">
            <input className={inputClass} value={data.projects.linkText} onChange={(e) => set("projects", { linkText: e.target.value })} />
          </Field>
        </div>
        <p className="text-xs text-fg-3 mb-4">
          编辑下方卡片文字与图片；保存后首页显示这些内容。也可在{" "}
          <a href="/admin/projects" className="text-sage hover:underline">Projects</a> 管理完整项目库。
        </p>
        <div className="space-y-4">
          {(data.projects.cards ?? []).map((card, i) => (
            <div key={i} className="p-4 bg-bg-3 rounded border border-border space-y-3">
              <p className="text-[11px] tracking-widest text-fg-3 uppercase">Card {i + 1}</p>
              <div className="grid md:grid-cols-2 gap-4">
                <Field label="Name">
                  <input
                    className={inputClass}
                    value={card.name}
                    onChange={(e) => {
                      const cards = [...(data.projects.cards ?? [])];
                      cards[i] = { ...cards[i], name: e.target.value };
                      set("projects", { cards });
                    }}
                  />
                </Field>
                <Field label="Category">
                  <select
                    className={inputClass}
                    value={card.category}
                    onChange={(e) => {
                      const cards = [...(data.projects.cards ?? [])];
                      cards[i] = { ...cards[i], category: e.target.value };
                      set("projects", { cards });
                    }}
                  >
                    {projectCategories.map((c) => (
                      <option key={c} value={c}>{categoryLabels[c]}</option>
                    ))}
                  </select>
                </Field>
              </div>
              <ImageUpload
                src={card.image}
                label="Cover image"
                width={200}
                height={120}
                onUpload={(url) => {
                  const cards = [...(data.projects.cards ?? [])];
                  cards[i] = { ...cards[i], image: url };
                  set("projects", { cards });
                }}
                onRemove={() => {
                  const cards = [...(data.projects.cards ?? [])];
                  cards[i] = { ...cards[i], image: "" };
                  set("projects", { cards });
                }}
                onError={onUploadError}
              />
            </div>
          ))}
        </div>
      </ContentSection>

      <ContentSection id="section-services-overview" icon={<Layers size={16} />} title="Services overview">
        <div className="grid md:grid-cols-2 gap-4">
          <Field label="Label">
            <input className={inputClass} value={data.capability.label} onChange={(e) => set("capability", { label: e.target.value })} />
          </Field>
          <Field label="Heading">
            <input className={inputClass} value={data.capability.heading} onChange={(e) => set("capability", { heading: e.target.value })} />
          </Field>
        </div>
        <Field label="Link text">
          <input className={inputClass} value={data.capability.linkText} onChange={(e) => set("capability", { linkText: e.target.value })} />
        </Field>
        <div className="grid md:grid-cols-2 gap-4">
          <Field label="Left column title">
            <input className={inputClass} value={data.capability.residentialTitle} onChange={(e) => set("capability", { residentialTitle: e.target.value })} />
          </Field>
          <Field label="Right column title">
            <input className={inputClass} value={data.capability.productTitle} onChange={(e) => set("capability", { productTitle: e.target.value })} />
          </Field>
          <Field label="Left description">
            <input className={inputClass} value={data.capability.residentialDesc} onChange={(e) => set("capability", { residentialDesc: e.target.value })} />
          </Field>
          <Field label="Right description">
            <input className={inputClass} value={data.capability.productDesc} onChange={(e) => set("capability", { productDesc: e.target.value })} />
          </Field>
        </div>
        <p className="text-xs text-fg-3 mt-4 mb-2">Residential service items</p>
        <div className="space-y-3">
          {data.capability.residentialItems.map((item, i) => (
            <div key={i} className="grid md:grid-cols-4 gap-2 p-3 bg-bg-3 rounded border border-border">
              <input className={inputClass} value={item.icon} placeholder="Icon" onChange={(e) => {
                const residentialItems = [...data.capability.residentialItems];
                residentialItems[i] = { ...residentialItems[i], icon: e.target.value };
                set("capability", { residentialItems });
              }} />
              <input className={inputClass} value={item.name} placeholder="Name" onChange={(e) => {
                const residentialItems = [...data.capability.residentialItems];
                residentialItems[i] = { ...residentialItems[i], name: e.target.value };
                set("capability", { residentialItems });
              }} />
              <input className={inputClass} value={item.desc} placeholder="Description" onChange={(e) => {
                const residentialItems = [...data.capability.residentialItems];
                residentialItems[i] = { ...residentialItems[i], desc: e.target.value };
                set("capability", { residentialItems });
              }} />
              <input className={inputClass} value={item.linkText} placeholder="Link text" onChange={(e) => {
                const residentialItems = [...data.capability.residentialItems];
                residentialItems[i] = { ...residentialItems[i], linkText: e.target.value };
                set("capability", { residentialItems });
              }} />
            </div>
          ))}
        </div>
        <p className="text-xs text-fg-3 mt-4 mb-2">Product service items</p>
        <div className="space-y-3">
          {data.capability.productItems.map((item, i) => (
            <div key={i} className="grid md:grid-cols-4 gap-2 p-3 bg-bg-3 rounded border border-border">
              <input className={inputClass} value={item.icon} placeholder="Icon" onChange={(e) => {
                const productItems = [...data.capability.productItems];
                productItems[i] = { ...productItems[i], icon: e.target.value };
                set("capability", { productItems });
              }} />
              <input className={inputClass} value={item.name} placeholder="Name" onChange={(e) => {
                const productItems = [...data.capability.productItems];
                productItems[i] = { ...productItems[i], name: e.target.value };
                set("capability", { productItems });
              }} />
              <input className={inputClass} value={item.desc} placeholder="Description" onChange={(e) => {
                const productItems = [...data.capability.productItems];
                productItems[i] = { ...productItems[i], desc: e.target.value };
                set("capability", { productItems });
              }} />
              <input className={inputClass} value={item.linkText} placeholder="Link text" onChange={(e) => {
                const productItems = [...data.capability.productItems];
                productItems[i] = { ...productItems[i], linkText: e.target.value };
                set("capability", { productItems });
              }} />
            </div>
          ))}
        </div>
      </ContentSection>

      <ContentSection id="section-featured-products" icon={<Package size={16} />} title="Featured products">
        <div className="grid md:grid-cols-3 gap-4">
          <Field label="Label">
            <input className={inputClass} value={data.products.label} onChange={(e) => set("products", { label: e.target.value })} />
          </Field>
          <Field label="Heading">
            <input className={inputClass} value={data.products.heading} onChange={(e) => set("products", { heading: e.target.value })} />
          </Field>
          <Field label="View all link">
            <input className={inputClass} value={data.products.linkText} onChange={(e) => set("products", { linkText: e.target.value })} />
          </Field>
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          <Field label="Add to cart button">
            <input className={inputClass} value={data.products.addToCartText ?? ""} onChange={(e) => set("products", { addToCartText: e.target.value })} />
          </Field>
          <Field label="Added button text">
            <input className={inputClass} value={data.products.addedText ?? ""} onChange={(e) => set("products", { addedText: e.target.value })} />
          </Field>
        </div>
        <p className="text-xs text-fg-3 mb-4">
          编辑下方商品卡片；保存后首页显示这些内容。也可在{" "}
          <a href="/admin/products" className="text-sage hover:underline">Shop</a> 管理完整商品库。
        </p>
        <div className="space-y-4">
          {(data.products.cards ?? []).map((card, i) => (
            <div key={i} className="p-4 bg-bg-3 rounded border border-border space-y-3">
              <p className="text-[11px] tracking-widest text-fg-3 uppercase">Product {i + 1}</p>
              <div className="grid md:grid-cols-3 gap-4">
                <Field label="Name">
                  <input
                    className={inputClass}
                    value={card.name}
                    onChange={(e) => {
                      const cards = [...(data.products.cards ?? [])];
                      cards[i] = { ...cards[i], name: e.target.value };
                      set("products", { cards });
                    }}
                  />
                </Field>
                <Field label="Category">
                  <select
                    className={inputClass}
                    value={card.category}
                    onChange={(e) => {
                      const cards = [...(data.products.cards ?? [])];
                      cards[i] = { ...cards[i], category: e.target.value };
                      set("products", { cards });
                    }}
                  >
                    {productCategories.map((c) => (
                      <option key={c} value={c}>{productCategoryLabels[c]}</option>
                    ))}
                  </select>
                </Field>
                <Field label="Price (USD)">
                  <input
                    type="number"
                    className={inputClass}
                    value={card.price}
                    onChange={(e) => {
                      const cards = [...(data.products.cards ?? [])];
                      cards[i] = { ...cards[i], price: Number(e.target.value) };
                      set("products", { cards });
                    }}
                  />
                </Field>
              </div>
              <ImageUpload
                src={card.image}
                label="Product image"
                width={200}
                height={120}
                onUpload={(url) => {
                  const cards = [...(data.products.cards ?? [])];
                  cards[i] = { ...cards[i], image: url };
                  set("products", { cards });
                }}
                onRemove={() => {
                  const cards = [...(data.products.cards ?? [])];
                  cards[i] = { ...cards[i], image: "" };
                  set("products", { cards });
                }}
                onError={onUploadError}
              />
            </div>
          ))}
        </div>
      </ContentSection>

      <ContentSection id="section-process" icon={<ListOrdered size={16} />} title="Process">
        <div className="grid md:grid-cols-2 gap-4">
          <Field label="Label">
            <input className={inputClass} value={data.process.label} onChange={(e) => set("process", { label: e.target.value })} />
          </Field>
          <Field label="Heading">
            <input className={inputClass} value={data.process.heading} onChange={(e) => set("process", { heading: e.target.value })} />
          </Field>
        </div>
        <Field label="Link text">
          <input className={inputClass} value={data.process.linkText} onChange={(e) => set("process", { linkText: e.target.value })} />
        </Field>
        <div className="space-y-3">
          {data.process.steps.map((step, i) => (
            <div key={step.num} className="grid md:grid-cols-3 gap-3 p-3 bg-bg-3 rounded border border-border">
              <input className={inputClass} value={step.num} readOnly />
              <input
                className={inputClass}
                value={step.title}
                onChange={(e) => {
                  const steps = [...data.process.steps];
                  steps[i] = { ...steps[i], title: e.target.value };
                  set("process", { steps });
                }}
              />
              <input
                className={inputClass}
                value={step.desc}
                onChange={(e) => {
                  const steps = [...data.process.steps];
                  steps[i] = { ...steps[i], desc: e.target.value };
                  set("process", { steps });
                }}
              />
            </div>
          ))}
        </div>
      </ContentSection>

      <ContentSection id="section-studio-preview" icon={<Building2 size={16} />} title="Studio preview">
        <ImageUpload
          src={images.studio_founder_image}
          width={140}
          height={180}
          onUpload={(url) => setImage("studio_founder_image", url)}
          onRemove={() => setImage("studio_founder_image", "")}
          onError={onUploadError}
        />
        <div className="grid md:grid-cols-2 gap-4 mt-4">
          <Field label="Label">
            <input className={inputClass} value={data.studio.label} onChange={(e) => set("studio", { label: e.target.value })} />
          </Field>
          <Field label="Heading">
            <input className={inputClass} value={data.studio.heading} onChange={(e) => set("studio", { heading: e.target.value })} />
          </Field>
          <Field label="Name">
            <input className={inputClass} value={data.studio.name} onChange={(e) => set("studio", { name: e.target.value })} />
          </Field>
          <Field label="Role">
            <input className={inputClass} value={data.studio.role} onChange={(e) => set("studio", { role: e.target.value })} />
          </Field>
        </div>
        <Field label="Bio paragraph 1">
          <textarea className={textareaClass} value={data.studio.bio1} onChange={(e) => set("studio", { bio1: e.target.value })} />
        </Field>
        <Field label="Bio paragraph 2">
          <textarea className={textareaClass} value={data.studio.bio2} onChange={(e) => set("studio", { bio2: e.target.value })} />
        </Field>
        <Field label="Principles (one per line)">
          <textarea
            className={textareaClass}
            rows={4}
            value={data.studio.principles.join("\n")}
            onChange={(e) => set("studio", { principles: e.target.value.split("\n").filter(Boolean) })}
          />
        </Field>
        <Field label="Link text">
          <input className={inputClass} value={data.studio.linkText} onChange={(e) => set("studio", { linkText: e.target.value })} />
        </Field>
      </ContentSection>

      <ContentSection id="section-contact" icon={<Mail size={16} />} title="Contact">
        <Field label="Label">
          <input className={inputClass} value={data.contact.label} onChange={(e) => set("contact", { label: e.target.value })} />
        </Field>
        <Field label="Heading">
          <input className={inputClass} value={data.contact.heading} onChange={(e) => set("contact", { heading: e.target.value })} />
        </Field>
        <Field label="Description">
          <textarea className={textareaClass} value={data.contact.description} onChange={(e) => set("contact", { description: e.target.value })} />
        </Field>
        <Field label="Link text">
          <input className={inputClass} value={data.contact.linkText} onChange={(e) => set("contact", { linkText: e.target.value })} />
        </Field>
        <div className="mt-4 pt-4 border-t border-border space-y-2">
          <p className="text-[11px] tracking-widest text-fg-3 uppercase">Contact details (from Contact page)</p>
          <div className="grid md:grid-cols-2 gap-3 text-sm text-fg-2">
            <div><span className="text-fg-3">Email</span><br />{contactChannels.email}</div>
            <div><span className="text-fg-3">Phone</span><br />{contactChannels.phone}</div>
            <div><span className="text-fg-3">WeChat</span><br />{contactChannels.wechat}</div>
            <div><span className="text-fg-3">Location</span><br />{contactChannels.address}</div>
          </div>
          <p className="text-xs text-fg-3">
            邮箱、电话等联系信息请在{" "}
            <a href="/admin/contact-page" className="text-sage hover:underline">Contact 页面</a> 编辑，首页会自动同步。
          </p>
        </div>
      </ContentSection>
    </div>
  );
}
