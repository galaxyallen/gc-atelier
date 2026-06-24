"use client";

import { useEffect, useMemo, useRef, useState } from "react";

import type { HomeHeroContent } from "@/lib/page-content";

export default function HeroVideo({
  poster = "/video/hero-poster.jpg",
  videoSrc = "/video/hero-video.mp4",
  hero,
}: {
  poster?: string;
  videoSrc?: string;
  hero: HomeHeroContent;
}) {
  const phrases = useMemo(
    () => [hero.line1, `to <em>${hero.line2}</em>`],
    [hero.line1, hero.line2]
  );
  const videoRef = useRef<HTMLVideoElement>(null);
  const tagRef = useRef<HTMLHeadingElement>(null);
  const [subOn, setSubOn] = useState(false);
  const [ctaOn, setCtaOn] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (video) video.play().catch(() => {});

    const handler = () => {
      if (!videoRef.current || window.scrollY > window.innerHeight) return;
      const v = videoRef.current;
      v.style.transform = `scale(${1 + window.scrollY * 0.0003}) translateY(${window.scrollY * 0.25}px)`;
      v.style.opacity = `${Math.max(0, 1 - window.scrollY / (window.innerHeight * 0.9))}`;
    };
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  useEffect(() => {
    const tagEl = tagRef.current;
    if (!tagEl) return;

    let pi = 0;
    let ci = 0;
    let typing = true;
    let timer: ReturnType<typeof setTimeout>;

    function type() {
      if (!tagEl) return;
      if (pi >= phrases.length) {
        tagEl.innerHTML = phrases.join("<br>");
        setSubOn(true);
        setTimeout(() => setCtaOn(true), 400);
        return;
      }
      const full = phrases[pi];
      const plain = full.replace(/<[^>]+>/g, "");
      if (typing) {
        ci++;
        let out = "";
        let rc = 0;
        for (let k = 0; k < full.length && rc < ci; k++) {
          if (full[k] === "<") {
            const end = full.indexOf(">", k);
            out += full.slice(k, end + 1);
            k = end;
            continue;
          }
          out += full[k];
          rc++;
        }
        const prefix = pi > 0 ? `${phrases.slice(0, pi).join("<br>")}<br>` : "";
        tagEl.innerHTML = `${prefix}${out}<span class="cursor"></span>`;
        if (ci >= plain.length) {
          typing = false;
          timer = setTimeout(() => {
            pi++;
            ci = 0;
            typing = true;
            type();
          }, 200);
          return;
        }
        timer = setTimeout(type, 50 + Math.random() * 30);
      }
    }

    timer = setTimeout(type, 800);
    return () => clearTimeout(timer);
  }, [phrases]);

  return (
    <section className="hero">
      <video
        ref={videoRef}
        className="hero-video"
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        poster={poster}
      >
        <source src={videoSrc} type="video/mp4" />
      </video>
      <div className="hero-grad" />
      <div className="hero-content">
        <h1 className="hero-tag" ref={tagRef} />
        <p className={`hero-sub${subOn ? " on" : ""}`}>{hero.subtitle}</p>
        <a href="#sec-projects" className={`hero-cta${ctaOn ? " on" : ""}`}>
          {hero.cta}
        </a>
      </div>
      <div className="hero-scroll">
        <div className="scroll-line" />
        <span className="scroll-t">Scroll</span>
      </div>
    </section>
  );
}
