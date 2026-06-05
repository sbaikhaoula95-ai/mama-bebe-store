"use client";

import { useCartStore, type CartItem } from "@/store/cart-store";
import { PlaceholderImage } from "@/components/brand/PlaceholderImage";
import { PRODUCTS } from "@/config/products";
import { ladderPrice } from "@/lib/cart-pricing";
import { UPSELL_PRICE } from "@/config/offers";

type CartLineItemProps = {
  item: CartItem;
  allItems: CartItem[];
};

export function CartLineItem({ item, allItems }: CartLineItemProps) {
  const { updateQuantity, removeItem } = useCartStore();
  const product = PRODUCTS[item.productId];

  const nonUpsellQty = allItems
    .filter((i) => !i.isUpsell)
    .reduce((s, i) => s + i.quantity, 0);

  const lineTotal = item.isUpsell
    ? UPSELL_PRICE * item.quantity
    : (() => {
        const totalNonUpsell = ladderPrice(nonUpsellQty);
        const itemShare =
          nonUpsellQty > 0 ? item.quantity / nonUpsellQty : 0;
        return Math.round(totalNonUpsell * itemShare);
      })();

  return (
    <div className="flex items-start gap-3 bg-white rounded-2xl p-3 border border-ink/10">
      <div className="w-16 h-16 flex-shrink-0 rounded-xl overflow-hidden">
        <PlaceholderImage
          imageKey={product?.heroImageKey || "product-hnina-mama-hero"}
          alt={item.arabicName}
          aspectRatio="square"
          className="rounded-xl"
        />
      </div>

      <div className="flex-1 min-w-0">
        <p className="font-semibold text-ink text-sm leading-snug line-clamp-2">
          {item.arabicName}
        </p>
        {item.isUpsell && (
          <span className="inline-block bg-gold/15 text-gold text-xs font-bold px-2 py-0.5 rounded-full mt-1">
            عرض خاص
          </span>
        )}
        <p className="text-forest font-bold text-sm mt-1">{lineTotal} درهم</p>
      </div>

      <div className="flex flex-col items-end gap-2">
        {!item.isUpsell ? (
          <div className="flex items-center gap-2 bg-cream rounded-full border border-ink/10">
            <button
              onClick={() => updateQuantity(item.lineId, item.quantity - 1)}
              className="w-7 h-7 flex items-center justify-center rounded-full text-ink hover:bg-sage/20 transition-colors font-bold"
              aria-label="تقليل الكمية"
            >
              −
            </button>
            <span className="w-5 text-center text-sm font-bold text-ink">
              {item.quantity}
            </span>
            <button
              onClick={() => updateQuantity(item.lineId, item.quantity + 1)}
              className="w-7 h-7 flex items-center justify-center rounded-full text-ink hover:bg-sage/20 transition-colors font-bold"
              aria-label="زيادة الكمية"
            >
              +
            </button>
          </div>
        ) : (
          <span className="text-xs text-ink/50 font-medium">كمية 1</span>
        )}
        <button
          onClick={() => removeItem(item.lineId)}
          className="text-ink/30 hover:text-danger transition-colors"
          aria-label="إزالة المنتج"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>
    </div>
  );
}
