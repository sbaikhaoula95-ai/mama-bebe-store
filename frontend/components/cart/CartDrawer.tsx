"use client";

import { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useCartStore } from "@/store/cart-store";
import { CartLineItem } from "./CartLineItem";
import { CartTotals } from "./CartTotals";
import { PRODUCTS_LIST } from "@/config/products";
import { calculateCartTotals } from "@/lib/cart-pricing";
import { FREE_DELIVERY_THRESHOLD } from "@/config/offers";
import { PlaceholderImage } from "@/components/brand/PlaceholderImage";

export function CartDrawer() {
  const { items, isDrawerOpen, closeDrawer, openCheckout, addItem } = useCartStore();
  const overlayRef = useRef<HTMLDivElement>(null);

  const totals = calculateCartTotals(items);
  const nonUpsellItems = items.filter((i) => !i.isUpsell);
  const cartProductIds = new Set(nonUpsellItems.map((i) => i.productId));
  const crossSellProducts = PRODUCTS_LIST.filter(
    (p) => !cartProductIds.has(p.slug)
  ).slice(0, 2);

  const progressPct = Math.min(
    (totals.subtotal / FREE_DELIVERY_THRESHOLD) * 100,
    100
  );
  const amountToFreeDelivery = Math.max(
    FREE_DELIVERY_THRESHOLD - totals.subtotal,
    0
  );

  useEffect(() => {
    if (isDrawerOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isDrawerOpen]);

  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") closeDrawer();
    }
    if (isDrawerOpen) window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [isDrawerOpen, closeDrawer]);

  function handleCheckout() {
    openCheckout();
  }

  return (
    <AnimatePresence>
      {isDrawerOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="drawer-overlay"
            onClick={closeDrawer}
            aria-hidden="true"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed inset-y-0 right-0 z-50 w-full max-w-sm bg-cream flex flex-col shadow-2xl md:right-auto md:left-0 md:w-[420px]"
            role="dialog"
            aria-modal="true"
            aria-label="سلة التسوق"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b border-ink/10">
              <button
                onClick={closeDrawer}
                className="p-2 rounded-xl hover:bg-sage/10 transition-colors"
                aria-label="إغلاق السلة"
              >
                <svg
                  className="w-5 h-5 text-ink"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              <h2 className="font-bold text-xl text-ink">
                سلتك{" "}
                {items.length > 0 && (
                  <span className="text-forest">
                    ({items.reduce((s, i) => s + i.quantity, 0)})
                  </span>
                )}
              </h2>
            </div>

            {/* Trust row */}
            <div className="flex items-center justify-center gap-4 px-5 py-3 bg-forest/5 border-b border-ink/5 text-xs text-forest font-medium">
              <span>💵 الدفع عند الاستلام</span>
              <span>·</span>
              <span>🚀 توصيل 24-48 ساعة</span>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-64 gap-4 text-ink/50">
                  <svg
                    className="w-16 h-16 text-ink/20"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                    />
                  </svg>
                  <p className="font-medium">سلتك فارغة</p>
                  <button
                    onClick={closeDrawer}
                    className="btn-secondary text-sm px-6 py-2"
                  >
                    تسوقي الآن
                  </button>
                </div>
              ) : (
                <div className="p-5 flex flex-col gap-5">
                  {/* Cart items */}
                  <div className="flex flex-col gap-3">
                    {items.map((item) => (
                      <CartLineItem
                        key={item.lineId}
                        item={item}
                        allItems={items}
                      />
                    ))}
                  </div>

                  {/* Free delivery progress */}
                  {!totals.isFreeDelivery && (
                    <div className="bg-sage/10 rounded-2xl p-4">
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-forest font-medium">
                          زيدي{" "}
                          <strong>{amountToFreeDelivery} درهم</strong> واستافدي
                          من التوصيل المجاني
                        </span>
                      </div>
                      <div className="h-2 bg-ink/10 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-forest rounded-full transition-all duration-500"
                          style={{ width: `${progressPct}%` }}
                        />
                      </div>
                    </div>
                  )}

                  {totals.isFreeDelivery && (
                    <div className="bg-forest/10 rounded-2xl p-4 text-center text-forest font-medium text-sm">
                      🎉 مبروك! التوصيل مجاني لطلبك
                    </div>
                  )}

                  {/* Cross-sells */}
                  {crossSellProducts.length > 0 && (
                    <div>
                      <h3 className="font-bold text-ink mb-3 text-base">
                        كملي روتين حنينة
                      </h3>
                      <div className="flex flex-col gap-3">
                        {crossSellProducts.map((product) => (
                          <div
                            key={product.slug}
                            className="flex items-center gap-3 bg-white rounded-2xl p-3 border border-ink/10"
                          >
                            <div className="w-16 h-16 flex-shrink-0 rounded-xl overflow-hidden">
                              <PlaceholderImage
                                imageKey={product.heroImageKey}
                                alt={product.arabicName}
                                aspectRatio="square"
                                className="rounded-xl"
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-semibold text-ink text-sm leading-snug whitespace-pre-line">
                                {product.shortHeading}
                              </p>
                              <p className="text-forest font-bold text-sm">
                                199 درهم
                              </p>
                            </div>
                            <button
                              onClick={() => {
                                addItem({
                                  productId: product.slug,
                                  sku: product.sku,
                                  arabicName: product.arabicName,
                                  quantity: 1,
                                  source: "cart_cross_sell",
                                  isUpsell: false,
                                });
                                openCheckout();
                              }}
                              className="flex-shrink-0 bg-forest text-cream text-xs font-bold px-3 py-1.5 rounded-full hover:bg-ink transition-colors"
                            >
                              اشتري الآن
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Totals */}
                  <CartTotals totals={totals} />
                </div>
              )}
            </div>

            {/* Sticky checkout CTA */}
            {items.length > 0 && (
              <div className="p-5 border-t border-ink/10 bg-cream">
                <button
                  onClick={handleCheckout}
                  className="btn-primary w-full text-xl py-5"
                >
                  تأكيد الطلب — {totals.total} درهم
                </button>
                <p className="text-center text-ink/50 text-xs mt-2">
                  الدفع عند الاستلام · لا حاجة لبطاقة بنكية
                </p>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
