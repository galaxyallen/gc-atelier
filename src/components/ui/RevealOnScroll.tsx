"use client";

import { useEffect, useRef } from "react";

const delayClass = (delay: number) => {
  if (delay >= 0.48) return "rv-d4";
  if (delay >= 0.36) return "rv-d3";
  if (delay >= 0.24) return "rv-d2";
  if (delay >= 0.12) return "rv-d1";
  return "";
};

/** Attach prototype .rv / .vis scroll reveal directly to an element ref */
export function useReveal<T extends HTMLElement>(delay = 0) {
  const ref = useRef<T>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const dc = delayClass(delay);
    el.classList.add("rv", ...(dc ? [dc] : []));
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("vis");
            obs.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -30px 0px" }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [delay]);

  return ref;
}

export default function RevealOnScroll({
  children,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  const ref = useReveal<HTMLDivElement>(delay);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
