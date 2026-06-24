"use client";

import { Plus, Trash2 } from "lucide-react";
import type { ReactNode } from "react";

type Props<T> = {
  items: T[];
  onChange: (items: T[]) => void;
  renderItem: (item: T, index: number, update: (patch: Partial<T>) => void) => ReactNode;
  createItem: () => T;
  minItems?: number;
};

export default function DynamicList<T>({
  items,
  onChange,
  renderItem,
  createItem,
  minItems = 0,
}: Props<T>) {
  const updateAt = (index: number, patch: Partial<T>) => {
    const next = [...items];
    next[index] = { ...next[index], ...patch };
    onChange(next);
  };

  const removeAt = (index: number) => {
    if (items.length <= minItems) return;
    onChange(items.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-3">
      {items.map((item, i) => (
        <div key={i} className="flex gap-2 items-start p-3 bg-bg-3 rounded border border-border">
          <div className="flex-1 min-w-0">{renderItem(item, i, (patch) => updateAt(i, patch))}</div>
          {items.length > minItems && (
            <button
              type="button"
              onClick={() => removeAt(i)}
              className="p-2 text-fg-3 hover:text-red-400 shrink-0"
            >
              <Trash2 size={14} />
            </button>
          )}
        </div>
      ))}
      <button
        type="button"
        onClick={() => onChange([...items, createItem()])}
        className="flex items-center gap-2 text-xs text-sage hover:text-sage-light"
      >
        <Plus size={14} />
        Add item
      </button>
    </div>
  );
}
