"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import CmsImage from "@/components/ui/CmsImage";
import RevealOnScroll from "@/components/ui/RevealOnScroll";
import type { StudioContent } from "@/lib/page-content";

export default function StudioPageClient({
  content,
  heroImage,
  originImage,
}: {
  content: StudioContent;
  heroImage?: string;
  originImage?: string;
}) {
  const milestones = content.milestones.items;
  const heroBgRef = useRef<HTMLDivElement>(null);
  const originImgRef = useRef<HTMLDivElement>(null);
  const msRef = useRef<HTMLDivElement>(null);
  const msProgressRef = useRef<HTMLDivElement>(null);
  const [maniVis, setManiVis] = useState(0);
  const [msLit, setMsLit] = useState(0);
  const [netStats, setNetStats] = useState({ f: 0, c: 0, co: 0, q: 0 });
  const [dotsVis, setDotsVis] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      if (heroBgRef.current && window.scrollY < window.innerHeight) {
        heroBgRef.current.style.transform = `translateY(${window.scrollY * 0.35}px) scale(1.1)`;
      }
      const origin = originImgRef.current;
      if (origin) {
        const rect = origin.getBoundingClientRect();
        if (rect.top < window.innerHeight && rect.bottom > 0) {
          const pct = (window.innerHeight - rect.top) / (window.innerHeight + rect.height);
          origin.style.transform = `translateY(${(pct - 0.5) * -30}px)`;
        }
      }
    };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const maniEl = document.getElementById("maniSection");
    if (!maniEl) return;
    const obs = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        for (let i = 0; i < content.manifesto.length; i++) setTimeout(() => setManiVis(i + 1), i * 220);
        obs.disconnect();
      },
      { threshold: 0.3 }
    );
    obs.observe(maniEl);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    const el = msRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        milestones.forEach((_, i) => setTimeout(() => setMsLit(i + 1), i * 400));
        if (msProgressRef.current) {
          setTimeout(() => {
            msProgressRef.current!.style.width = "calc(100% - 120px)";
          }, 200);
        }
        obs.disconnect();
      },
      { threshold: 0.25 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    const el = document.querySelector(".net-stats");
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        const targets = content.network.stats.map((s, idx) => ({
          key: (["f", "c", "co", "q"] as const)[idx] ?? "f",
          t: s.num,
        }));
        targets.forEach(({ key, t }) => {
          let c = 0;
          const step = Math.max(1, Math.ceil(t / 45));
          const iv = setInterval(() => {
            c += step;
            if (c >= t) {
              c = t;
              clearInterval(iv);
            }
            setNetStats((s) => ({ ...s, [key]: c }));
          }, 30);
        });
        obs.disconnect();
      },
      { threshold: 0.4 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    const el = document.querySelector(".net-map");
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        [0, 1, 2, 3, 4].forEach((i) => setTimeout(() => setDotsVis(i + 1), i * 200));
        obs.disconnect();
      },
      { threshold: 0.3 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <>
      <section className="hero" id="studioHero">
        <div
          className={`hero-bg${heroImage ? " has-image" : ""}`}
          ref={heroBgRef}
          style={heroImage ? { background: `url(${heroImage}) center/cover no-repeat` } : undefined}
        />
        <div className="hero-grain" />
        <div className="hero-vignette" />
        <div className="hero-lines">
          {["12%", "28%", "44%", "60%", "76%", "92%"].map((left) => (
            <span key={left} style={{ left }} />
          ))}
        </div>
        <div className="hero-content">
          <div className="hero-mark">{content.hero.mark}</div>
          <h1 className="hero-title">{content.hero.title}</h1>
          <p className="hero-sub">{content.hero.subtitle}</p>
        </div>
        <div className="hero-scroll">
          <div className="scr-line" />
          <span className="scr-t">Scroll</span>
        </div>
      </section>

      <section className="manifesto" id="maniSection">
        {content.manifesto.map((line, i) => (
          <span key={i} className={`mani-line${i < maniVis ? " vis" : ""}`}>
            {line.italic ? <em>{line.text}</em> : line.text}
          </span>
        ))}
      </section>

      <section className="origin">
        <div className="origin-grid">
          <RevealOnScroll className="origin-img">
            <div className={`origin-img-inner${originImage ? " has-image" : ""}`} ref={originImgRef}>
              <CmsImage src={originImage} alt="Founder portrait" placeholder="Founder portrait" />
            </div>
          </RevealOnScroll>
          <RevealOnScroll delay={0.12} className="origin-text">
            <div className="origin-label">{content.origin.label}</div>
            <h2 className="origin-h">{content.origin.heading}</h2>
            {content.origin.paragraphs.map((p, i) => (
              <p key={i} className="origin-p">{p}</p>
            ))}
            <p className="origin-sig">{content.origin.signature}</p>
          </RevealOnScroll>
        </div>
      </section>

      <section className="philo">
        <RevealOnScroll>
          <div className="sl">{content.philo.label}</div>
          <h2 style={{ fontFamily: "var(--fd)", fontSize: "clamp(28px,3vw,40px)", fontWeight: 300, lineHeight: 1.35 }}>
            {content.philo.heading}
          </h2>
        </RevealOnScroll>
        <div className="philo-grid">
          {content.philo.cards.map((card, i) => (
            <RevealOnScroll key={card.num} delay={(i + 1) * 0.12}>
              <div className="philo-card">
                <div className="philo-num">{card.num}</div>
                <h3 className="philo-title">{card.title}</h3>
                <p className="philo-desc">{card.desc}</p>
                <div className="philo-accent" />
              </div>
            </RevealOnScroll>
          ))}
        </div>
      </section>

      <section className="capabilities">
        <RevealOnScroll>
          <div className="sl">{content.capabilities.label}</div>
          <h2 style={{ fontFamily: "var(--fd)", fontSize: "clamp(28px,3vw,40px)", fontWeight: 300, lineHeight: 1.35 }}>
            {content.capabilities.heading}
          </h2>
        </RevealOnScroll>
        <div className="cap-grid">
          {content.capabilities.cards.map((card, i) => (
            <RevealOnScroll key={card.name} delay={(i + 1) * 0.12}>
              <div className="cap-card">
                <div className="cap-icon">{card.icon}</div>
                <div className="cap-name">{card.name}</div>
                <div className="cap-desc">{card.desc}</div>
                <div className="cap-tools">
                  {card.tags.map((t) => (
                    <span key={t} className="cap-tag">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </RevealOnScroll>
          ))}
        </div>
      </section>

      <section className="network" id="netSection">
        <div className="net-inner">
          <RevealOnScroll>
            <div className="sl">{content.network.label}</div>
            <h2 style={{ fontFamily: "var(--fd)", fontSize: "clamp(28px,3vw,40px)", fontWeight: 300, lineHeight: 1.35 }}>
              {content.network.heading}
            </h2>
          </RevealOnScroll>
          <div className="net-grid">
            <div className="net-stats rv vis">
              {content.network.stats.map((stat, idx) => {
                const keys = ["f", "c", "co", "q"] as const;
                const val = netStats[keys[idx] ?? "f"];
                return (
                  <div key={stat.label} className="net-stat">
                    <div className="net-stat-n">
                      {val}
                      {stat.suffix}
                    </div>
                    <div className="net-stat-l">{stat.label}</div>
                  </div>
                );
              })}
            </div>
            <RevealOnScroll delay={0.24} className="net-map">
              <div className="net-map-title">Production regions</div>
              {content.network.regions.map((region, i) => (
                <div key={region.name} className="net-region">
                  <div className={`net-dot${i < dotsVis ? " vis" : ""}`} />
                  <div className="net-region-name">{region.name}</div>
                  <div className="net-region-cat">{region.categories}</div>
                </div>
              ))}
            </RevealOnScroll>
          </div>
        </div>
      </section>

      <section className="milestones" id="msSection">
        <RevealOnScroll>
          <div className="sl">{content.milestones.label}</div>
          <h2 style={{ fontFamily: "var(--fd)", fontSize: "clamp(28px,3vw,40px)", fontWeight: 300, lineHeight: 1.35 }}>
            {content.milestones.heading}
          </h2>
        </RevealOnScroll>
        <div className="ms-track" ref={msRef}>
          <div className="ms-line" />
          <div className="ms-progress" ref={msProgressRef} />
          <div className="ms-items">
            {milestones.map((m, i) => (
              <div key={m.year} className="ms-item">
                <div className={`ms-dot${i < msLit ? " lit" : ""}`} />
                <div className={`ms-year${i < msLit ? " lit" : ""}`}>{m.year}</div>
                <div className={`ms-label${i < msLit ? " lit" : ""}`} style={{ whiteSpace: "pre-line" }}>
                  {m.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="cta-band">
        <div className="cta-glow" />
        <RevealOnScroll>
          <h2 className="cta-text" style={{ whiteSpace: "pre-line" }}>
            {content.cta.heading}
          </h2>
          <Link href={content.cta.buttonLink} className="cta-btn">
            {content.cta.buttonText}
          </Link>
        </RevealOnScroll>
      </section>
    </>
  );
}
