"use client";

import type { HomeContent } from "@/lib/page-content";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import ParticleCanvas from "@/components/ui/ParticleCanvas";
import RevealOnScroll from "@/components/ui/RevealOnScroll";

export default function ProcessTimeline({ content }: { content: HomeContent["process"] }) {
  const steps = content.steps;
  const ref = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);
  const [lit, setLit] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        steps.forEach((_, i) => {
          setTimeout(() => setLit(i + 1), i * 350);
        });
        if (lineRef.current) {
          setTimeout(() => {
            lineRef.current!.style.width = "84%";
          }, 200);
        }
        obs.disconnect();
      },
      { threshold: 0.3 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [steps]);

  return (
    <section className="process" id="sec-process" style={{ position: "relative", overflow: "hidden" }}>
      <ParticleCanvas count={50} opacity={0.12} maxDist={120} />
      <div className="proc-inner">
        <RevealOnScroll>
          <div className="sl">{content.label}</div>
          <h2 className="sh">{content.heading}</h2>
          <Link href="/services" className="cap-il" style={{ marginTop: 16, color: "var(--sage)" }}>
            {content.linkText}
          </Link>
        </RevealOnScroll>
        <div className="proc-steps" ref={ref}>
          <div className="proc-line" ref={lineRef} />
          {steps.map((step, i) => (
            <div key={step.num} className={`step${i < lit ? " lit" : ""}`}>
              <div className="step-dot" />
              <div>
                <p className="step-num">{step.num}</p>
                <p className="step-t">{step.title}</p>
                <p className="step-d">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
