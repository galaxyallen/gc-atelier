"use client";

import { useRef, useEffect } from "react";

interface Props {
  count?: number;
  color?: string;
  opacity?: number;
  maxDist?: number;
  className?: string;
}

export default function ParticleCanvas({
  count = 40,
  color = "139,155,122",
  opacity = 0.12,
  maxDist = 120,
  className = "",
}: Props) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const cvs = ref.current;
    if (!cvs) return;
    const ctx = cvs.getContext("2d");
    if (!ctx) return;

    let W = 0,
      H = 0,
      raf = 0;
    const pts: { x: number; y: number; vx: number; vy: number; r: number }[] = [];

    function resize() {
      const canvas = ref.current;
      const parent = canvas?.parentElement;
      if (!canvas || !parent) return;
      const rect = parent.getBoundingClientRect();
      W = canvas.width = rect.width;
      H = canvas.height = rect.height;
    }

    function init() {
      resize();
      pts.length = 0;
      for (let i = 0; i < count; i++) {
        pts.push({
          x: Math.random() * W,
          y: Math.random() * H,
          vx: (Math.random() - 0.5) * 0.25,
          vy: (Math.random() - 0.5) * 0.25,
          r: Math.random() * 1.5 + 0.5,
        });
      }
    }

    function draw() {
      if (!ctx) return;
      ctx.clearRect(0, 0, W, H);
      pts.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) p.x = W;
        if (p.x > W) p.x = 0;
        if (p.y < 0) p.y = H;
        if (p.y > H) p.y = 0;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${color},${opacity * 2.5})`;
        ctx.fill();
      });
      for (let i = 0; i < pts.length; i++) {
        for (let j = i + 1; j < pts.length; j++) {
          const dx = pts[i].x - pts[j].x;
          const dy = pts[i].y - pts[j].y;
          const d = Math.sqrt(dx * dx + dy * dy);
          if (d < maxDist) {
            ctx.beginPath();
            ctx.moveTo(pts[i].x, pts[i].y);
            ctx.lineTo(pts[j].x, pts[j].y);
            ctx.strokeStyle = `rgba(${color},${opacity * (1 - d / maxDist)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }
      raf = requestAnimationFrame(draw);
    }

    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          if (!raf) draw();
        } else {
          cancelAnimationFrame(raf);
          raf = 0;
        }
      });
    });

    init();
    io.observe(cvs);
    window.addEventListener("resize", resize);
    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      window.removeEventListener("resize", resize);
    };
  }, [count, color, opacity, maxDist]);

  return (
    <canvas
      ref={ref}
      className={`pcvs ${className}`}
    />
  );
}
