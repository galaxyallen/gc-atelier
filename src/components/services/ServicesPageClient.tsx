"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import RevealOnScroll from "@/components/ui/RevealOnScroll";
import CmsImage from "@/components/ui/CmsImage";
import { resolveSiteImage } from "@/lib/site-images";
import type { ServicesContent } from "@/lib/page-content";

export default function ServicesPageClient({
  pageImages,
  projectImages,
  content,
}: {
  pageImages: Record<string, string>;
  projectImages: Record<string, string>;
  content: ServicesContent;
}) {
  const featImageFor = (svcId: string, featName: string) => {
    const key = `services_feat_${svcId.replace(/^svc/, "").toLowerCase()}`;
    const override = resolveSiteImage(pageImages, key);
    if (override) return override;
    return projectImages[featName.toLowerCase()] || "";
  };

  const d2pImages = ["01", "02", "03", "04", "05"].map((n) =>
    resolveSiteImage(pageImages, `services_d2p_${n}`)
  );
  const [activePanel, setActivePanel] = useState<string | null>(null);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const heroLRef = useRef<HTMLDivElement>(null);
  const heroRRef = useRef<HTMLDivElement>(null);
  const d2pTrackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => {
      if (window.scrollY < window.innerHeight) {
        if (heroLRef.current) heroLRef.current.style.transform = `translateY(${window.scrollY * 0.25}px) scale(1.08)`;
        if (heroRRef.current) heroRRef.current.style.transform = `translateY(${window.scrollY * 0.35}px) scale(1.08)`;
      }
    };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const togglePanel = (id: string) => {
    setActivePanel((prev) => (prev === id ? null : id));
  };

  return (
    <>
      <section className="hero-split">
        <div className="hero-half">
          <div className="hero-half-bg" ref={heroLRef}>
            <span>Spatial design image</span>
          </div>
        </div>
        <div className="hero-divider" />
        <div className="hero-half">
          <div className="hero-half-bg" ref={heroRRef}>
            <span>Product design image</span>
          </div>
        </div>
        <div className="hero-center">
          <h1 className="hero-center-title" style={{ whiteSpace: "pre-line" }}>
            {content.hero.title}
          </h1>
          <p className="hero-center-sub">{content.hero.subtitle}</p>
        </div>
        <span className="hero-label-l">{content.hero.labelLeft}</span>
        <span className="hero-label-r">{content.hero.labelRight}</span>
        <div className="hero-scroll">
          <div className="scr-line" />
          <span className="scr-t">Scroll</span>
        </div>
      </section>

      <section className="panels-section">
        <RevealOnScroll>
          <div className="sl">{content.panels.label}</div>
          <h2 className="sh">{content.panels.heading}</h2>
        </RevealOnScroll>
        <div className="panels-wrap">
          <div
            className={`panel${activePanel === "A" ? " expanded" : activePanel === "B" ? " collapsed" : ""}`}
            onClick={() => togglePanel("A")}
            role="button"
            tabIndex={0}
          >
            <div className="panel-bg">
              <span>Spatial design background</span>
            </div>
            <div className="panel-header">
              <div className="panel-title">{content.panels.left.title}</div>
              <div className="panel-subtitle">{content.panels.left.subtitle}</div>
            </div>
            <div className="panel-services">
              {content.panels.left.services.map((svc) => (
                <div key={svc.name} className="panel-svc">
                  <div className="panel-svc-name">{svc.name}</div>
                  <div className="panel-svc-desc">{svc.desc}</div>
                </div>
              ))}
            </div>
          </div>
          <div
            className={`panel${activePanel === "B" ? " expanded" : activePanel === "A" ? " collapsed" : ""}`}
            onClick={() => togglePanel("B")}
            role="button"
            tabIndex={0}
          >
            <div className="panel-bg">
              <span>Product design background</span>
            </div>
            <div className="panel-header">
              <div className="panel-title">{content.panels.right.title}</div>
              <div className="panel-subtitle">{content.panels.right.subtitle}</div>
            </div>
            <div className="panel-services">
              {content.panels.right.services.map((svc) => (
                <div key={svc.name} className="panel-svc">
                  <div className="panel-svc-name">{svc.name}</div>
                  <div className="panel-svc-desc">{svc.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {content.modules.map((svc, mi) => {
        const alt = mi % 2 === 1;
        return (
        <section key={svc.id} className={`svc-module${alt ? " alt" : ""}`} id={svc.id}>
          <div className="svc-hero">
            {!alt && (
              <div className="svc-hero-img rv vis">
                <span>{svc.title} project image</span>
              </div>
            )}
            <div className="svc-hero-text rv vis">
              <div className="svc-icon">{svc.icon}</div>
              <h3 className="svc-title">{svc.title}</h3>
              <p className="svc-oneliner">{svc.oneliner}</p>
            </div>
            {alt && (
              <div className="svc-hero-img rv vis">
                <span>{svc.title} project image</span>
              </div>
            )}
          </div>
          <div className="scope-strip">
            {svc.scopes.map((scope, i) => (
              <div key={scope} className={`scope-card rv${i ? ` rv-d${Math.min(i, 3)}` : ""} vis`}>
                <div className="scope-icon">◎</div>
                <div className="scope-name">{scope}</div>
              </div>
            ))}
          </div>
          <div className="svc-bottom">
            <div className="svc-feat rv vis">
              <div className={`svc-feat-img${featImageFor(svc.id, svc.feat) ? " has-image" : ""}`}>
                <CmsImage
                  src={featImageFor(svc.id, svc.feat)}
                  alt={svc.feat}
                  placeholder="Featured project"
                />
              </div>
              <div className="svc-feat-info">
                <span className="svc-feat-name">{svc.feat}</span>
                <Link href="/#sec-projects" className="svc-feat-link">
                  View case study →
                </Link>
              </div>
            </div>
            <MiniProc steps={svc.steps} />
          </div>
        </section>
        );
      })}

      <section className="d2p" id="d2pSection">
        <div className="d2p-header rv vis">
          <div className="sl">What makes us different</div>
          <h2 className="sh">{content.d2p.heading}</h2>
        </div>
        <div className="d2p-track-wrap">
          <div className="d2p-track" ref={d2pTrackRef}>
            {content.d2p.stages.map((stage, i) => (
              <div key={stage.num} className="d2p-stage">
                <div className={`d2p-stage-img${d2pImages[i] ? " has-image" : ""}`}>
                  <CmsImage src={d2pImages[i]} alt={stage.name} placeholder={stage.name} />
                </div>
                <div className="d2p-stage-body">
                  <div className="d2p-stage-num">{stage.num}</div>
                  <div className="d2p-stage-name">{stage.name}</div>
                  <div className="d2p-stage-desc">{stage.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <p className="d2p-hint">← Scroll to explore the journey →</p>
      </section>

      <section className="engage">
        <RevealOnScroll>
          <div className="sl">{content.engagement.label}</div>
          <h2 className="sh">{content.engagement.heading}</h2>
        </RevealOnScroll>
        <div className="engage-grid">
          {content.engagement.cards.map((card, i) => (
            <RevealOnScroll key={card.name} delay={(i + 1) * 0.1}>
              <div className={`engage-card${i === 0 ? " featured" : ""}`}>
                {i === 0 && <div className="engage-badge">Most popular</div>}
                <div className="engage-icon">{card.icon}</div>
                <div className="engage-name">{card.name}</div>
                <div className="engage-desc">{card.desc}</div>
                <ul className="engage-includes">
                  {card.included.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
                <Link href="/#sec-contact" className="engage-cta">
                  {card.cta}
                </Link>
              </div>
            </RevealOnScroll>
          ))}
        </div>
      </section>

      <section className="faq">
        <RevealOnScroll>
          <div className="sl">Common questions</div>
          <h2 className="sh">Before we start.</h2>
        </RevealOnScroll>
        <div style={{ marginTop: 48 }}>
          {content.faq.map((faq, i) => (
            <div key={faq.question} className={`faq-item${openFaq === i ? " open" : ""}`}>
              <button type="button" className="faq-q" onClick={() => setOpenFaq(openFaq === i ? null : i)}>
                {faq.question}
                <span className="faq-icon" />
              </button>
              <div
                className="faq-a"
                style={{ maxHeight: openFaq === i ? 200 : 0 }}
              >
                <div className="faq-a-inner">{faq.answer}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="cta-band">
        <div className="cta-glow" />
        <RevealOnScroll>
          <h2 className="cta-text" style={{ whiteSpace: "pre-line" }}>
            {content.cta.heading}
          </h2>
          <div className="cta-btns">
            <Link href={content.cta.button2Link} className="cta-primary">
              {content.cta.button2Text}
            </Link>
            <Link href={content.cta.button1Link} className="cta-secondary">
              {content.cta.button1Text}
            </Link>
          </div>
        </RevealOnScroll>
      </section>
    </>
  );
}

function MiniProc({ steps }: { steps: string[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);
  const [lit, setLit] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        steps.forEach((_, i) => setTimeout(() => setLit(i + 1), i * 300));
        if (lineRef.current) {
          setTimeout(() => {
            lineRef.current!.style.height = "calc(100% - 16px)";
          }, 150);
        }
        obs.disconnect();
      },
      { threshold: 0.4 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [steps]);

  return (
    <div className="mini-proc rv vis" ref={ref}>
      <div className="mini-proc-line" ref={lineRef} />
      {steps.map((text, i) => (
        <div key={text} className="mp-step">
          <div className={`mp-dot${i < lit ? " lit" : ""}`} />
          <div className={`mp-num${i < lit ? " lit" : ""}`}>{String(i + 1).padStart(2, "0")}</div>
          <div className="mp-text">{text}</div>
        </div>
      ))}
    </div>
  );
}
