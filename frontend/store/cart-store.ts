"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { ProductSlug } from "@/config/products";

export type CartItem = {
  lineId: string;
  productId: ProductSlug;
  sku: string;
  arabicName: string;
  quantity: number;
  source: "product_page" | "cart_cross_sell" | "thank_you_cross_sell" | "upsell";
  isUpsell: boolean;
  upsellUnitPrice?: number;
};

export type CartStep = "cart" | "checkout";

type CartStore = {
  items: CartItem[];
  isOpen: boolean;
  step: CartStep;
  openCart: () => void;
  openCheckout: () => void;
  goToCheckout: () => void;
  backToCart: () => void;
  closeCart: () => void;
  addItem: (item: Omit<CartItem, "lineId">) => void;
  removeItem: (lineId: string) => void;
  updateQuantity: (lineId: string, quantity: number) => void;
  clearCart: () => void;
  hasProduct: (productId: ProductSlug) => boolean;
};

function generateLineId(): string {
  return `line_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      step: "cart",

      openCart: () => set({ isOpen: true, step: "cart" }),
      openCheckout: () => set({ isOpen: true, step: "checkout" }),
      goToCheckout: () => set({ step: "checkout" }),
      backToCart: () => set({ step: "cart" }),
      closeCart: () => set({ isOpen: false }),

      addItem: (item) => {
        const { items } = get();

        if (!item.isUpsell) {
          const existing = items.find(
            (i) => i.productId === item.productId && !i.isUpsell
          );
          if (existing) {
            set({
              items: items.map((i) =>
                i.lineId === existing.lineId
                  ? { ...i, quantity: i.quantity + item.quantity }
                  : i
              ),
            });
            return;
          }
        }

        set({
          items: [...items, { ...item, lineId: generateLineId() }],
        });
      },

      removeItem: (lineId) => {
        set({ items: get().items.filter((i) => i.lineId !== lineId) });
      },

      updateQuantity: (lineId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(lineId);
          return;
        }
        set({
          items: get().items.map((i) =>
            i.lineId === lineId ? { ...i, quantity } : i
          ),
        });
      },

      clearCart: () => set({ items: [], step: "cart" }),

      hasProduct: (productId) => {
        return get().items.some((i) => i.productId === productId && !i.isUpsell);
      },
    }),
    {
      name: "hnina-cart",
      partialize: (state) => ({ items: state.items }),
    }
  )
);
