"use client";

import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import Lightbox from "@/components/ui/Lightbox";
import CmsImage from "@/components/ui/CmsImage";
import { categoryLabels } from "@/lib/utils";
import { resolveProjectCoverImage } from "@/lib/placeholders";

interface ProjectDetail {
  icon: string;
  name: string;
  desc: string;
}

interface Project {
  id: string;
  slug: string;
  name: string;
  category: string;
  year: number;
  isHero: boolean;
  location?: string | null;
  client?: string | null;
  scope?: string | null;
  brief?: string | null;
  approach?: string | null;
  quote?: string | null;
  gallery: string;
  details: string;
  image?: string | null;
}

export default function ProjectsPageClient({
  projects,
  pageHeader,
}: {
  projects: Project[];
  pageHeader: { label: string; title: string; countText: string };
}) {
  const searchParams = useSearchParams();
  const [filter, setFilter] = useState("all");
  const [visible, setVisible] = useState(9);
  const [shown, setShown] = useState<Set<string>>(new Set());
  const [activeSlug, setActiveSlug] = useState<string | null>(null);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const overlayRef = useRef<HTMLDivElement>(null);
  const heroBgRef = useRef<HTMLDivElement>(null);

  const filtered =
    filter === "all" ? projects : projects.filter((p) => p.category.toLowerCase() === filter);

  const displayed = filtered.slice(0, visible);
  const active = projects.find((p) => p.slug === activeSlug);

  useEffect(() => {
    const ids = filtered.slice(0, visible).map((p) => p.id);
    ids.forEach((id, i) => {
      setTimeout(() => setShown((s) => new Set(s).add(id)), 200 + i * 100);
    });
  }, [filter, visible, filtered]);

  useEffect(() => {
    const open = searchParams.get("open");
    if (open) setActiveSlug(open);
  }, [searchParams]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setLightboxOpen(false);
        closeCase();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const filterProjects = (cat: string) => {
    setFilter(cat);
    setShown(new Set());
    setVisible(9);
  };

  const openCase = (slug: string) => {
    setActiveSlug(slug);
    document.body.style.overflow = "hidden";
  };

  const closeCase = () => {
    setActiveSlug(null);
    document.body.style.overflow = "";
  };

  const csParallax = () => {
    const bg = heroBgRef.current;
    const overlay = overlayRef.current;
    if (bg && overlay) {
      bg.style.transform = `translateY(${overlay.scrollTop * 0.3}px)`;
    }
  };

  const parseJson = <T,>(raw: string, fallback: T): T => {
    try {
      return JSON.parse(raw) as T;
    } catch {
      return fallback;
    }
  };

  const gallery = active ? parseJson<string[]>(active.gallery, []) : [];
  const galleryUrls = gallery.filter((u) => u.startsWith("/") || u.startsWith("http"));
  const heroSrc = active ? resolveProjectCoverImage(active.image, active.gallery, active.category) : "";
  const details = active ? parseJson<ProjectDetail[]>(active.details, []) : [];
  const related = active
    ? projects.filter((p) => p.slug !== active.slug && p.category === active.category).slice(0, 3)
    : [];

  return (
    <>
      <section className="page-header">
        <div className="ph-label">{pageHeader.label}</div>
        <h1 className="ph-title">{pageHeader.title}</h1>
        <p className="ph-count">
          <span>{filtered.length}</span> {pageHeader.countText}
        </p>
      </section>

      <div className="filter-bar">
        <span className="filter-group-label">Spaces</span>
        {[
          ["all", "All"],
          ["interior", "Interior"],
          ["villa", "Villa"],
          ["landscape", "Landscape"],
        ].map(([val, label]) => (
          <button
            key={val}
            type="button"
            className={`filter-btn${filter === val ? " active" : ""}`}
            onClick={() => filterProjects(val)}
          >
            {label}
          </button>
        ))}
        <div className="filter-divider" />
        <span className="filter-group-label">Objects</span>
        {[
          ["diffuser", "Diffuser"],
          ["backpack", "Backpack"],
          ["speaker", "Speaker"],
        ].map(([val, label]) => (
          <button
            key={val}
            type="button"
            className={`filter-btn${filter === val ? " active" : ""}`}
            onClick={() => filterProjects(val)}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="grid-wrap">
        <div className="project-grid">
          {displayed.map((p) => (
            <ProjectCard
              key={p.id}
              project={p}
              visible={shown.has(p.id)}
              onOpen={() => openCase(p.slug)}
            />
          ))}
        </div>
        {visible < filtered.length && (
          <div className="load-more-wrap">
            <button type="button" className="load-btn" onClick={() => setVisible((v) => v + 6)}>
              Load more projects
            </button>
          </div>
        )}
      </div>

      <div
        className={`cs-overlay${activeSlug ? " open" : ""}`}
        ref={overlayRef}
        onScroll={csParallax}
      >
        <button type="button" className="cs-close" onClick={closeCase}>
          ✕
        </button>
        <button type="button" className="cs-back" onClick={closeCase}>
          ← Back to projects
        </button>

        {active && (
          <>
            <div className="cs-hero">
              <div
                className={`cs-hero-img${heroSrc ? " has-image" : ""}`}
                ref={heroBgRef}
                style={!heroSrc ? { background: "var(--bg4)" } : undefined}
              >
                <CmsImage src={heroSrc} alt={active.name} placeholder="Project hero image" />
              </div>
              <div className="cs-hero-grad" />
              <div className="cs-hero-info">
                <div className="cs-hero-cat">{categoryLabels[active.category]}</div>
                <h2 className="cs-hero-title">{active.name}</h2>
              </div>
            </div>

            <div className="cs-brief">
              <div className="cs-brief-item">
                <div className="cs-brief-label">Client</div>
                <div className="cs-brief-value">{active.client || "Private client"}</div>
              </div>
              <div className="cs-brief-item">
                <div className="cs-brief-label">Location</div>
                <div className="cs-brief-value">{active.location || "Guangzhou, China"}</div>
              </div>
              <div className="cs-brief-item">
                <div className="cs-brief-label">Category</div>
                <div className="cs-brief-value">{categoryLabels[active.category]}</div>
              </div>
              <div className="cs-brief-item">
                <div className="cs-brief-label">Year</div>
                <div className="cs-brief-value">{active.year}</div>
              </div>
              <div className="cs-brief-item">
                <div className="cs-brief-label">Scope</div>
                <div className="cs-brief-value">{active.scope || "Full design"}</div>
              </div>
            </div>

            <div className="cs-narrative">
              <div>
                <div className="cs-nar-label">The brief</div>
                <h3 className="cs-nar-title">Project vision.</h3>
                <p className="cs-nar-text">{active.brief || "Project brief details."}</p>
              </div>
              <div>
                <div className="cs-nar-label">The approach</div>
                <h3 className="cs-nar-title">Design response.</h3>
                <p className="cs-nar-text">{active.approach || "Design approach details."}</p>
              </div>
            </div>

            <div className="cs-gallery">
              {galleryUrls.length > 0 ? (
                galleryUrls.map((url, i) => (
                  <div key={url} className="cs-gal-row full">
                    <div
                      className="cs-gal-img wide has-image"
                      onClick={() => {
                        setLightboxIndex(i);
                        setLightboxOpen(true);
                      }}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => e.key === "Enter" && setLightboxOpen(true)}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={url} alt="" className="cms-img-fill" />
                    </div>
                  </div>
                ))
              ) : (
                ["Wide spatial render", "Material detail", "Interior view"].map((label, i) => (
                  <div key={label} className={`cs-gal-row ${i === 0 ? "full" : "pair"}`}>
                    <div className="cs-gal-img wide">
                      <span>{label}</span>
                    </div>
                  </div>
                ))
              )}
            </div>

            {details.length > 0 && (
              <div className="cs-details">
                {details.map((d) => (
                  <div key={d.name} className="cs-detail-card">
                    <div className="cs-detail-icon">{d.icon}</div>
                    <div className="cs-detail-name">{d.name}</div>
                    <div className="cs-detail-desc">{d.desc}</div>
                  </div>
                ))}
              </div>
            )}

            {active.quote && (
              <div className="cs-quote">
                <p className="cs-quote-text">&ldquo;{active.quote}&rdquo;</p>
                <p className="cs-quote-attr">— Client</p>
              </div>
            )}

            {related.length > 0 && (
              <div className="cs-related">
                <div className="cs-related-title">Related projects</div>
                <div className="cs-related-grid">
                  {related.map((r) => (
                    <div key={r.id} className="cs-rel-card" onClick={() => openCase(r.slug)} role="button" tabIndex={0}>
                    <div className={`cs-rel-img${r.image ? " has-image" : ""}`} style={!r.image ? { background: "var(--bg4)" } : undefined}>
                      <CmsImage
                        src={resolveProjectCoverImage(r.image, r.gallery, r.category)}
                        alt={r.name}
                        placeholder="Project"
                      />
                    </div>
                      <div className="cs-rel-info">
                        <p className="cs-rel-name">{r.name}</p>
                        <p className="cs-rel-cat">{categoryLabels[r.category]}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>

      <Lightbox
        images={galleryUrls.length ? galleryUrls : ["Image"]}
        open={lightboxOpen}
        index={lightboxIndex}
        onClose={() => setLightboxOpen(false)}
        onNavigate={setLightboxIndex}
      />
    </>
  );
}

function ProjectCard({
  project,
  visible,
  onOpen,
}: {
  project: Project;
  visible: boolean;
  onOpen: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const src = resolveProjectCoverImage(project.image, project.gallery, project.category);

  return (
    <div
      ref={ref}
      className={`p-card${project.isHero ? " hero" : ""}${visible ? " show" : ""}`}
      data-cat={project.category.toLowerCase()}
      onClick={onOpen}
      onKeyDown={(e) => e.key === "Enter" && onOpen()}
      role="button"
      tabIndex={0}
      onMouseMove={(e) => {
        const el = ref.current;
        if (!el) return;
        const r = el.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width - 0.5;
        const y = (e.clientY - r.top) / r.height - 0.5;
        el.style.transform = `perspective(700px) rotateY(${x * 5}deg) rotateX(${-y * 5}deg) scale(1.01)`;
      }}
      onMouseLeave={() => {
        if (ref.current) ref.current.style.transform = "";
      }}
    >
      <div className="p-img has-image">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={src} alt={project.name} className="p-img-fill" />
        <div className="p-overlay">
          <span className="p-overlay-text">View project →</span>
        </div>
      </div>
      <div className="p-info">
        <div>
          <p className="p-name">{project.name}</p>
        </div>
        <div className="p-meta">
          <span className="p-cat">{categoryLabels[project.category]}</span>
          <span className="p-year">{project.year}</span>
        </div>
      </div>
    </div>
  );
}
