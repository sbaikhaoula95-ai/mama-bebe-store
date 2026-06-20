"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useCartStore } from "@/store/cart-store";
import { CartLineItem } from "./CartLineItem";
import { CartTotals } from "./CartTotals";
import { UpsellModal } from "./UpsellModal";
import { PRODUCTS_LIST, PRODUCTS } from "@/config/products";
import { calculateCartTotals, getRecommendedUpsell } from "@/lib/cart-pricing";
import { FREE_DELIVERY_THRESHOLD, UPSELL_PRICE } from "@/config/offers";
import { PlaceholderImage } from "@/components/brand/PlaceholderImage";
import { MOROCCAN_PHONE_REGEX } from "@/lib/phone";
import { generateEventId } from "@/lib/event-id";
import { getUTMParams, getClickIds, getCookieValue } from "@/lib/utm";
import { createOrder } from "@/lib/api";
import { sendOrderToSheet } from "@/lib/sheet-webhook";
import {
  trackInitiateCheckout,
  trackPurchase,
} from "@/lib/tracking-client";
import { cn } from "@/lib/utils";

const checkoutSchema = z
  .object({
    fullName: z.string().min(3, "الاسم يجب أن يكون 3 أحرف على الأقل"),
    phone: z
      .string()
      .regex(MOROCCAN_PHONE_REGEX, "دخلي رقم هاتف مغربي صحيح كيبدأ ب 06 أو 07"),
    phoneConfirm: z
      .string()
      .regex(MOROCCAN_PHONE_REGEX, "دخلي رقم هاتف مغربي صحيح كيبدأ ب 06 أو 07"),
    city: z.string().min(2, "المدينة ضرورية"),
    honeypot: z.string().max(0, "").optional(),
  })
  .refine((data) => data.phone === data.phoneConfirm, {
    message: "الرقمين ما متطابقينش",
    path: ["phoneConfirm"],
  });

type CheckoutFormData = z.infer<typeof checkoutSchema>;

export function CartDrawer() {
  const {
    items,
    isOpen,
    step,
    closeCart,
    openCart,
    goToCheckout,
    backToCart,
    addItem,
    clearCart,
  } = useCartStore();

  const [showUpsell, setShowUpsell] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState("");
  const [formData, setFormData] = useState<CheckoutFormData | null>(null);
  const [eventId, setEventId] = useState<string>("");
  const checkoutTrackedRef = useRef(false);

  const totals = calculateCartTotals(items);
  const upsellProductId = getRecommendedUpsell(items);
  const upsellProduct = upsellProductId ? PRODUCTS[upsellProductId] : null;

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

  const {
    register,
    handleSubmit,
    setFocus,
    formState: { errors },
  } = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
    mode: "onSubmit",
    reValidateMode: "onChange",
  });

  // Lock body scroll while drawer open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Track InitiateCheckout once per checkout-step entry
  useEffect(() => {
    if (isOpen && step === "checkout" && !checkoutTrackedRef.current) {
      checkoutTrackedRef.current = true;
      const id = generateEventId("order");
      setEventId(id);
      trackInitiateCheckout(
        totals.total,
        items.reduce((s, i) => s + i.quantity, 0),
        generateEventId("checkout")
      );
    }
    if (!isOpen || step !== "checkout") {
      checkoutTrackedRef.current = false;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, step]);

  // Esc closes drawer (only when no upsell open)
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape" && !showUpsell) {
        if (step === "checkout") {
          backToCart();
        } else {
          closeCart();
        }
      }
    }
    if (isOpen) window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [isOpen, step, showUpsell, closeCart, backToCart]);

  // Auto-fallback to cart step if items empty while in checkout
  useEffect(() => {
    if (isOpen && step === "checkout" && items.length === 0 && !showUpsell) {
      backToCart();
    }
  }, [isOpen, step, items.length, showUpsell, backToCart]);

  function onValidSubmit(data: CheckoutFormData) {
    setFormData(data);
    setShowUpsell(true);
  }

  function onInvalidSubmit(errs: Record<string, unknown>) {
    const firstField = Object.keys(errs)[0] as keyof CheckoutFormData | undefined;
    if (firstField) {
      try {
        setFocus(firstField);
      } catch {
        // ignore
      }
      const el = document.getElementById(firstField);
      if (el && typeof el.scrollIntoView === "function") {
        el.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }
  }

  async function finalizeOrder(upsellAccepted: boolean) {
    if (!formData) return;
    setIsSubmitting(true);
    setFormError("");

    try {
      const totalNonUpsellQty = nonUpsellItems.reduce(
        (s, i) => s + i.quantity,
        0
      );

      const orderItems = nonUpsellItems.map((item) => {
        const unitPrice =
          totalNonUpsellQty > 0
            ? totals.nonUpsellTotal / totalNonUpsellQty
            : 199;
        return {
          productId: item.productId,
          sku: item.sku,
          name: item.arabicName,
          quantity: item.quantity,
          unitPrice: Math.round(unitPrice * 100) / 100,
          lineTotal: Math.round(unitPrice * item.quantity * 100) / 100,
          isUpsell: false,
          source: item.source,
        };
      });

      if (upsellAccepted && upsellProduct) {
        orderItems.push({
          productId: upsellProduct.slug,
          sku: upsellProduct.sku,
          name: upsellProduct.arabicName,
          quantity: 1,
          unitPrice: UPSELL_PRICE,
          lineTotal: UPSELL_PRICE,
          isUpsell: true,
          source: "upsell",
        });
      }

      const finalTotal = upsellAccepted
        ? totals.total + UPSELL_PRICE
        : totals.total;

      const utm = getUTMParams();
      const clickIds = getClickIds();
      const orderEventId = eventId || generateEventId("order");

      const payload = {
        customer: {
          fullName: formData.fullName,
          phone: formData.phone,
          phoneConfirm: formData.phoneConfirm,
          city: formData.city,
          address: "سيتم تأكيد العنوان عبر الهاتف",
        },
        items: orderItems,
        upsell: {
          shown: !!upsellProduct,
          accepted: upsellAccepted,
          productId: upsellProduct?.slug,
          price: upsellAccepted ? 99 : undefined,
        },
        totals: {
          subtotal: upsellAccepted
            ? totals.subtotal + UPSELL_PRICE
            : totals.subtotal,
          deliveryFee: totals.deliveryFee,
          total: finalTotal,
          currency: "MAD" as const,
        },
        attribution: {
          sourcePage: window.location.href,
          landingPage: window.location.href,
          referrer: document.referrer || "",
          ...utm,
        },
        tracking: {
          eventId: orderEventId,
          fbp: getCookieValue("_fbp"),
          fbc: getCookieValue("_fbc"),
          ttp: getCookieValue("_ttp"),
          scid: getCookieValue("_scid"),
          fbclid: clickIds.fbclid,
          ttclid: clickIds.ttclid,
          scClickId: clickIds.scClickId,
        },
      };

      const response = await createOrder(payload);

      // Belt-and-suspenders: also POST directly from the browser to the
      // Google Apps Script Sheet webhook so the row arrives even if the
      // backend's SHEET_WEBHOOK_URL is missing or its deployment lags.
      // Never throws — the order itself must not be blocked by Sheets.
      sendOrderToSheet({
        orderNumber: response.orderNumber,
        customerName: formData.fullName,
        phone: formData.phone,
        city: formData.city,
        totalPrice: finalTotal,
        items: orderItems.map((i) => ({
          sku: i.sku,
          arabicName: i.name,
          quantity: i.quantity,
        })),
      }).then((result) => {
        if (!result.success && result.error !== "not_configured") {
          console.warn("Direct sheet webhook failed:", result.error);
        }
      });

      trackPurchase(
        {
          orderId: response.orderId,
          total: finalTotal,
          items: orderItems.map((i) => ({
            sku: i.sku,
            quantity: i.quantity,
            unitPrice: i.unitPrice,
          })),
        },
        orderEventId
      );

      sessionStorage.setItem(
        "hnina_order",
        JSON.stringify({
          orderId: response.orderId,
          orderNumber: response.orderNumber,
          customerName: formData.fullName,
          phone: formData.phone,
          city: formData.city,
          items: orderItems,
          totals: payload.totals,
          upsellAccepted,
        })
      );

      // Close everything cleanly BEFORE navigation so UI is fully reset
      setShowUpsell(false);
      setIsSubmitting(false);
      setFormData(null);
      clearCart();
      closeCart();

      window.location.href = `/merci?orderId=${response.orderId}`;
    } catch (err) {
      setFormError(
        err instanceof Error
          ? err.message
          : "وقع مشكل مؤقت، عاودي حاولي بعد لحظات."
      );
      setShowUpsell(false);
      setIsSubmitting(false);
    }
  }

  const isCart = step === "cart";
  const isCheckout = step === "checkout";

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Single overlay for the whole flow */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-ink/50 z-40 backdrop-blur-sm"
              onClick={() => {
                if (showUpsell) return;
                if (isCheckout) {
                  backToCart();
                } else {
                  closeCart();
                }
              }}
              aria-hidden="true"
            />

            {/* Single panel with internal step transitions */}
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 32, stiffness: 320 }}
              className={cn(
                "fixed inset-y-0 right-0 z-50 w-full bg-cream flex flex-col shadow-2xl",
                "max-w-full sm:max-w-md md:right-auto md:left-0 md:w-[460px]"
              )}
              role="dialog"
              aria-modal="true"
              aria-label={isCart ? "سلة التسوق" : "تأكيد الطلب"}
            >
              {/* Header */}
              <div className="flex items-center justify-between gap-3 p-4 sm:p-5 border-b border-ink/10 bg-cream">
                <button
                  onClick={closeCart}
                  className="p-2 rounded-xl hover:bg-sage/10 transition-colors flex-shrink-0"
                  aria-label="إغلاق"
                >
                  <svg
                    className="w-5 h-5 text-ink"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>

                <div className="flex-1 text-right min-w-0">
                  {isCart ? (
                    <h2 className="font-bold text-lg sm:text-xl text-ink truncate">
                      سلتك{" "}
                      {items.length > 0 && (
                        <span className="text-forest">
                          ({items.reduce((s, i) => s + i.quantity, 0)})
                        </span>
                      )}
                    </h2>
                  ) : (
                    <>
                      <h2 className="font-bold text-lg sm:text-xl text-ink truncate">
                        أكدي طلبك فدقيقة
                      </h2>
                      <p className="text-ink/60 text-xs sm:text-sm mt-0.5 truncate">
                        ما تخلصي والو دابا
                      </p>
                    </>
                  )}
                </div>

                {isCheckout && (
                  <button
                    onClick={backToCart}
                    className="text-forest text-sm font-bold hover:underline flex-shrink-0"
                    aria-label="رجوع للسلة"
                  >
                    رجوع
                  </button>
                )}
              </div>

              {/* Trust strip */}
              <div className="flex items-center justify-center gap-3 sm:gap-4 px-4 py-2.5 bg-forest/5 border-b border-ink/5 text-[11px] sm:text-xs text-forest font-medium">
                <span>💵 الدفع عند الاستلام</span>
                <span>·</span>
                <span>🚀 24-48 ساعة</span>
              </div>

              {/* Body — animated step swap */}
              <div className="flex-1 overflow-y-auto overscroll-contain">
                <AnimatePresence mode="wait" initial={false}>
                  {isCart ? (
                    <motion.div
                      key="cart"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.18 }}
                    >
                      {items.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-64 gap-4 text-ink/50 px-5">
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
                            onClick={closeCart}
                            className="btn-secondary text-sm px-6 py-2"
                          >
                            تسوقي الآن
                          </button>
                        </div>
                      ) : (
                        <div className="p-4 sm:p-5 flex flex-col gap-5">
                          <div className="flex flex-col gap-3">
                            {items.map((item) => (
                              <CartLineItem
                                key={item.lineId}
                                item={item}
                                allItems={items}
                              />
                            ))}
                          </div>

                          {!totals.isFreeDelivery && (
                            <div className="bg-sage/10 rounded-2xl p-4">
                              <div className="flex justify-between text-sm mb-2">
                                <span className="text-forest font-medium">
                                  زيدي{" "}
                                  <strong>{amountToFreeDelivery} درهم</strong>{" "}
                                  واستافدي من التوصيل المجاني
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
                                      <p className="font-semibold text-ink text-sm leading-snug break-words">
                                        {product.shortHeading.replace(
                                          /\n/g,
                                          " "
                                        )}
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
                                      }}
                                      className="flex-shrink-0 bg-forest text-cream text-xs font-bold px-3 py-1.5 rounded-full hover:bg-ink transition-colors"
                                    >
                                      زيدي
                                    </button>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          <CartTotals totals={totals} />
                        </div>
                      )}
                    </motion.div>
                  ) : (
                    <motion.div
                      key="checkout"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ duration: 0.18 }}
                      className="p-4 sm:p-5 flex flex-col gap-5"
                    >
                      {/* Order summary */}
                      <div className="bg-white rounded-2xl p-4 border border-ink/10">
                        <h3 className="font-bold text-ink mb-3">ملخص الطلب</h3>
                        <div className="flex flex-col gap-2 text-sm">
                          {items.map((item) => (
                            <div
                              key={item.lineId}
                              className="flex justify-between gap-3"
                            >
                              <span className="text-ink/70 text-right leading-snug break-words">
                                {item.arabicName} × {item.quantity}
                              </span>
                            </div>
                          ))}
                        </div>
                        <div className="mt-3 pt-3 border-t border-ink/10">
                          <CartTotals totals={totals} />
                        </div>
                      </div>

                      {/* Trust chips */}
                      <div className="flex flex-wrap gap-2">
                        {[
                          "💵 الدفع عند الاستلام",
                          "🚀 24-48 ساعة",
                          "🔒 الكمية محدودة",
                          "✅ ضمان حنينة",
                        ].map((chip) => (
                          <span key={chip} className="trust-chip text-xs">
                            {chip}
                          </span>
                        ))}
                      </div>

                      {/* Form */}
                      <form
                        onSubmit={handleSubmit(onValidSubmit, onInvalidSubmit)}
                        noValidate
                        id="checkout-form"
                      >
                        {/* Honeypot */}
                        <input
                          type="text"
                          className="hidden"
                          tabIndex={-1}
                          autoComplete="off"
                          {...register("honeypot")}
                        />

                        <div className="flex flex-col gap-4">
                          <div>
                            <label
                              className="form-label"
                              htmlFor="fullName"
                            >
                              الاسم الكامل
                            </label>
                            <input
                              id="fullName"
                              type="text"
                              autoComplete="name"
                              placeholder="مثال: فاطمة الزهراء"
                              className={cn(
                                "form-input",
                                errors.fullName ? "form-input-error" : ""
                              )}
                              {...register("fullName")}
                            />
                            {errors.fullName && (
                              <p className="form-error">
                                {errors.fullName.message}
                              </p>
                            )}
                          </div>

                          <div>
                            <label className="form-label" htmlFor="phone">
                              رقم الهاتف
                            </label>
                            <input
                              id="phone"
                              type="tel"
                              inputMode="numeric"
                              autoComplete="tel"
                              placeholder="مثال: 0612345678"
                              className={cn(
                                "form-input",
                                errors.phone ? "form-input-error" : ""
                              )}
                              {...register("phone")}
                            />
                            <p className="text-ink/40 text-xs mt-1">
                              مثال: 0612345678
                            </p>
                            {errors.phone && (
                              <p className="form-error">
                                {errors.phone.message}
                              </p>
                            )}
                          </div>

                          <div>
                            <label
                              className="form-label"
                              htmlFor="phoneConfirm"
                            >
                              تأكيد رقم الهاتف
                            </label>
                            <input
                              id="phoneConfirm"
                              type="tel"
                              inputMode="numeric"
                              autoComplete="tel"
                              placeholder="تأكيدي رقم الهاتف"
                              className={cn(
                                "form-input",
                                errors.phoneConfirm ? "form-input-error" : ""
                              )}
                              {...register("phoneConfirm")}
                            />
                            {errors.phoneConfirm && (
                              <p className="form-error">
                                {errors.phoneConfirm.message}
                              </p>
                            )}
                          </div>

                          <div>
                            <label className="form-label" htmlFor="city">
                              المدينة
                            </label>
                            <input
                              id="city"
                              type="text"
                              autoComplete="address-level2"
                              placeholder="مثال: الدار البيضاء"
                              className={cn(
                                "form-input",
                                errors.city ? "form-input-error" : ""
                              )}
                              {...register("city")}
                            />
                            {errors.city && (
                              <p className="form-error">
                                {errors.city.message}
                              </p>
                            )}
                          </div>
                        </div>

                        {formError && (
                          <div className="mt-4 bg-danger/10 text-danger text-sm p-3 rounded-xl font-medium">
                            {formError}
                          </div>
                        )}
                      </form>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Sticky footer CTA */}
              {items.length > 0 && (
                <div className="p-4 sm:p-5 border-t border-ink/10 bg-cream safe-bottom">
                  {isCart ? (
                    <>
                      <button
                        onClick={goToCheckout}
                        className="btn-primary w-full text-lg sm:text-xl py-4 sm:py-5"
                      >
                        تأكيد الطلب — {totals.total} درهم
                      </button>
                      <p className="text-center text-ink/50 text-xs mt-2">
                        الدفع عند الاستلام · لا حاجة لبطاقة بنكية
                      </p>
                    </>
                  ) : (
                    <>
                      <button
                        type="submit"
                        form="checkout-form"
                        disabled={isSubmitting}
                        className="btn-primary w-full text-lg sm:text-xl py-4 sm:py-5"
                      >
                        {isSubmitting ? "جاري المعالجة..." : "تأكيد الطلب"}
                      </button>
                      <p className="text-center text-ink/40 text-xs mt-2">
                        غادي نعيطو ليك نأكدو الطلب ونأخذو العنوان النهائي
                      </p>
                    </>
                  )}
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Upsell Modal — sits above drawer with opaque backdrop */}
      <UpsellModal
        isOpen={showUpsell}
        product={upsellProduct}
        onAccept={() => finalizeOrder(true)}
        onDecline={() => finalizeOrder(false)}
      />
    </>
  );
}
