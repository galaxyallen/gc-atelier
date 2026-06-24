import { Suspense } from "react";
import ContactEditor from "@/components/admin/page-editors/ContactEditor";
import { getContactContent } from "@/lib/page-content.server";
import { resolveSiteImage } from "@/lib/site-images";
import { getSiteImages } from "@/lib/site-images.server";

export default async function ContactAdminPage() {
  const [content, siteImages] = await Promise.all([getContactContent(), getSiteImages()]);

  return (
    <Suspense fallback={<div className="text-fg-3 text-sm">Loading…</div>}>
      <ContactEditor
        initial={content}
        mapImage={resolveSiteImage(siteImages, "contact_map_image")}
      />
    </Suspense>
  );
}
