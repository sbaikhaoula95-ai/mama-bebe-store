"use client";

import { useState } from "react";
import { OFFER_TIERS } from "@/config/offers";
import type { Product } from "@/config/products";
import { useCartStore } from "@/store/cart-store";
import { cn } from "@/lib/utils";

type OfferSelectorProps = {
  product: Product;
  className?: string;
};

export function OfferSelector({ product, className }: OfferSelectorProps) {
  const [selectedTier, setSelectedTier] = useState(0);
  const { addItem, openCheckout } = useCartStore();

  const tier = OFFER_TIERS[selectedTier];

  function handleBuyNow() {
    addItem({
      productId: product.slug,
      sku: product.sku,
      arabicName: product.arabicName,
      quantity: tier.quantity,
      source: "product_page",
      isUpsell: false,
    });
    openCheckout();
  }

  return (
    <div className={cn("flex flex-col gap-5", className)}>
      {/* Offer tiers */}
      <div>
        <p className="font-semibold text-ink mb-3">اختاري العرض:</p>
        <div className="flex flex-col gap-3">
          {OFFER_TIERS.map((t, idx) => (
            <button
              key={t.quantity}
              onClick={() => setSelectedTier(idx)}
              className={cn(
                "offer-tier-card flex items-center justify-between text-right",
                idx === selectedTier ? "selected" : ""
              )}
              aria-pressed={idx === selectedTier}
            >
              <div className="flex items-center gap-3">
                <div
                  className={cn(
                    "w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0",
                    idx === selectedTier
                      ? "border-forest bg-forest"
                      : "border-ink/30"
                  )}
                  aria-hidden="true"
                >
                  {idx === selectedTier && (
                    <div className="w-2 h-2 bg-white rounded-full" />
                  )}
                </div>
                <div className="text-right">
                  <p className="font-bold text-ink">
                    {t.quantity === 1
                      ? "قطعة واحدة"
                      : t.quantity === 2
                      ? "قطعتان"
                      : "ثلاث قطع"}
                  </p>
                  <p className="text-ink/60 text-sm">{t.label}</p>
                </div>
              </div>
              <div className="text-left flex flex-col items-end gap-1">
                <p className="font-bold text-forest text-lg">{t.total} درهم</p>
                {t.badge && (
                  <span className="badge-gold text-xs">{t.badge}</span>
                )}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* COD note */}
      <div className="bg-sage/10 rounded-2xl p-4 text-sm text-ink/70">
        <p className="font-medium text-ink mb-1">💵 الدفع عند الاستلام</p>
        <p>ما تخلصي والو دابا. كنعيطو ليك نأكدو الطلب والعنوان، وكتخلصي حتى توصلك السلعة.</p>
      </div>

      {/* CTA */}
      <button
        onClick={handleBuyNow}
        className="btn-primary w-full text-xl py-5"
      >
        اشتري الآن — {tier.total} درهم
      </button>

      {/* Scarcity */}
      <p className="text-center text-danger text-sm font-medium">
        🔥 دفعة صغيرة من الزيوت الطبيعية — الكمية محدودة حسب توفر المكونات
      </p>
    </div>
  );
}
