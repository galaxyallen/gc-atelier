import type { HomeStudioContent } from "@/lib/page-content";
import Link from "next/link";
import ParticleCanvas from "@/components/ui/ParticleCanvas";
import RevealOnScroll from "@/components/ui/RevealOnScroll";

const defaultPrinciples = [
  "Material honesty — let every surface speak its truth.",
  "Spatial clarity — remove until only the essential remains.",
  "Quiet refinement — the details you feel before you see.",
];

export default function StudioPreview({
  founderImage,
  content,
}: {
  founderImage?: string | null;
  content: HomeStudioContent;
}) {
  const src = founderImage || "/images/studio/founder.svg";
  const principles = content.principles.length ? content.principles : defaultPrinciples;
  return (
    <section className="studio" id="sec-studio" style={{ position: "relative", overflow: "hidden" }}>
      <ParticleCanvas count={25} opacity={0.08} maxDist={90} />
      <RevealOnScroll>
        <div className="sl">{content.label}</div>
        <h2 className="sh">{content.heading}</h2>
      </RevealOnScroll>
      <div className="studio-grid">
        <RevealOnScroll>
          <div className="studio-img has-image">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={src} alt="Founder portrait" className="studio-img-fill" />
          </div>
        </RevealOnScroll>
        <RevealOnScroll delay={0.12}>
          <p className="stu-name">{content.name}</p>
          <p className="stu-role">{content.role}</p>
          <p className="stu-bio">{content.bio1}</p>
          <p className="stu-bio">{content.bio2}</p>
          <div className="phil">
            <p className="phil-l">{content.principlesLabel}</p>
            {principles.map((p) => (
              <p key={p} className="phil-i">
                {p}
              </p>
            ))}
          </div>
          <Link href="/studio" className="cap-il" style={{ marginTop: 24 }}>
            {content.linkText}
          </Link>
        </RevealOnScroll>
      </div>
    </section>
  );
}
