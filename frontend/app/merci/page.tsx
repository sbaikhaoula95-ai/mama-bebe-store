"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { PRODUCTS_LIST } from "@/config/products";
import { PlaceholderImage } from "@/components/brand/PlaceholderImage";
import { useCartStore } from "@/store/cart-store";
import { CheckCircle2, PhoneCall, Clock, Star, ShieldCheck, Heart, Package, Truck, Banknote } from "lucide-react";

type OrderSummary = {
  orderId: string;
  orderNumber: string;
  customerName: string;
  phone?: string;
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
  const [isWorkingHours, setIsWorkingHours] = useState(true);
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

    // Check if current time is between 10:00 and 21:00
    const currentHour = new Date().getHours();
    setIsWorkingHours(currentHour >= 10 && currentHour < 21);
  }, [closeCart, clearCart]);

  // Products not in order for cross-sells
  const orderProductIds = new Set(order?.items.map((i) => i.productId) || []);
  const crossSellProducts = PRODUCTS_LIST.filter(
    (p) => !orderProductIds.has(p.slug)
  ).slice(0, 2);

  return (
    <>
      {/* High Confirmation Banner */}
      <div className="bg-forest text-cream py-3 px-4 text-center font-bold text-sm md:text-base shadow-md relative z-10">
        <div className="container-site flex items-center justify-center gap-2">
          <span className="animate-pulse">🔴</span>
          <span>الخطوة الأخيرة: جاوبي على المكالمة ديالنا باش نأكدو الطلب!</span>
        </div>
      </div>

      {/* Success Hero */}
      <section className="pt-10 pb-12 bg-gradient-to-b from-forest/5 to-cream content-auto">
        <div className="container-site max-w-2xl text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-forest/10 text-forest rounded-full mb-6">
            <CheckCircle2 size={48} strokeWidth={2} />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-ink mb-4">
            طلبك داز بنجاح! 🎉
          </h1>
          
          {order && (
            <p className="text-ink/80 text-lg md:text-xl mb-6 font-medium">
              شكرا <span className="text-forest font-bold">{order.customerName.split(' ')[0]}</span>! 
              {order.phone && (
                <> غادي نعيطو ليك في الرقم <span className="font-mono font-bold" dir="ltr">{order.phone}</span> باش نأكدو العنوان ديالك قبل ما نصيفطو الطلب.</>
              )}
            </p>
          )}

          {/* Dynamic Call Timing */}
          <div className="bg-white border-2 border-forest/20 rounded-3xl p-6 mb-8 shadow-sm transform transition hover:scale-[1.02]">
            <div className="flex justify-center mb-4 text-forest">
              {isWorkingHours ? <PhoneCall size={40} className="animate-bounce" /> : <Clock size={40} />}
            </div>
            <h2 className="font-bold text-ink text-2xl mb-3">
              {isWorkingHours ? "غادي نعيطو ليك دابا!" : "غادي نعيطو ليك غدا في الصباح!"}
            </h2>
            <p className="text-ink/70 text-lg leading-relaxed">
              {isWorkingHours 
                ? "غادي نتاصلو بيك في أقل من 10 دقائق من رقم ما كتعرفيهش. عافاك خلي تليفونك حداك وجاوبي باش نأكدو الطلب ونصيفطوه ليك اليوم!"
                : "بما أنك درتي الطلب خارج أوقات العمل، غادي نتاصلو بيك غدا في الصباح الباكر من رقم ما كتعرفيهش. عافاك جاوبي باش نأكدو الطلب ونصيفطوه ليك!"}
            </p>
          </div>
        </div>
      </section>

      {/* Excitement & Social Proof */}
      <section className="py-10 bg-white border-y border-ink/5 content-auto">
        <div className="container-site max-w-3xl">
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-ink mb-3">شنو غتستافدي من حنينة؟ ✨</h2>
            <p className="text-ink/60">أكثر من 10,000 أم مغربية تيقو فينا باش يعتانيو بوليداتهم</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-cream rounded-2xl p-5 text-center flex flex-col items-center">
              <div className="w-12 h-12 bg-gold/20 text-gold rounded-full flex items-center justify-center mb-3">
                <Star size={24} />
              </div>
              <h3 className="font-bold text-ink mb-2">نتائج سريعة</h3>
              <p className="text-sm text-ink/60">غادي تلاحظي الفرق من الاستعمالات الأولى</p>
            </div>
            <div className="bg-cream rounded-2xl p-5 text-center flex flex-col items-center">
              <div className="w-12 h-12 bg-forest/20 text-forest rounded-full flex items-center justify-center mb-3">
                <ShieldCheck size={24} />
              </div>
              <h3 className="font-bold text-ink mb-2">آمن 100%</h3>
              <p className="text-sm text-ink/60">مكونات طبيعية مختارة بعناية لبشرة طفلك</p>
            </div>
            <div className="bg-cream rounded-2xl p-5 text-center flex flex-col items-center">
              <div className="w-12 h-12 bg-danger/10 text-danger rounded-full flex items-center justify-center mb-3">
                <Heart size={24} />
              </div>
              <h3 className="font-bold text-ink mb-2">راحة البال</h3>
              <p className="text-sm text-ink/60">تهناي من المشاكل وخلي ولدك يرتاح</p>
            </div>
          </div>
        </div>
      </section>

      {/* Cleaner Order Summary */}
      {order && (
        <section className="py-12 bg-cream content-auto">
          <div className="container-site max-w-2xl">
            <h2 className="text-2xl font-bold text-ink mb-6 text-center">ملخص الطلب ديالك</h2>
            <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-ink/5">
              {orderId && (
                <div className="flex justify-between items-center pb-4 border-b border-ink/10 mb-4">
                  <span className="text-ink/50">رقم الطلب</span>
                  <strong className="text-ink font-mono bg-cream px-3 py-1 rounded-lg">{orderId}</strong>
                </div>
              )}
              
              <div className="flex flex-col gap-4 mb-6">
                {order.items.map((item, idx) => (
                  <div key={idx} className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-cream rounded-lg flex items-center justify-center text-forest font-bold text-sm">
                        x{item.quantity}
                      </div>
                      <div>
                        <p className="font-bold text-ink">{item.name.split(" — ")[0]}</p>
                        {item.isUpsell && <span className="text-xs bg-gold/20 text-gold-dark px-2 py-0.5 rounded-full font-medium">عرض خاص</span>}
                      </div>
                    </div>
                    <span className="font-bold text-ink">{item.lineTotal} {order.totals.currency}</span>
                  </div>
                ))}
              </div>
              
              <div className="pt-4 border-t border-ink/10 flex flex-col gap-2">
                <div className="flex justify-between items-center text-ink/60">
                  <span>المجموع الفرعي</span>
                  <span>{order.totals.subtotal} {order.totals.currency}</span>
                </div>
                <div className="flex justify-between items-center text-ink/60">
                  <span>التوصيل</span>
                  <span>{order.totals.deliveryFee === 0 ? "بالمجان" : `${order.totals.deliveryFee} ${order.totals.currency}`}</span>
                </div>
                <div className="flex justify-between items-center pt-4 mt-2 border-t border-ink/10">
                  <span className="font-bold text-ink text-xl">المجموع النهائي</span>
                  <span className="font-bold text-forest text-2xl">{order.totals.total} {order.totals.currency}</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Cross-sells with new copy */}
      {crossSellProducts.length > 0 && (
        <section className="py-12 bg-white content-auto">
          <div className="container-site">
            <div className="text-center mb-10">
              <span className="inline-block bg-gold/20 text-gold-dark px-4 py-1 rounded-full text-sm font-bold mb-3">عرض خاص ليك</span>
              <h2 className="text-2xl md:text-3xl font-bold text-ink mb-3">
                بغيتي تزيدي شي حاجة لطلبك؟
              </h2>
              <p className="text-ink/60 max-w-xl mx-auto">
                قوليها لينا فاش نعيطو ليك باش نأكدو الطلب، وغادي نزيدوها ليك في نفس الباكيج باش تستافدي من توصيل واحد!
              </p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-3xl mx-auto">
              {crossSellProducts.map((product) => (
                <div
                  key={product.slug}
                  className="bg-cream rounded-3xl overflow-hidden border border-ink/5 flex flex-col"
                >
                  <div className="relative aspect-square sm:aspect-video">
                    <PlaceholderImage
                      imageKey={product.heroImageKey}
                      alt={product.arabicName}
                      aspectRatio="square"
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-5 flex flex-col flex-1">
                    <h3 className="font-bold text-ink text-lg mb-2">
                      {product.shortHeading.replace(/\n/g, " ")}
                    </h3>
                    <p className="text-ink/60 text-sm mb-4 line-clamp-2">
                      {product.benefits[0]}
                    </p>
                    <div className="mt-auto flex items-center justify-between">
                      <span className="font-bold text-forest text-xl">199 درهم</span>
                      <span className="text-sm font-medium text-ink/50 bg-ink/5 px-3 py-1.5 rounded-lg">
                        طلبيها في المكالمة 📞
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* What happens next */}
      <section className="py-12 bg-cream content-auto">
        <div className="container-site max-w-4xl">
          <h2 className="text-2xl font-bold text-ink mb-10 text-center">شنو غادي يوقع دابا؟</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              {
                step: "1",
                title: "المكالمة",
                body: "غادي نعيطو ليك باش نأكدو العنوان ديالك.",
                icon: <PhoneCall size={28} />,
              },
              {
                step: "2",
                title: "التجهيز",
                body: "كنوجدو طلبك بعناية وكنغلفوه مزيان.",
                icon: <Package size={28} />,
              },
              {
                step: "3",
                title: "الإرسال",
                body: "كنصيفطوه ليك مع شركة التوصيل.",
                icon: <Truck size={28} />,
              },
              {
                step: "4",
                title: "الاستلام",
                body: "كتخلصي حتى كتوصلك السلعة ليديك.",
                icon: <Banknote size={28} />,
              },
            ].map((step) => (
              <div
                key={step.step}
                className="flex flex-col items-center text-center bg-white rounded-3xl p-6 border border-ink/5 relative"
              >
                <div className="absolute -top-4 -left-4 w-8 h-8 bg-forest text-white rounded-full flex items-center justify-center font-bold">
                  {step.step}
                </div>
                <div className="text-forest mb-4 bg-forest/10 p-4 rounded-full">
                  {step.icon}
                </div>
                <h3 className="font-bold text-ink text-lg mb-2">{step.title}</h3>
                <p className="text-ink/60 text-sm leading-relaxed">{step.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Reassurance */}
      <section className="py-10 bg-forest text-cream text-center content-auto">
        <div className="container-site max-w-xl">
          <Heart size={32} className="mx-auto mb-4 text-gold" />
          <h2 className="text-2xl font-bold mb-4">شكرا على ثقتك في حنينة</h2>
          <p className="text-cream/80 text-lg leading-relaxed mb-6">
            كل طلب بالنسبة لينا هو مسؤولية. كنخدمو من قلبنا باش نوصلو ليك أحسن منتج لوليداتك.
          </p>
          <p className="text-gold font-bold text-xl italic">
            "إلا ما كانش مزيان لوليدك، ما كاينش فحنينة."
          </p>
        </div>
      </section>
    </>
  );
}

export default function MerciPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-cream">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-forest border-t-transparent rounded-full animate-spin"></div>
          <div className="text-ink/50 font-medium">جاري التحميل...</div>
        </div>
      </div>
    }>
      <ThankYouContent />
    </Suspense>
  );
}
