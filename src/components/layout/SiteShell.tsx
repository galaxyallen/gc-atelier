"use client";

import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import type { SiteGlobals } from "@/lib/site-settings";
import Navbar from "./Navbar";
import Footer from "./Footer";
import CartSidebar from "./CartSidebar";
import LoginModal from "./LoginModal";
import TestModeBanner from "./TestModeBanner";

function pageClass(pathname: string) {
  if (pathname === "/") return "page-home";
  if (pathname.startsWith("/studio")) return "page-studio";
  if (pathname.startsWith("/projects")) return "page-projects";
  if (pathname.startsWith("/services")) return "page-services";
  if (pathname.startsWith("/shop")) return "page-shop";
  if (pathname.startsWith("/contact")) return "page-contact";
  return "page-site";
}

export default function SiteShell({
  children,
  siteGlobals,
}: {
  children: React.ReactNode;
  siteGlobals: SiteGlobals;
}) {
  const [loginOpen, setLoginOpen] = useState(false);
  const [navKey, setNavKey] = useState(0);
  const pathname = usePathname();
  const router = useRouter();

  const handleAuthSuccess = () => {
    setNavKey((k) => k + 1);
    router.refresh();
  };

  return (
    <>
      <TestModeBanner />
      <Navbar key={navKey} siteName={siteGlobals.siteName} onLoginClick={() => setLoginOpen(true)} />
      <main className={pageClass(pathname)}>{children}</main>
      <Footer siteGlobals={siteGlobals} />
      <CartSidebar onLoginClick={() => setLoginOpen(true)} />
      <LoginModal
        open={loginOpen}
        onClose={() => setLoginOpen(false)}
        onAuthSuccess={handleAuthSuccess}
      />
    </>
  );
}
