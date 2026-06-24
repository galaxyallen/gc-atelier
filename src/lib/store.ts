import { create } from "zustand";

export interface CartItem {
  id: string;
  name: string;
  price: number;
}

interface CartStore {
  items: CartItem[];
  isOpen: boolean;
  add: (item: CartItem) => void;
  remove: (index: number) => void;
  clear: () => void;
  toggle: () => void;
  setOpen: (open: boolean) => void;
  count: () => number;
  total: () => number;
}

export const useCartStore = create<CartStore>((set, get) => ({
  items: [],
  isOpen: false,
  add: (item) => set((s) => ({ items: [...s.items, item] })),
  remove: (i) => set((s) => ({ items: s.items.filter((_, idx) => idx !== i) })),
  clear: () => set({ items: [] }),
  toggle: () => set((s) => ({ isOpen: !s.isOpen })),
  setOpen: (open) => set({ isOpen: open }),
  count: () => get().items.length,
  total: () => get().items.reduce((sum, i) => sum + i.price, 0),
}));
