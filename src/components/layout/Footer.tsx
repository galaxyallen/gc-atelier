import Link from "next/link";
import type { SiteGlobals } from "@/lib/site-settings";
import { socialLinksFromGlobals } from "@/lib/site-settings";

export default function Footer({ siteGlobals }: { siteGlobals: SiteGlobals }) {
  const socialLinks = socialLinksFromGlobals(siteGlobals);

  return (
    <footer>
      <div className="f-l">{siteGlobals.footerCopyright}</div>
      <div className="f-r">
        {socialLinks.map((link) => (
          <Link
            key={link.label}
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
          >
            {link.label}
          </Link>
        ))}
      </div>
    </footer>
  );
}
