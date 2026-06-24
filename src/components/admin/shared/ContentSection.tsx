"use client";

import { useState, type ReactNode } from "react";
import { ChevronDown } from "lucide-react";

type Props = {
  id?: string;
  icon?: ReactNode;
  title: string;
  subtitle?: string;
  defaultOpen?: boolean;
  children: ReactNode;
};

export default function ContentSection({
  id,
  icon,
  title,
  subtitle,
  defaultOpen = false,
  children,
}: Props) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div id={id} className="border border-border rounded-lg mb-3 overflow-hidden scroll-mt-24">
      <button
        type="button"
        className="flex w-full items-center justify-between px-4 py-3 hover:bg-bg-3 transition-colors text-left"
        onClick={() => setOpen(!open)}
      >
        <div className="flex items-center gap-2 min-w-0">
          {icon && <span className="text-sage shrink-0">{icon}</span>}
          <span className="text-sm font-medium">{title}</span>
          {subtitle && <span className="text-xs text-fg-3 truncate hidden sm:inline">{subtitle}</span>}
        </div>
        <ChevronDown
          className={`w-4 h-4 text-fg-3 shrink-0 transition-transform ${open ? "" : "-rotate-90"}`}
        />
      </button>
      {open && <div className="px-4 py-4 border-t border-border space-y-4">{children}</div>}
    </div>
  );
}
