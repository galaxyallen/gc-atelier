"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { useEffect, useState } from "react";
import {
  LayoutDashboard,
  Home,
  Building2,
  FolderKanban,
  Layers,
  ShoppingCart,
  Mail,
  Receipt,
  MessageSquare,
  Users,
  Settings,
  LogOut,
  ChevronDown,
} from "lucide-react";
import { cn } from "@/lib/utils";

type BadgeStats = {
  projects: number;
  products: number;
  orders: number;
  inquiries: number;
  newInquiries: number;
  pendingOrders: number;
  users: number;
};

type MenuItem = {
  name: string;
  href: string;
  icon: typeof LayoutDashboard;
  badge?: number;
  urgent?: boolean;
  hideFor?: string[];
  children?: { label: string; slug: string }[];
};

const menuGroups: { label: string; items: MenuItem[] }[] = [
  {
    label: "Overview",
    items: [{ name: "Dashboard", href: "/admin", icon: LayoutDashboard }],
  },
  {
    label: "Pages",
    items: [
      {
        name: "Homepage",
        href: "/admin/homepage",
        icon: Home,
        children: [
          { label: "Hero video", slug: "hero-video" },
          { label: "Brand intro", slug: "brand-intro" },
          { label: "Selected projects", slug: "selected-projects" },
          { label: "Services overview", slug: "services-overview" },
          { label: "Featured products", slug: "featured-products" },
          { label: "Process", slug: "process" },
          { label: "Studio preview", slug: "studio-preview" },
          { label: "Contact", slug: "contact" },
        ],
      },
      {
        name: "Studio",
        href: "/admin/studio",
        icon: Building2,
        children: [
          { label: "Hero", slug: "hero" },
          { label: "Manifesto", slug: "manifesto" },
          { label: "Origin story", slug: "origin-story" },
          { label: "Philosophy", slug: "philosophy" },
          { label: "Capabilities", slug: "capabilities" },
          { label: "Network", slug: "network" },
          { label: "Milestones", slug: "milestones" },
          { label: "CTA", slug: "cta" },
        ],
      },
      { name: "Projects", href: "/admin/projects", icon: FolderKanban },
      {
        name: "Services",
        href: "/admin/services-page",
        icon: Layers,
        children: [
          { label: "Hero", slug: "hero" },
          { label: "Panels", slug: "panels" },
          { label: "Service modules", slug: "service-modules" },
          { label: "D2P strip", slug: "d2p-strip" },
          { label: "Engagement", slug: "engagement" },
          { label: "FAQ", slug: "faq" },
          { label: "CTA", slug: "cta" },
        ],
      },
      { name: "Shop", href: "/admin/products", icon: ShoppingCart },
      {
        name: "Contact",
        href: "/admin/contact-page",
        icon: Mail,
        children: [
          { label: "Channels", slug: "channels" },
          { label: "Form config", slug: "form-config" },
          { label: "Availability", slug: "availability" },
        ],
      },
    ],
  },
  {
    label: "Business",
    items: [
      { name: "Orders", href: "/admin/orders", icon: Receipt, urgent: true },
      { name: "Inquiries", href: "/admin/inquiries", icon: MessageSquare, urgent: true },
      { name: "Users", href: "/admin/users", icon: Users, hideFor: ["SALES"] },
    ],
  },
  {
    label: "System",
    items: [{ name: "Settings", href: "/admin/settings", icon: Settings, hideFor: ["EDITOR", "SALES"] }],
  },
];

function roleLabel(role: string) {
  if (role === "SUPER_ADMIN") return "Super admin";
  if (role === "EDITOR") return "Editor";
  return "Sales";
}

export default function AdminSidebar({
  role,
  userName,
}: {
  role: string;
  userName: string;
}) {
  const pathname = usePathname();
  const [expanded, setExpanded] = useState<string | null>("Homepage");
  const [stats, setStats] = useState<BadgeStats | null>(null);

  useEffect(() => {
    fetch("/api/dashboard/stats")
      .then((r) => r.json())
      .then(setStats)
      .catch(() => {});
  }, []);

  useEffect(() => {
    const active = menuGroups
      .flatMap((g) => g.items)
      .find((item) => item.children && pathname.startsWith(item.href));
    if (active) setExpanded(active.name);
  }, [pathname]);

  const badgeFor = (name: string) => {
    if (!stats) return undefined;
    if (name === "Projects") return stats.projects;
    if (name === "Shop") return stats.products;
    if (name === "Orders") return stats.pendingOrders || stats.orders;
    if (name === "Inquiries") return stats.newInquiries || stats.inquiries;
    if (name === "Users") return stats.users;
    return undefined;
  };

  const urgentFor = (name: string) => {
    if (name === "Orders") return (stats?.pendingOrders ?? 0) > 0;
    if (name === "Inquiries") return (stats?.newInquiries ?? 0) > 0;
    return false;
  };

  return (
    <aside className="admin-sidebar w-60 shrink-0 h-screen sticky top-0 z-40 bg-bg-2 border-r border-border flex flex-col">
      <div className="px-4 py-4 border-b border-border flex items-center gap-3 shrink-0">
        <div className="w-8 h-8 border-[1.5px] border-sage rounded flex items-center justify-center text-xs font-medium text-sage">
          GC
        </div>
        <span className="text-xs font-medium tracking-[0.1em]">ADMIN</span>
      </div>

      <div role="navigation" aria-label="Admin menu" className="admin-sidebar-nav flex-1 overflow-y-auto py-2">
        {menuGroups.map((group) => (
          <div key={group.label}>
            <div className="px-4 pt-3 pb-1 text-[10px] tracking-widest text-fg-3 uppercase">
              {group.label}
            </div>
            {group.items
              .filter((item) => !item.hideFor?.includes(role))
              .map((item) => {
                const active = pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href));
                const badge = badgeFor(item.name);
                const urgent = item.urgent && urgentFor(item.name);

                return (
                  <div key={item.name}>
                    <Link
                      href={item.href}
                      onClick={(e) => {
                        if (item.children) {
                          e.preventDefault();
                          setExpanded(expanded === item.name ? null : item.name);
                        }
                      }}
                      className={cn(
                        "flex items-center gap-2 px-4 py-2 text-xs transition-colors border-l-2",
                        active
                          ? "bg-sage/10 text-sage border-sage font-medium"
                          : "text-fg-2 border-transparent hover:bg-bg-3 hover:text-fg"
                      )}
                    >
                      <item.icon size={15} className="shrink-0" />
                      <span>{item.name}</span>
                      {badge !== undefined && (
                        <span
                          className={cn(
                            "ml-auto text-[10px] font-medium px-2 py-px rounded-full",
                            urgent ? "bg-red-500/10 text-red-400" : "bg-sage/10 text-sage"
                          )}
                        >
                          {badge}
                        </span>
                      )}
                      {item.children && (
                        <ChevronDown
                          size={12}
                          className={cn(
                            "ml-auto transition-transform",
                            expanded === item.name ? "" : "-rotate-90",
                            badge !== undefined && "ml-1"
                          )}
                        />
                      )}
                    </Link>
                    {item.children && expanded === item.name && (
                      <div className="pl-10 pb-1">
                        {item.children.map((sub) => (
                          <Link
                            key={sub.slug}
                            href={`${item.href}?section=${sub.slug}`}
                            className="block py-1 text-[11px] text-fg-3 hover:text-sage transition-colors"
                          >
                            {sub.label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
          </div>
        ))}
      </div>

      <div className="px-4 py-3 border-t border-border shrink-0">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-8 h-8 rounded-full bg-sage/10 flex items-center justify-center text-xs font-medium text-sage">
            {userName.charAt(0).toUpperCase()}
          </div>
          <div className="min-w-0">
            <div className="text-xs font-medium truncate">{userName}</div>
            <div className="text-[11px] text-fg-3">{roleLabel(role)}</div>
          </div>
        </div>
        <button
          type="button"
          onClick={() => signOut({ callbackUrl: "/admin/login" })}
          className="flex items-center gap-2 text-xs text-red-400 hover:opacity-70 transition-opacity"
        >
          <LogOut size={14} />
          Log out
        </button>
      </div>
    </aside>
  );
}
