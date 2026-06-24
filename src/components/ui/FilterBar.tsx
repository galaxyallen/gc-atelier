"use client";

import { cn } from "@/lib/utils";

interface FilterBarProps {
  groups: {
    label?: string;
    options: { value: string; label: string }[];
  }[];
  active: string;
  onChange: (value: string) => void;
}

export default function FilterBar({ groups, active, onChange }: FilterBarProps) {
  return (
    <div className="flex items-center gap-3 flex-wrap">
      {groups.map((group, gi) => (
        <div key={gi} className="flex items-center gap-3 flex-wrap">
          {gi > 0 && <div className="w-px h-5 bg-border-2 mx-2" />}
          {group.label && (
            <span className="text-[10px] tracking-widest text-fg-4 uppercase mr-1">
              {group.label}
            </span>
          )}
          {group.options.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => onChange(opt.value)}
              className={cn(
                "text-xs tracking-wide px-5 py-2 rounded-full border transition-all",
                active === opt.value
                  ? "bg-sage text-bg border-sage"
                  : "text-fg-3 border-border hover:text-fg hover:border-border-2"
              )}
            >
              {opt.label}
            </button>
          ))}
        </div>
      ))}
    </div>
  );
}
