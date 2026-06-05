import type { Metadata } from "next";
import { ProductCard } from "@/components/product/ProductCard";
import { SectionHeader } from "@/components/brand/SectionHeader";
import { TrustBadges } from "@/components/brand/TrustBadges";
import { PRODUCTS_LIST } from "@/config/products";
import { ProductFaq } from "@/components/product/ProductFaq";

export const metadata: Metadata = {
  title: "منتجات حنينة | عناية طبيعية لماما والبيبي",
  description:
    "اكتشفي كل منتجات حنينة — زيت الهندية والأرغان لماما، زيت الخزامى للبيبي، وبلسم الكاليندولا للبشرة الحساسة. الدفع عند الاستلام.",
};

const collectionFaq = [
  {
    question: "واش نقدر نطلب أكثر من منتج؟",
    answer:
      "نعم. يمكنك إضافة عدة منتجات في سلة واحدة والاستفادة من عروض الكمية.",
  },
  {
    question: "شحال تكلف التوصيل؟",
    answer:
      "التوصيل مجاني فوق 299 درهم. في حالات أخرى، رسوم التوصيل تظهر في مرحلة الطلب.",
  },
  {
    question: "واش يمكنني تغيير الطلب بعد الإرسال؟",
    answer:
      "نعم، يمكنك التواصل معنا عبر الهاتف عند تأكيد الطلب لأي تغييرات.",
  },
];

export default function ProductsPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-to-b from-sage/10 to-cream py-16">
        <div className="container-site text-center">
          <span className="badge-gold mb-4 inline-block">منتجاتنا</span>
          <h1 className="text-4xl md:text-5xl font-bold text-ink mb-4">
            منتجات حنينة
          </h1>
          <p className="text-ink/60 text-xl max-w-2xl mx-auto">
            عناية طبيعية لكل مرحلة — من الحمل إلى نوم البيبي إلى البشرة الحساسة
          </p>
        </div>
      </section>

      {/* Products grid */}
      <section className="section-padding bg-cream">
        <div className="container-site">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {PRODUCTS_LIST.map((product) => (
              <ProductCard key={product.slug} product={product} />
            ))}
          </div>

          {/* Bundle/AOV block */}
          <div className="mt-12 bg-forest text-cream rounded-3xl p-8 md:p-12">
            <div className="max-w-2xl">
              <h2 className="text-2xl md:text-3xl font-bold mb-3">
                خدي 2 ب 299 درهم أو 3 ب 399 درهم
              </h2>
              <p className="text-cream/70 text-lg mb-2">
                الكمية محدودة حسب توفر المكونات الطبيعية. الطلب المبكر مضمون.
              </p>
              <p className="text-cream/60 text-sm">
                💵 الدفع عند الاستلام · 🚀 توصيل 24-48 ساعة · 🎁 توصيل مجاني فوق 299 درهم
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Trust badges */}
      <section className="py-12 bg-white">
        <div className="container-site">
          <TrustBadges variant="grid" />
        </div>
      </section>

      {/* FAQ */}
      <section className="section-padding bg-cream">
        <div className="container-site max-w-3xl">
          <SectionHeader
            title="أسئلة شائعة"
            className="mb-8"
          />
          <ProductFaq faq={collectionFaq} />
        </div>
      </section>
    </>
  );
}
