"use client";

import { useEffect, useRef, useState } from "react";

export default function CounterAnimation({
  target,
  suffix = "",
  label,
}: {
  target: number;
  suffix?: string;
  label: string;
}) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || started.current) return;
        started.current = true;
        let c = 0;
        const step = Math.ceil(target / 40);
        const iv = setInterval(() => {
          c += step;
          if (c >= target) {
            c = target;
            clearInterval(iv);
          }
          setCount(c);
        }, 35);
      },
      { threshold: 0.2, rootMargin: "0px 0px -40px 0px" }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [target]);

  return (
    <div ref={ref}>
      <div className="stat-n">
        {count}
        {suffix}
      </div>
      <div className="stat-l">{label}</div>
    </div>
  );
}
