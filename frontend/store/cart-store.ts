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

type CartStore = {
  items: CartItem[];
  isDrawerOpen: boolean;
  isCheckoutOpen: boolean;
  openDrawer: () => void;
  closeDrawer: () => void;
  openCheckout: () => void;
  closeCheckout: () => void;
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
      isDrawerOpen: false,
      isCheckoutOpen: false,

      openDrawer: () => set({ isDrawerOpen: true }),
      closeDrawer: () => set({ isDrawerOpen: false }),
      openCheckout: () => set({ isCheckoutOpen: true, isDrawerOpen: false }),
      closeCheckout: () => set({ isCheckoutOpen: false }),

      addItem: (item) => {
        const { items } = get();

        // For non-upsell items, merge with existing item of same product
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

      clearCart: () => set({ items: [] }),

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
