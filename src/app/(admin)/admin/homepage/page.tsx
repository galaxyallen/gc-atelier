import { Suspense } from "react";
import HomepageEditor from "@/components/admin/page-editors/HomepageEditor";
import { getHomeContentForAdmin, getContactContent } from "@/lib/page-content.server";
import { resolveSiteImage } from "@/lib/site-images";
import { getSiteImages } from "@/lib/site-images.server";
import { prisma } from "@/lib/prisma";
import { dbProductToCard, dbProjectToCard } from "@/lib/homepage-data";

export default async function HomepageAdminPage() {
  const [content, siteImages, contactPage, dbProjects, dbProducts] = await Promise.all([
    getHomeContentForAdmin(),
    getSiteImages(),
    getContactContent(),
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
  ]);

  const images = {
    hero_poster: resolveSiteImage(siteImages, "hero_poster"),
    hero_video: resolveSiteImage(siteImages, "hero_video"),
    studio_founder_image: resolveSiteImage(siteImages, "studio_founder_image"),
  };

  return (
    <Suspense fallback={<div className="text-fg-3 text-sm">Loading…</div>}>
      <HomepageEditor
        initial={content}
        images={images}
        contactChannels={{
          email: contactPage.channels.email,
          phone: contactPage.channels.phone,
          wechat: contactPage.channels.wechat,
          address: contactPage.channels.address.replace(/\n/g, ", "),
        }}
        dbProjectCards={dbProjects.map(dbProjectToCard)}
        dbProductCards={dbProducts.map(dbProductToCard)}
      />
    </Suspense>
  );
}
