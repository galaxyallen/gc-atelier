import ContactPageClient from "@/components/contact/ContactPageClient";
import { resolveSiteImage } from "@/lib/site-images";
import { getSiteImages } from "@/lib/site-images.server";
import { getContactContent } from "@/lib/page-content.server";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function ContactPage() {
  const [siteImages, content] = await Promise.all([getSiteImages(), getContactContent()]);

  return (
    <ContactPageClient
      content={content}
      mapImage={resolveSiteImage(siteImages, "contact_map_image")}
    />
  );
}
