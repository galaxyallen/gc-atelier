"use client";

import type { ContactContent, HomeContactContent } from "@/lib/page-content";
import Link from "next/link";
import { useState } from "react";
import RevealOnScroll from "@/components/ui/RevealOnScroll";

export type ContactInfo = {
  email: string;
  phone: string;
  wechat: string;
  address: string;
};

export default function ContactSection({
  content,
  contact,
  formConfig,
}: {
  content: HomeContactContent;
  contact: ContactInfo;
  formConfig: ContactContent["form"];
}) {
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
          projectType: data.get("projectType"),
          message: data.get("message"),
        }),
      });
      setSent(true);
      form.reset();
    } catch {
      alert("Failed to send inquiry. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="contact" id="sec-contact">
      <div className="contact-inner">
        <RevealOnScroll>
          <div className="sl">{content.label}</div>
          <h2 className="c-heading">{content.heading}</h2>
          <p className="c-desc">{content.description}</p>
          <div>
            <div className="ch">
              <span className="ch-l">Email</span>
              <span className="ch-v">{contact.email}</span>
            </div>
            <div className="ch">
              <span className="ch-l">Phone</span>
              <span className="ch-v">{contact.phone}</span>
            </div>
            <div className="ch">
              <span className="ch-l">WeChat</span>
              <span className="ch-v">{contact.wechat}</span>
            </div>
            <div className="ch">
              <span className="ch-l">Location</span>
              <span className="ch-v">{contact.address}</span>
            </div>
          </div>
          <Link href="/contact" className="cap-il" style={{ marginTop: 20 }}>
            {content.linkText}
          </Link>
        </RevealOnScroll>

        <RevealOnScroll delay={0.12}>
          {sent ? (
            <div className="form-success" style={{ display: "block", padding: "60px 0" }}>
              <div className="fs-icon">✓</div>
              <div className="fs-title">{formConfig.successTitle}</div>
              <div className="fs-desc">{formConfig.successDesc}</div>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="fr">
                <div className="fg">
                  <label className="fl">{formConfig.nameLabel}</label>
                  <input
                    type="text"
                    name="name"
                    className="fi"
                    placeholder={formConfig.namePlaceholder}
                    required
                  />
                </div>
                <div className="fg">
                  <label className="fl">{formConfig.companyLabel}</label>
                  <input
                    type="text"
                    name="company"
                    className="fi"
                    placeholder={formConfig.companyPlaceholder}
                  />
                </div>
              </div>
              <div className="fg">
                <label className="fl">{formConfig.emailLabel}</label>
                <input
                  type="email"
                  name="email"
                  className="fi"
                  placeholder={formConfig.emailPlaceholder}
                  required
                />
              </div>
              <div className="fg">
                <label className="fl">{formConfig.projectTypeLabel}</label>
                <select name="projectType" className="fs" defaultValue="">
                  <option value="" disabled>
                    {formConfig.projectTypePlaceholder}
                  </option>
                  {formConfig.projectTypes.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              </div>
              <div className="fg">
                <label className="fl">{formConfig.messageLabel}</label>
                <textarea
                  name="message"
                  className="ft"
                  placeholder={formConfig.messagePlaceholder}
                  required
                />
              </div>
              <button type="submit" className="f-btn" disabled={loading}>
                {loading ? formConfig.sendingText : formConfig.submitText}
              </button>
            </form>
          )}
        </RevealOnScroll>
      </div>
    </section>
  );
}
