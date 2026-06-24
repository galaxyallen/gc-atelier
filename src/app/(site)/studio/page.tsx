import { resolveSiteImage } from "@/lib/site-images";
import { getSiteImages } from "@/lib/site-images.server";
import { getStudioContent } from "@/lib/page-content.server";
import StudioPageClient from "@/components/studio/StudioPageClient";

export default async function StudioPage() {
  const [siteImages, content] = await Promise.all([getSiteImages(), getStudioContent()]);

  return (
    <StudioPageClient
      content={content}
      heroImage={resolveSiteImage(siteImages, "studio_hero_image")}
      originImage={resolveSiteImage(siteImages, "studio_origin_image")}
    />
  );
}
