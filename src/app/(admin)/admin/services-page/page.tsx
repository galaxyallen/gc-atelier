import { Suspense } from "react";
import ServicesEditor from "@/components/admin/page-editors/ServicesEditor";
import { getServicesContent } from "@/lib/page-content.server";
import { getSiteImages } from "@/lib/site-images.server";

const IMAGE_KEYS = [
  "services_feat_interior",
  "services_feat_villa",
  "services_feat_landscape",
  "services_feat_diffuser",
  "services_feat_backpack",
  "services_feat_speaker",
  "services_d2p_01",
  "services_d2p_02",
  "services_d2p_03",
  "services_d2p_04",
  "services_d2p_05",
] as const;

export default async function ServicesAdminPage() {
  const [content, siteImages] = await Promise.all([getServicesContent(), getSiteImages()]);

  const images = Object.fromEntries(IMAGE_KEYS.map((key) => [key, siteImages[key] || ""]));

  return (
    <Suspense fallback={<div className="text-fg-3 text-sm">Loading…</div>}>
      <ServicesEditor initial={content} images={images} />
    </Suspense>
  );
}
