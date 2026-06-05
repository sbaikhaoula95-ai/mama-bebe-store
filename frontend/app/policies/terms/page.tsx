import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "الشروط والأحكام | حنينة",
};

export default function TermsPage() {
  return (
    <section className="section-padding bg-cream">
      <div className="container-site max-w-3xl">
        <h1 className="text-4xl font-bold text-ink mb-8">الشروط والأحكام</h1>
        <div className="bg-white rounded-3xl p-8 border border-ink/10 flex flex-col gap-5 text-ink/80">
          <div>
            <h2 className="text-2xl font-bold text-ink mb-3">استخدام الموقع</h2>
            <p>باستخدامك لموقع hnina.shop، فأنت توافق على هذه الشروط والأحكام.</p>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-ink mb-3">المنتجات والأسعار</h2>
            <p>
              جميع المنتجات والأسعار قابلة للتغيير. الأسعار المعروضة عند الطلب
              هي الأسعار المعمول بها.
            </p>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-ink mb-3">الطلبات</h2>
            <p>
              الطلب يُعتبر مؤكدا فقط بعد مكالمة التأكيد من فريقنا. الطلبات غير
              المؤكدة قد تُلغى.
            </p>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-ink mb-3">ادعاءات المنتجات</h2>
            <p>
              جميع منتجات حنينة منتجات عناية تجميلية وليست علاجات طبية. ادعاءات
              المنتجات تصف خصائص المكونات فقط ولا تمثل وعودا طبية.
            </p>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-ink mb-3">المسؤولية</h2>
            <p>
              ننصح باختبار المنتج على منطقة صغيرة قبل الاستخدام الكامل. في حالة
              الحساسية، أوقفي الاستخدام وتشاوري مع طبيب.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
