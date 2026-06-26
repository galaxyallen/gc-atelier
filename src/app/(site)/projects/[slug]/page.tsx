import { prisma, parseJson } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { resolveProjectDetailHero, resolveProjectListImage } from "@/lib/placeholders";
import CmsImage from "@/components/ui/CmsImage";
import { categoryLabels } from "@/lib/utils";
import RevealOnScroll from "@/components/ui/RevealOnScroll";
import Link from "next/link";

interface Detail {
  icon: string;
  name: string;
  desc: string;
}

interface Quote {
  text: string;
  attr: string;
}

export default async function CaseStudyPage({ params }: { params: { slug: string } }) {
  const project = await prisma.project.findUnique({
    where: { slug: params.slug, status: "PUBLISHED" },
  });

  if (!project) notFound();

  const heroSrc = resolveProjectDetailHero(project.gallery, project.category);
  const gallery = parseJson<string[]>(project.gallery, []);
  const galleryUrls = gallery.filter((u) => u.startsWith("/") || u.startsWith("http"));
  const details = parseJson<Detail[]>(project.details, []);
  const quote = parseJson<Quote | null>(project.quote, null);

  const related = await prisma.project.findMany({
    where: { status: "PUBLISHED", category: project.category, NOT: { id: project.id } },
    take: 3,
  });

  return (
    <>
      <section className="h-[75vh] relative overflow-hidden mt-0">
        <div className={`absolute inset-0 bg-bg-4 flex items-center justify-center${heroSrc ? " has-image" : ""}`}>
          <CmsImage src={heroSrc} alt={project.name} placeholder="Project hero" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-bg to-transparent" />
        <div className="absolute bottom-12 left-14 z-10">
          <p className="text-[11px] tracking-widest text-sage uppercase mb-2 flex items-center gap-2">
            <span className="w-4 h-px bg-sage" />
            {categoryLabels[project.category]}
          </p>
          <h1 className="font-display text-[clamp(32px,4vw,56px)] font-light">{project.name}</h1>
        </div>
      </section>

      <div className="grid grid-cols-2 md:grid-cols-5 border-y border-border max-w-5xl mx-auto">
        {[
          ["Client", project.client || "Private client"],
          ["Location", project.location || "—"],
          ["Category", categoryLabels[project.category]],
          ["Year", String(project.year)],
          ["Scope", project.scope || "Full design"],
        ].map(([label, value]) => (
          <div key={label} className="p-7 border-r border-border last:border-r-0">
            <p className="text-[10px] tracking-widest text-fg-3 uppercase mb-1">{label}</p>
            <p className="text-sm">{value}</p>
          </div>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-20 py-24 px-14 max-w-5xl mx-auto">
        <RevealOnScroll>
          <p className="text-[11px] tracking-widest text-sage uppercase mb-4 flex items-center gap-2">
            <span className="w-5 h-px bg-sage" />
            The brief
          </p>
          <h2 className="font-display text-2xl font-light mb-4">Challenge</h2>
          <p className="text-[15px] text-fg-2 leading-relaxed">{project.brief}</p>
        </RevealOnScroll>
        <RevealOnScroll delay={0.1}>
          <p className="text-[11px] tracking-widest text-sage uppercase mb-4 flex items-center gap-2">
            <span className="w-5 h-px bg-sage" />
            The approach
          </p>
          <h2 className="font-display text-2xl font-light mb-4">Solution</h2>
          <p className="text-[15px] text-fg-2 leading-relaxed">{project.approach}</p>
        </RevealOnScroll>
      </div>

      {galleryUrls.length > 0 && (
        <div className="px-14 pb-16 max-w-5xl mx-auto space-y-3">
          {galleryUrls.map((url) => (
            <div key={url} className="aspect-video bg-bg-3 rounded overflow-hidden relative has-image">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={url} alt="" className="cms-img-fill" />
            </div>
          ))}
        </div>
      )}

      {details.length > 0 && (
        <div className="grid md:grid-cols-3 gap-5 px-14 py-16 max-w-5xl mx-auto">
          {details.map((d) => (
            <div key={d.name} className="bg-bg-3 border border-border rounded-lg p-7 hover:border-sage-border transition-colors">
              <p className="text-lg text-sage mb-3">{d.icon}</p>
              <p className="text-sm font-medium mb-2">{d.name}</p>
              <p className="text-[13px] text-fg-2 leading-relaxed">{d.desc}</p>
            </div>
          ))}
        </div>
      )}

      {quote && (
        <div className="text-center py-20 px-14 max-w-2xl mx-auto">
          <p className="font-display text-[clamp(22px,2.5vw,32px)] font-light italic leading-snug mb-5">
            &ldquo;{quote.text}&rdquo;
          </p>
          <p className="text-[13px] text-fg-3">— {quote.attr}</p>
        </div>
      )}

      {related.length > 0 && (
        <div className="px-14 py-16 max-w-5xl mx-auto border-t border-border">
          <p className="text-[11px] tracking-widest text-sage uppercase mb-8 flex items-center gap-2">
            <span className="w-5 h-px bg-sage" />
            Related projects
          </p>
          <div className="grid md:grid-cols-3 gap-4">
            {related.map((r) => (
              <Link key={r.id} href={`/projects/${r.slug}`} className="bg-bg-3 rounded overflow-hidden hover:-translate-y-1 transition-transform">
                <div className={`aspect-[4/3] bg-bg-4 flex items-center justify-center relative overflow-hidden has-image`}>
                  <CmsImage
                    src={resolveProjectListImage(r.image, r.category)}
                    alt={r.name}
                    placeholder="Project"
                  />
                </div>
                <div className="p-4">
                  <p className="text-sm">{r.name}</p>
                  <p className="text-[11px] text-fg-3">{categoryLabels[r.category]}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
