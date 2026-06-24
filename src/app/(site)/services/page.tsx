import ServicesPageClient from "@/components/services/ServicesPageClient";
import { prisma } from "@/lib/prisma";
import { getSiteImages } from "@/lib/site-images.server";
import { getServicesContent } from "@/lib/page-content.server";
import { projectImageSrc } from "@/lib/placeholders";

export default async function ServicesPage() {
  const [siteImages, projects, content] = await Promise.all([
    getSiteImages(),
    prisma.project.findMany({
      where: { status: "PUBLISHED" },
      select: { name: true, image: true, category: true },
    }),
    getServicesContent(),
  ]);

  const projectImages = Object.fromEntries(
    projects.map((p) => [p.name.toLowerCase(), projectImageSrc(p.image, p.category)])
  );

  return <ServicesPageClient pageImages={siteImages} projectImages={projectImages} content={content} />;
}
