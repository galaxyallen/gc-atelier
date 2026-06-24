"use client";

import { useState } from "react";
import Link from "next/link";
import RevealOnScroll from "@/components/ui/RevealOnScroll";
import CmsImage from "@/components/ui/CmsImage";
import type { ContactContent } from "@/lib/page-content";

export default function ContactPageClient({
  content,
  mapImage,
}: {
  content: ContactContent;
  mapImage?: string;
}) {
  const [budget, setBudget] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const form = e.currentTarget;
    const data = new FormData(form);
    try {
      await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.get("name"),
          company: data.get("company"),
          email: data.get("email"),
          phone: data.get("phone"),
          projectType: data.get("projectType"),
          budget,
          message: data.get("message"),
        }),
      });
      setSent(true);
    } catch {
      alert("Failed to send. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <section className="contact-hero">
        <h1 className="ch-title" style={{ whiteSpace: "pre-line" }}>
          {content.hero.title}
        </h1>
        <p className="ch-sub">{content.hero.subtitle}</p>
      </section>

      <section className="contact-grid">
        <div className="contact-left">
          <RevealOnScroll>
            <p className="contact-intro">{content.channels.intro}</p>
            <div className="channel-group">
              <div className="channel-group-title">Direct channels</div>
              {[
                ["✉", "Email", content.channels.email],
                ["◎", "WhatsApp", content.channels.whatsapp],
                ["◇", "WeChat", content.channels.wechat],
                ["◉", "Phone", content.channels.phone],
              ].map(([icon, label, value]) => (
                <div key={label} className="channel">
                  <div className="ch-icon">{icon}</div>
                  <div>
                    <div className="ch-label">{label}</div>
                    <div className="ch-value">{value}</div>
                  </div>
                </div>
              ))}
            </div>
            <div className="channel-group">
              <div className="channel-group-title">Studio address</div>
              <div className="channel">
                <div className="ch-icon">▣</div>
                <div>
                  <div className="ch-label">Location</div>
                  <div className="ch-value" style={{ whiteSpace: "pre-line" }}>
                    {content.channels.address}
                  </div>
                </div>
              </div>
            </div>
          </RevealOnScroll>
          <RevealOnScroll delay={0.12}>
            <div className={`map-box${mapImage ? " has-image" : ""}`}>
              <CmsImage src={mapImage} alt="Studio location" placeholder="Guangzhou — map" />
              <div className="map-dot" />
              <div className="map-ring" />
            </div>
          </RevealOnScroll>
        </div>

        <RevealOnScroll delay={0.12} className="contact-form">
          {sent ? (
            <div className="form-success" style={{ display: "block" }}>
              <div className="fs-icon">✓</div>
              <div className="fs-title">{content.form.successTitle}</div>
              <div className="fs-desc">{content.form.successDesc}
                <br />
                In the meantime, explore our{" "}
                <Link href="/#sec-projects" style={{ color: "var(--sage)", borderBottom: "1px solid var(--sage-b)" }}>
                  projects
                </Link>
                .
              </div>
            </div>
          ) : (
            <>
              <div className="form-title">{content.form.title}</div>
              <form onSubmit={handleSubmit}>
                <div className="fr">
                  <div className="fg">
                    <label className="fl">{content.form.nameLabel} *</label>
                    <input type="text" name="name" className="fi" placeholder={content.form.namePlaceholder} required />
                  </div>
                  <div className="fg">
                    <label className="fl">{content.form.companyLabel}</label>
                    <input type="text" name="company" className="fi" placeholder={content.form.companyPlaceholder} />
                  </div>
                </div>
                <div className="fr">
                  <div className="fg">
                    <label className="fl">{content.form.emailLabel} *</label>
                    <input type="email" name="email" className="fi" placeholder={content.form.emailPlaceholder} required />
                  </div>
                  <div className="fg">
                    <label className="fl">Phone</label>
                    <input type="tel" name="phone" className="fi" placeholder="+xx xxx xxxx xxxx" />
                  </div>
                </div>
                <div className="fg">
                  <label className="fl">{content.form.projectTypeLabel}</label>
                  <select name="projectType" className="fs" defaultValue="">
                    <option value="" disabled>
                      {content.form.projectTypePlaceholder}
                    </option>
                    {content.form.projectTypes.map((opt) => (
                      <option key={opt}>{opt}</option>
                    ))}
                  </select>
                </div>
                <div className="fg">
                  <label className="fl">Budget range</label>
                  <div className="f-budget">
                    {content.form.budgets.map((b) => (
                      <button
                        key={b}
                        type="button"
                        className={`budget-btn${budget === b ? " active" : ""}`}
                        onClick={() => setBudget(b)}
                      >
                        {b}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="fg">
                  <label className="fl">{content.form.messageLabel} *</label>
                  <textarea
                    name="message"
                    className="ft"
                    placeholder={content.form.messagePlaceholder}
                    required
                  />
                </div>
                <button type="submit" className="f-submit" disabled={loading}>
                  {loading ? content.form.sendingText : content.form.submitText}
                </button>
              </form>
            </>
          )}
        </RevealOnScroll>
      </section>

      <section className="hours-section">
        <RevealOnScroll>
          <div className="sl">{content.availability.label}</div>
          <h2 style={{ fontFamily: "var(--fd)", fontSize: "clamp(28px,3vw,40px)", fontWeight: 300 }}>
            {content.availability.heading}
          </h2>
        </RevealOnScroll>
        <div className="hours-grid">
          {content.availability.cards.map((card, i) => (
            <RevealOnScroll key={card.title} delay={(i + 1) * 0.12}>
              <div className="hours-card">
                <div className="hours-icon">{card.icon}</div>
                <div className="hours-title">{card.title}</div>
                <div className="hours-detail" style={{ whiteSpace: "pre-line" }}>
                  {card.detail}
                </div>
                <div className="hours-note">{card.note}</div>
              </div>
            </RevealOnScroll>
          ))}
        </div>
      </section>
    </>
  );
}
