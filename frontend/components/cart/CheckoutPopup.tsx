"use client";

import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion, AnimatePresence } from "framer-motion";
import { useCartStore } from "@/store/cart-store";
import { calculateCartTotals, getRecommendedUpsell } from "@/lib/cart-pricing";
import { MOROCCAN_PHONE_REGEX } from "@/lib/phone";
import { generateEventId } from "@/lib/event-id";
import { getUTMParams, getClickIds, getCookieValue } from "@/lib/utm";
import { createOrder } from "@/lib/api";
import {
  trackInitiateCheckout,
  trackPurchase,
} from "@/lib/tracking-client";
import { UpsellModal } from "./UpsellModal";
import { CartTotals } from "./CartTotals";
import { PRODUCTS } from "@/config/products";
import { cn } from "@/lib/utils";
import { UPSELL_PRICE } from "@/config/offers";

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

export function CheckoutPopup() {
  const { items, isCheckoutOpen, closeCheckout, addItem, clearCart } = useCartStore();
  const [showUpsell, setShowUpsell] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState("");
  const [formData, setFormData] = useState<CheckoutFormData | null>(null);
  const [eventId] = useState(() => generateEventId("order"));

  const totals = calculateCartTotals(items);
  const upsellProductId = getRecommendedUpsell(items);
  const upsellProduct = upsellProductId ? PRODUCTS[upsellProductId] : null;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
  });

  useEffect(() => {
    if (isCheckoutOpen) {
      document.body.style.overflow = "hidden";
      trackInitiateCheckout(
        totals.total,
        items.reduce((s, i) => s + i.quantity, 0),
        generateEventId("checkout")
      );
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isCheckoutOpen]);

  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape" && !showUpsell) closeCheckout();
    }
    if (isCheckoutOpen) window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [isCheckoutOpen, showUpsell, closeCheckout]);

  async function onValidSubmit(data: CheckoutFormData) {
    setFormData(data);
    setShowUpsell(true);
  }

  async function finalizeOrder(upsellAccepted: boolean) {
    if (!formData) return;
    setIsSubmitting(true);
    setFormError("");

    try {
      const nonUpsellItems = items.filter((i) => !i.isUpsell);
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
          subtotal: upsellAccepted ? totals.subtotal + UPSELL_PRICE : totals.subtotal,
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
          eventId,
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
        eventId
      );

      if (upsellAccepted && upsellProduct) {
        addItem({
          productId: upsellProduct.slug,
          sku: upsellProduct.sku,
          arabicName: upsellProduct.arabicName,
          quantity: 1,
          source: "upsell",
          isUpsell: true,
          upsellUnitPrice: UPSELL_PRICE,
        });
      }

      // Store summary in sessionStorage for thank-you page
      sessionStorage.setItem(
        "hnina_order",
        JSON.stringify({
          orderId: response.orderId,
          orderNumber: response.orderNumber,
          customerName: formData.fullName,
          city: formData.city,
          items: orderItems,
          totals: payload.totals,
          upsellAccepted,
        })
      );

      clearCart();
      closeCheckout();
      setShowUpsell(false);

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

  return (
    <>
      <AnimatePresence>
        {isCheckoutOpen && !showUpsell && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="drawer-overlay z-50"
              onClick={() => closeCheckout()}
              aria-hidden="true"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="fixed inset-x-0 bottom-0 md:inset-0 md:flex md:items-center md:justify-center z-50 p-0 md:p-6"
              role="dialog"
              aria-modal="true"
              aria-label="تأكيد الطلب"
            >
              <div className="bg-cream w-full md:max-w-lg md:rounded-3xl overflow-hidden flex flex-col max-h-[95vh] md:max-h-[90vh] shadow-2xl">
                {/* Header */}
                <div className="flex items-center justify-between p-5 border-b border-ink/10 bg-white">
                  <button
                    onClick={closeCheckout}
                    className="p-2 rounded-xl hover:bg-sage/10 transition-colors"
                    aria-label="إغلاق"
                  >
                    <svg className="w-5 h-5 text-ink" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                  <div className="text-right">
                    <h2 className="font-bold text-xl text-ink">أكدي طلبك فدقيقة</h2>
                    <p className="text-ink/60 text-sm mt-0.5">
                      ما تخلصي والو دابا
                    </p>
                  </div>
                </div>

                {/* Scrollable content */}
                <div className="flex-1 overflow-y-auto">
                  <div className="p-5 flex flex-col gap-5">
                    {/* Order summary */}
                    <div className="bg-white rounded-2xl p-4 border border-ink/10">
                      <h3 className="font-bold text-ink mb-3">ملخص الطلب</h3>
                      <div className="flex flex-col gap-2 text-sm">
                        {items.map((item) => (
                          <div key={item.lineId} className="flex justify-between gap-3">
                            <span className="text-ink/70 text-right leading-snug">
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
                        <span
                          key={chip}
                          className="trust-chip text-xs"
                        >
                          {chip}
                        </span>
                      ))}
                    </div>

                    {/* Form */}
                    <form
                      onSubmit={handleSubmit(onValidSubmit)}
                      noValidate
                      id="checkout-form"
                    >
                      {/* Honeypot - hidden from users */}
                      <input
                        type="text"
                        className="hidden"
                        tabIndex={-1}
                        autoComplete="off"
                        {...register("honeypot")}
                      />

                      <div className="flex flex-col gap-4">
                        <div>
                          <label className="form-label" htmlFor="fullName">
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
                            <p className="form-error">{errors.fullName.message}</p>
                          )}
                        </div>

                        <div>
                          <label className="form-label" htmlFor="phone">
                            رقم الهاتف
                          </label>
                          <input
                            id="phone"
                            type="tel"
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
                            <p className="form-error">{errors.phone.message}</p>
                          )}
                        </div>

                        <div>
                          <label className="form-label" htmlFor="phoneConfirm">
                            تأكيد رقم الهاتف
                          </label>
                          <input
                            id="phoneConfirm"
                            type="tel"
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
                            <p className="form-error">{errors.city.message}</p>
                          )}
                        </div>
                      </div>

                      {formError && (
                        <div className="mt-4 bg-danger/10 text-danger text-sm p-3 rounded-xl font-medium">
                          {formError}
                        </div>
                      )}
                    </form>
                  </div>
                </div>

                {/* CTA */}
                <div className="p-5 bg-white border-t border-ink/10">
                  <button
                    type="submit"
                    form="checkout-form"
                    disabled={isSubmitting}
                    className="btn-primary w-full text-xl py-5"
                  >
                    {isSubmitting ? "جاري المعالجة..." : "تأكيد الطلب"}
                  </button>
                  <p className="text-center text-ink/40 text-xs mt-2">
                    غادي نعيطو ليك نأكدو الطلب ونأخذو العنوان النهائي
                  </p>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Upsell Modal */}
      <UpsellModal
        isOpen={showUpsell}
        product={upsellProduct}
        onAccept={() => finalizeOrder(true)}
        onDecline={() => finalizeOrder(false)}
      />
    </>
  );
}
