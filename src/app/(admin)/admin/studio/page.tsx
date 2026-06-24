import { Suspense } from "react";
import StudioEditor from "@/components/admin/page-editors/StudioEditor";
import { getStudioContent } from "@/lib/page-content.server";
import { resolveSiteImage } from "@/lib/site-images";
import { getSiteImages } from "@/lib/site-images.server";

export default async function StudioAdminPage() {
  const [content, siteImages] = await Promise.all([getStudioContent(), getSiteImages()]);

  const images = {
    studio_hero_image: resolveSiteImage(siteImages, "studio_hero_image"),
    studio_origin_image: resolveSiteImage(siteImages, "studio_origin_image"),
  };

  return (
    <Suspense fallback={<div className="text-fg-3 text-sm">Loading…</div>}>
      <StudioEditor initial={content} images={images} />
    </Suspense>
  );
}
