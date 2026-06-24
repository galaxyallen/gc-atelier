import SiteShell from "@/components/layout/SiteShell";
import { getSiteGlobals } from "@/lib/site-settings.server";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const siteGlobals = await getSiteGlobals();
  return <SiteShell siteGlobals={siteGlobals}>{children}</SiteShell>;
}
