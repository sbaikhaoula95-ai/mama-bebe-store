"use client";

import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PlaceholderImage } from "@/components/brand/PlaceholderImage";
import type { Product } from "@/config/products";
import { cn } from "@/lib/utils";

const UPSELL_DURATION = 13; // seconds

type UpsellModalProps = {
  isOpen: boolean;
  product: Product | null;
  onAccept: () => void;
  onDecline: () => void;
};

export function UpsellModal({
  isOpen,
  product,
  onAccept,
  onDecline,
}: UpsellModalProps) {
  const [timeLeft, setTimeLeft] = useState(UPSELL_DURATION);
  const [isProcessing, setIsProcessing] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!isOpen) {
      setTimeLeft(UPSELL_DURATION);
      setIsProcessing(false);
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    setTimeLeft(UPSELL_DURATION);
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          if (timerRef.current) clearInterval(timerRef.current);
          handleDecline();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isOpen]);

  function handleAccept() {
    if (isProcessing) return;
    setIsProcessing(true);
    if (timerRef.current) clearInterval(timerRef.current);
    onAccept();
  }

  function handleDecline() {
    if (isProcessing) return;
    setIsProcessing(true);
    if (timerRef.current) clearInterval(timerRef.current);
    onDecline();
  }

  const progressPct = (timeLeft / UPSELL_DURATION) * 100;

  if (!product && !isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && product && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-ink/70 backdrop-blur-sm z-[60]"
            aria-hidden="true"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 30 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed inset-0 z-[70] flex items-end md:items-center justify-center p-4"
            role="dialog"
            aria-modal="true"
            aria-label="عرض خاص"
          >
            <div className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl">
              {/* Countdown bar */}
              <div className="h-1.5 bg-ink/10 w-full">
                <div
                  className="h-full bg-forest transition-all duration-1000 ease-linear"
                  style={{ width: `${progressPct}%` }}
                  role="progressbar"
                  aria-valuenow={timeLeft}
                  aria-valuemax={UPSELL_DURATION}
                />
              </div>

              <div className="p-6 flex flex-col gap-5">
                {/* Timer */}
                <div className="flex items-center justify-between">
                  <span className="text-danger font-bold text-sm">
                    ⏱ باقي: {timeLeft} ثانية
                  </span>
                  <span className="badge-gold">عرض حصري</span>
                </div>

                {/* Title */}
                <div className="text-right">
                  <h2 className="text-2xl font-bold text-ink">
                    عرض خاص قبل ما نكملو طلبك
                  </h2>
                  <p className="text-ink/60 text-sm mt-1">
                    زيدي هاد المنتج لطلبك غير ب 99 درهم. العرض غادي يسالي فثواني.
                  </p>
                </div>

                {/* Product */}
                <div className="flex gap-4 bg-cream rounded-2xl p-4">
                  <div className="w-20 h-20 flex-shrink-0 rounded-xl overflow-hidden">
                    <PlaceholderImage
                      imageKey={product.heroImageKey}
                      alt={product.arabicName}
                      aspectRatio="square"
                      className="rounded-xl"
                    />
                  </div>
                  <div className="flex-1 text-right">
                    <p className="font-bold text-ink text-base leading-snug whitespace-pre-line">
                      {product.shortHeading}
                    </p>
                    <p className="text-ink/60 text-xs mt-1 line-clamp-2">
                      {product.subheading}
                    </p>
                    <div className="flex items-center gap-2 mt-2 justify-end">
                      <span className="text-ink/40 line-through text-sm">199 درهم</span>
                      <span className="text-forest font-bold text-2xl">99 درهم</span>
                    </div>
                  </div>
                </div>

                {/* Trust note */}
                <p className="text-center text-ink/50 text-xs">
                  💵 الدفع عند الاستلام · التوصيل مع طلبك الأصلي
                </p>

                {/* CTAs */}
                <div className="flex flex-col gap-3">
                  <button
                    onClick={handleAccept}
                    disabled={isProcessing}
                    className="btn-primary w-full text-base py-4 disabled:opacity-60"
                  >
                    {isProcessing ? "جاري المعالجة..." : "نعم، زيديها لطلبي ب 99 درهم"}
                  </button>
                  <button
                    onClick={handleDecline}
                    disabled={isProcessing}
                    className="text-ink/50 text-sm font-medium py-2 hover:text-ink transition-colors disabled:opacity-60"
                  >
                    لا شكرا، كملي الطلب
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
