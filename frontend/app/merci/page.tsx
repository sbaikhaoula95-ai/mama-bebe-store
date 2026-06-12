"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { PRODUCTS_LIST, getProductBySlug } from "@/config/products";
import { PlaceholderImage } from "@/components/brand/PlaceholderImage";
import { useCartStore } from "@/store/cart-store";

type OrderSummary = {
  orderId: string;
  orderNumber: string;
  customerName: string;
  city: string;
  items: Array<{
    productId: string;
    sku: string;
    name: string;
    quantity: number;
    unitPrice: number;
    lineTotal: number;
    isUpsell: boolean;
  }>;
  totals: {
    subtotal: number;
    deliveryFee: number;
    total: number;
    currency: string;
  };
  upsellAccepted: boolean;
};

function ThankYouContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");
  const [order, setOrder] = useState<OrderSummary | null>(null);
  const closeCart = useCartStore((s) => s.closeCart);
  const clearCart = useCartStore((s) => s.clearCart);

  useEffect(() => {
    // Guarantee a clean UI on the thank-you page: no leftover drawer / cart items
    closeCart();
    clearCart();

    const stored = sessionStorage.getItem("hnina_order");
    if (stored) {
      try {
        setOrder(JSON.parse(stored));
      } catch {
        // ignore
      }
    }
  }, [closeCart, clearCart]);

  // Products not in order for cross-sells
  const orderProductIds = new Set(order?.items.map((i) => i.productId) || []);
  const crossSellProducts = PRODUCTS_LIST.filter(
    (p) => !orderProductIds.has(p.slug)
  ).slice(0, 2);

  return (
    <>
      {/* Success Hero */}
      <section className="section-padding bg-gradient-to-b from-forest/5 to-cream">
        <div className="container-site max-w-2xl text-center">
          <div className="text-6xl mb-6">🎉</div>
          <h1 className="text-4xl md:text-5xl font-bold text-ink mb-4">
            طلبك توصلنا بنجاح
          </h1>
          {orderId && (
            <p className="text-ink/50 text-sm mb-4">
              رقم الطلب: <strong className="text-ink font-mono">{orderId}</strong>
            </p>
          )}
          <p className="text-ink/70 text-xl leading-relaxed mb-6">
            غادي نعيطو ليك قريبا باش نأكدو الطلب ونأخذو العنوان النهائي.
          </p>

          {/* IMPORTANT: Phone instruction */}
          <div className="bg-danger/10 border-2 border-danger/20 rounded-3xl p-6 mb-8">
            <div className="text-4xl mb-3">📞</div>
            <p className="font-bold text-ink text-xl mb-2">
              خلي تيليفونك قريب وجاوبي على المكالمة
            </p>
            <p className="text-ink/60 text-base">
              باش يوصلك الطلب بسرعة، ضرورة تجاوبي على مكالمة التأكيد ديالنا.
            </p>
          </div>
        </div>
      </section>

      {/* Order Summary */}
      {order && (
        <section className="py-8 bg-white">
          <div className="container-site max-w-2xl">
            <h2 className="text-2xl font-bold text-ink mb-5">ملخص طلبك</h2>
            <div className="bg-cream rounded-2xl p-5 flex flex-col gap-3 border border-ink/10">
              {order.items.map((item, idx) => (
                <div key={idx} className="flex justify-between items-center py-2 border-b border-ink/10 last:border-0">
                  <span className="text-forest font-bold">{item.lineTotal} {order.totals.currency}</span>
                  <div className="text-right">
                    <p className="font-medium text-ink text-sm">{item.name.split(" — ")[0]}</p>
                    <p className="text-ink/50 text-xs">× {item.quantity} {item.isUpsell ? "· عرض خاص" : ""}</p>
                  </div>
                </div>
              ))}
              <div className="flex justify-between items-center pt-2">
                <span className="font-bold text-ink text-xl">{order.totals.total} {order.totals.currency}</span>
                <span className="font-bold text-ink text-xl">المجموع</span>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* What happens next */}
      <section className="section-padding bg-cream">
        <div className="container-site max-w-2xl">
          <h2 className="text-2xl font-bold text-ink mb-8 text-center">ماذا يحدث بعد؟</h2>
          <div className="flex flex-col gap-4">
            {[
              {
                step: "1",
                title: "تأكيد الطلب عبر الهاتف",
                body: "كنعيطو ليك باش نأكدو الطلب ونتحقق من العنوان. جاوبي على المكالمة!",
                icon: "📞",
              },
              {
                step: "2",
                title: "تجهيز الطلب",
                body: "كنجهزو طلبك بعناية مع تغليف محكم وآمن.",
                icon: "📦",
              },
              {
                step: "3",
                title: "التوصيل خلال 24-48 ساعة",
                body: "كنصيفطو الطلب ويوصلك في أقل من يومين.",
                icon: "🚀",
              },
              {
                step: "4",
                title: "الدفع عند الاستلام",
                body: "كتخلصي حتى توصلك السلعة بيديك. ما تخلصي والو الآن.",
                icon: "💵",
              },
            ].map((step) => (
              <div
                key={step.step}
                className="flex gap-5 items-start bg-white rounded-2xl p-5 border border-ink/10"
              >
                <div className="text-3xl flex-shrink-0" role="img" aria-hidden="true">
                  {step.icon}
                </div>
                <div>
                  <h3 className="font-bold text-ink text-lg mb-1">{step.title}</h3>
                  <p className="text-ink/60 text-sm leading-relaxed">{step.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Cross-sells */}
      {crossSellProducts.length > 0 && (
        <section className="section-padding bg-white">
          <div className="container-site">
            <h2 className="text-2xl font-bold text-ink mb-8 text-center">
              كملي روتين حنينة
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
              {crossSellProducts.map((product) => (
                <div
                  key={product.slug}
                  className="product-card flex flex-col min-w-0"
                >
                  <Link href={`/products/${product.slug}`}>
                    <PlaceholderImage
                      imageKey={product.heroImageKey}
                      alt={product.arabicName}
                      aspectRatio="landscape"
                      className="rounded-none rounded-t-3xl"
                    />
                  </Link>
                  <div className="p-4 sm:p-5 flex flex-col gap-3 flex-1 min-w-0">
                    <Link href={`/products/${product.slug}`} className="min-w-0">
                      <h3 className="font-bold text-ink text-sm sm:text-base leading-snug break-words hover:text-forest transition-colors">
                        {product.shortHeading.replace(/\n/g, " ")}
                      </h3>
                    </Link>
                    <div className="flex items-center justify-between mt-auto">
                      <span className="font-bold text-forest text-lg">199 درهم</span>
                      <Link href={`/products/${product.slug}`} className="btn-secondary text-sm px-4 py-2">
                        اشتري الآن
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Reassurance */}
      <section className="section-padding bg-cream">
        <div className="container-site max-w-xl text-center">
          <h2 className="text-2xl font-bold text-ink mb-4">شكرا على ثقتك في حنينة 💚</h2>
          <p className="text-ink/60 text-lg leading-relaxed mb-6">
            كل طلب بالنسبة لنا مسؤولية وثقة. كنحاولو دائما نخلص كل تجربة
            مريحة وشفافة لك ولبيبيك.
          </p>
          <p className="text-gold font-semibold italic">
            إلا ما كانش مزيان لوليدك، ما كاينش فحنينة.
          </p>
        </div>
      </section>
    </>
  );
}

export default function MerciPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-ink/50 text-xl">جاري التحميل...</div>
      </div>
    }>
      <ThankYouContent />
    </Suspense>
  );
}
