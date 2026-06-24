import type { HomeCapabilityContent } from "@/lib/page-content";
import Link from "next/link";
import ParticleCanvas from "@/components/ui/ParticleCanvas";
import RevealOnScroll from "@/components/ui/RevealOnScroll";

export default function DualCapability({ content }: { content: HomeCapabilityContent }) {
  return (
    <section className="cap" id="sec-services" style={{ position: "relative", overflow: "hidden" }}>
      <ParticleCanvas count={30} opacity={0.1} maxDist={100} />
      <RevealOnScroll>
        <div className="sl">{content.label}</div>
        <h2 className="sh">{content.heading}</h2>
        <Link href="/services" className="cap-il" style={{ marginTop: 16 }}>
          {content.linkText}
        </Link>
      </RevealOnScroll>
      <div className="cap-grid">
        <RevealOnScroll delay={0.12}>
          <div className="cap-ct">{content.residentialTitle}</div>
          <div className="cap-cd">{content.residentialDesc}</div>
          {content.residentialItems.map((item) => (
            <CapabilityItem key={item.name} {...item} />
          ))}
        </RevealOnScroll>
        <div className="cap-div" />
        <RevealOnScroll delay={0.24}>
          <div className="cap-ct">{content.productTitle}</div>
          <div className="cap-cd">{content.productDesc}</div>
          {content.productItems.map((item) => (
            <CapabilityItem key={item.name} {...item} />
          ))}
        </RevealOnScroll>
      </div>
    </section>
  );
}

function CapabilityItem({
  icon,
  name,
  desc,
  linkText,
}: {
  icon: string;
  name: string;
  desc: string;
  linkText: string;
}) {
  return (
    <div className="cap-item">
      <div className="cap-ico">{icon}</div>
      <div>
        <p className="cap-in">{name}</p>
        <p className="cap-id">{desc}</p>
        <Link href="/projects" className="cap-il">
          {linkText}
        </Link>
      </div>
    </div>
  );
}
