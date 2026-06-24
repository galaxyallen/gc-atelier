"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useCartStore } from "@/lib/store";
import UserMenuDropdown from "./UserMenuDropdown";

const navItems = [
  { label: "Studio", href: "/#sec-studio", page: "/studio" },
  { label: "Projects", href: "/#sec-projects", page: "/projects" },
  { label: "Services", href: "/#sec-services", page: "/services" },
  { label: "Shop", href: "/#sec-shop", page: "/shop" },
  { label: "Contact", href: "/#sec-contact", page: "/contact" },
];

function displayName(session: { user?: { name?: string | null; email?: string | null } }) {
  const name = session.user?.name?.trim();
  if (name) return name;
  const email = session.user?.email;
  if (email) return email.split("@")[0];
  return "Account";
}

export default function Navbar({
  siteName,
  onLoginClick,
}: {
  siteName: string;
  onLoginClick: () => void;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session, status } = useSession();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const count = useCartStore((s) => s.count());
  const toggle = useCartStore((s) => s.toggle);

  const isLoggedIn = status === "authenticated" && !!session?.user;
  const userLabel = session?.user ? displayName(session) : "";

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
    setUserMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  const handleSignOut = async () => {
    setUserMenuOpen(false);
    await signOut({ redirect: false });
    router.refresh();
  };

  const isActive = (item: (typeof navItems)[0]) => pathname === item.page;

  const authBlock = (
    <>
      {status === "loading" ? (
        <span className="n-user-loading" aria-hidden>
          ···
        </span>
      ) : isLoggedIn ? (
        <UserMenuDropdown userMenuOpen={userMenuOpen} setUserMenuOpen={setUserMenuOpen} />
      ) : (
        <button type="button" className="n-login" onClick={onLoginClick}>
          Log in
        </button>
      )}
    </>
  );

  return (
    <>
      <nav id="nav" className={scrolled ? "scrolled" : ""}>
        <Link href="/" className="n-logo">
          <div className="n-mark">GC</div>
          <span className="n-name">{siteName}</span>
        </Link>
        <div className="n-right">
          <div className="n-links">
            {navItems.map((item) => (
              <Link
                key={item.page}
                href={item.href}
                className={isActive(item) ? "active" : ""}
              >
                {item.label}
              </Link>
            ))}
          </div>
          <div className="n-cart" onClick={toggle} role="button" tabIndex={0} onKeyDown={(e) => e.key === "Enter" && toggle()}>
            🛒
            <span className={`n-badge${count > 0 ? " show" : ""}`}>{count}</span>
          </div>
          <div className="hidden md:block">{authBlock}</div>
          <button
            type="button"
            className="md:hidden ml-2 text-fg-2 text-lg"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            {menuOpen ? "✕" : "☰"}
          </button>
        </div>
      </nav>

      {menuOpen && (
        <div className="fixed inset-0 z-[199] md:hidden">
          <div className="absolute inset-0 bg-black/60" onClick={() => setMenuOpen(false)} role="presentation" />
          <div className="absolute top-[60px] left-0 right-0 bg-bg-2 border-b border-border p-6">
            {navItems.map((item) => (
              <Link
                key={item.page}
                href={item.href}
                onClick={() => setMenuOpen(false)}
                className="block text-sm tracking-wide text-fg-2 uppercase py-3 border-b border-border hover:text-sage"
              >
                {item.label}
              </Link>
            ))}
            <div className="pt-4 mt-2 border-t border-border">
              {isLoggedIn ? (
                <>
                  <p className="text-sm text-fg mb-1">Hi, {userLabel}</p>
                  <p className="text-xs text-fg-3 mb-3">{session?.user?.email}</p>
                  <Link href="/account" className="block text-sm text-sage py-2" onClick={() => setMenuOpen(false)}>
                    My account & orders
                  </Link>
                  <button type="button" onClick={handleSignOut} className="text-sm tracking-wide text-fg-2 uppercase py-2">
                    Log out
                  </button>
                </>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    setMenuOpen(false);
                    onLoginClick();
                  }}
                  className="text-sm tracking-wide text-sage uppercase py-3"
                >
                  Log in
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
