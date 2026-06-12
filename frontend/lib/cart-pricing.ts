import type { CartItem } from "@/store/cart-store";
import type { ProductSlug } from "@/config/products";
import { FREE_DELIVERY_THRESHOLD, UPSELL_PRICE } from "@/config/offers";

export type CartTotals = {
  subtotal: number;
  deliveryFee: number;
  total: number;
  currency: "MAD";
  isFreeDelivery: boolean;
  nonUpsellQty: number;
  upsellTotal: number;
  nonUpsellTotal: number;
};

/**
 * Offer ladder pricing for non-upsell items (by total quantity across all products).
 * 1 item = 199
 * 2 items = 299
 * 3 items = 399
 * 4+ = 399 + 199 per extra item
 */
export function ladderPrice(qty: number): number {
  if (qty <= 0) return 0;
  if (qty === 1) return 199;
  if (qty === 2) return 299;
  if (qty === 3) return 399;
  return 399 + 199 * (qty - 3);
}

/**
 * Calculate unit price per item within the ladder.
 * Used for per-item display in cart.
 */
export function unitPriceFromLadder(qty: number): number {
  if (qty <= 0) return 0;
  return ladderPrice(qty) / qty;
}

/**
 * Calculate full cart totals.
 * Non-upsell items are priced together by total quantity.
 * Upsell items are always 99 MAD each and do not affect the ladder.
 */
export function calculateCartTotals(items: CartItem[]): CartTotals {
  const nonUpsellItems = items.filter((i) => !i.isUpsell);
  const upsellItems = items.filter((i) => i.isUpsell);

  const nonUpsellQty = nonUpsellItems.reduce((sum, i) => sum + i.quantity, 0);
  const nonUpsellTotal = ladderPrice(nonUpsellQty);
  const upsellTotal = upsellItems.reduce(
    (sum, i) => sum + UPSELL_PRICE * i.quantity,
    0
  );

  const subtotal = nonUpsellTotal + upsellTotal;
  const isFreeDelivery = subtotal >= FREE_DELIVERY_THRESHOLD;
  const deliveryFee = isFreeDelivery ? 0 : 35;
  const total = subtotal + deliveryFee;

  return {
    subtotal,
    deliveryFee,
    total,
    currency: "MAD",
    isFreeDelivery,
    nonUpsellQty,
    upsellTotal,
    nonUpsellTotal,
  };
}

/**
 * Get effective unit price for a non-upsell cart item.
 * Based on total non-upsell quantity in the cart.
 */
export function getEffectiveUnitPrice(
  items: CartItem[],
  itemProductId: string
): number {
  const nonUpsellItems = items.filter((i) => !i.isUpsell);
  const totalQty = nonUpsellItems.reduce((sum, i) => sum + i.quantity, 0);
  return unitPriceFromLadder(totalQty);
}

/**
 * Determine which upsell product to show based on cart contents.
 * Returns null if no upsell is applicable.
 */
export function getRecommendedUpsell(
  items: CartItem[]
): ProductSlug | null {
  const nonUpsellItems = items.filter((i) => !i.isUpsell);
  const cartSlugs = new Set(nonUpsellItems.map((i) => i.productId));

  const hasMama = cartSlugs.has("hnina-mama");
  const hasJodour = cartSlugs.has("hnina-jodour");
  const hasCalm = cartSlugs.has("hnina-calm");

  if (hasMama && hasJodour && hasCalm) {
    return "hnina-mama";
  }
  if (hasMama && hasJodour) return "hnina-calm";
  if (hasMama && hasCalm) return "hnina-jodour";
  if (hasJodour && hasCalm) return "hnina-mama";
  if (hasMama) return "hnina-jodour";
  if (hasJodour) return "hnina-mama";
  if (hasCalm) return "hnina-jodour";
  return "hnina-jodour";
}
