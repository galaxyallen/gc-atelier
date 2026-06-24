import type { HomeIntroContent } from "@/lib/page-content";
import ParticleCanvas from "@/components/ui/ParticleCanvas";
import RevealOnScroll from "@/components/ui/RevealOnScroll";
import CounterAnimation from "@/components/ui/CounterAnimation";

export default function IntroSection({ content }: { content: HomeIntroContent }) {
  return (
    <section className="intro" style={{ position: "relative", overflow: "hidden" }}>
      <ParticleCanvas count={40} opacity={0.15} maxDist={110} />
      <RevealOnScroll>
        <div className="sl">{content.label}</div>
        <h2 className="sh">{content.heading}</h2>
      </RevealOnScroll>
      <RevealOnScroll delay={0.12}>
        <p className="intro-text">{content.body}</p>
        <div className="stats" id="intro-stats">
          <CounterAnimation target={content.statsDisciplines} label={content.statsDisciplinesLabel} />
          <CounterAnimation target={content.statsYears} suffix="+" label={content.statsYearsLabel} />
          <CounterAnimation target={content.statsProjects} suffix="+" label={content.statsProjectsLabel} />
        </div>
      </RevealOnScroll>
    </section>
  );
}
