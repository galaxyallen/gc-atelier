import { prisma } from "@/lib/prisma";
import { resolveSiteImage } from "@/lib/site-images";
import { getSiteImages } from "@/lib/site-images.server";
import { getHomeContent, getContactContent } from "@/lib/page-content.server";
import {
  resolveHomeContactInfo,
  resolveHomeProjects,
  resolveHomeProducts,
} from "@/lib/homepage-data";
import HeroVideo from "@/components/home/HeroVideo";
import IntroSection from "@/components/home/IntroSection";
import ProjectsGrid from "@/components/home/ProjectsGrid";
import DualCapability from "@/components/home/DualCapability";
import FeaturedProducts from "@/components/home/FeaturedProducts";
import ProcessTimeline from "@/components/home/ProcessTimeline";
import StudioPreview from "@/components/home/StudioPreview";
import ContactSection from "@/components/home/ContactSection";

export default async function HomePage() {
  const [dbProjects, dbProducts, siteImages, content, contactPage] = await Promise.all([
    prisma.project.findMany({
      where: { status: "PUBLISHED" },
      orderBy: { sortOrder: "asc" },
      take: 4,
      select: { slug: true, name: true, category: true, image: true, gallery: true },
    }),
    prisma.product.findMany({
      where: { status: "PUBLISHED" },
      orderBy: { createdAt: "desc" },
      take: 4,
      select: { id: true, name: true, price: true, category: true, images: true },
    }),
    getSiteImages(),
    getHomeContent(),
    getContactContent(),
  ]);

  const projects = resolveHomeProjects(content.projects.cards, dbProjects);
  const products = resolveHomeProducts(content.products.cards, dbProducts);
  const contact = resolveHomeContactInfo(content, contactPage);

  const heroPoster = resolveSiteImage(siteImages, "hero_poster");
  const heroVideo = resolveSiteImage(siteImages, "hero_video");
  const founderImage = resolveSiteImage(siteImages, "studio_founder_image");

  return (
    <>
      <HeroVideo poster={heroPoster} videoSrc={heroVideo} hero={content.hero} />
      <IntroSection content={content.intro} />
      <ProjectsGrid projects={projects} content={content.projects} />
      <DualCapability content={content.capability} />
      <FeaturedProducts products={products} content={content.products} />
      <ProcessTimeline content={content.process} />
      <StudioPreview founderImage={founderImage} content={content.studio} />
      <ContactSection content={content.contact} contact={contact} formConfig={contactPage.form} />
    </>
  );
}
