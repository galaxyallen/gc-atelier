"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

export default function Accordion({
  items,
}: {
  items: { question: string; answer: string }[];
}) {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <div className="divide-y divide-border">
      {items.map((item, i) => (
        <div key={i}>
          <button
            type="button"
            onClick={() => setOpen(open === i ? null : i)}
            className="w-full flex items-center justify-between py-6 text-left"
          >
            <span className="text-[15px] font-normal pr-4">{item.question}</span>
            <ChevronDown
              size={18}
              className={cn(
                "text-sage shrink-0 transition-transform duration-300",
                open === i && "rotate-180"
              )}
            />
          </button>
          <div
            className={cn(
              "overflow-hidden transition-all duration-300",
              open === i ? "max-h-96 pb-6" : "max-h-0"
            )}
          >
            <p className="text-[15px] text-fg-2 leading-relaxed">{item.answer}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
