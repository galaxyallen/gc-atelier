"use client";

import type { HomeSectionHead } from "@/lib/page-content";
import Link from "next/link";
import { useReveal } from "@/components/ui/RevealOnScroll";
import { homeProjectCategoryLabel, resolveProjectCoverImage } from "@/lib/placeholders";

interface Project {
  slug: string;
  name: string;
  category: string;
  image?: string | null;
  gallery?: string | null;
}

export default function ProjectsGrid({
  projects,
  content,
}: {
  projects: Project[];
  content: HomeSectionHead;
}) {
  const headerRef = useReveal<HTMLDivElement>(0);

  return (
    <section className="projects" id="sec-projects">
      <div className="sec-h" ref={headerRef}>
        <div>
          <div className="sl">{content.label}</div>
          <h2 className="sh">{content.heading}</h2>
        </div>
        <Link href="/projects" className="sec-link">
          {content.linkText}
        </Link>
      </div>
      <div className="p-grid">
        {projects.slice(0, 4).map((p, i) => (
          <ProjectCard key={p.slug} project={p} delay={i * 0.12} />
        ))}
      </div>
    </section>
  );
}

function ProjectCard({ project, delay }: { project: Project; delay: number }) {
  const ref = useReveal<HTMLAnchorElement>(delay);
  const src = resolveProjectCoverImage(project.image, project.gallery, project.category);

  return (
    <Link
      ref={ref}
      href="/projects"
      className="p-card"
      onMouseMove={(e) => {
        const el = ref.current;
        if (!el) return;
        const r = el.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width - 0.5;
        const y = (e.clientY - r.top) / r.height - 0.5;
        el.style.transform = `perspective(600px) rotateY(${x * 6}deg) rotateX(${-y * 6}deg) translateY(-4px)`;
      }}
      onMouseLeave={() => {
        if (ref.current) ref.current.style.transform = "";
      }}
    >
      <div className="p-img has-image">
        <div className="p-img-bg">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={src} alt={project.name} className="p-img-fill" />
        </div>
      </div>
      <div className="p-info">
        <p className="p-name">{project.name}</p>
        <p className="p-cat">{homeProjectCategoryLabel(project.category)}</p>
      </div>
      <span className="p-arrow">→</span>
    </Link>
  );
}
