import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "الإرجاع والاسترجاع | حنينة",
};

export default function ReturnsPage() {
  return (
    <section className="section-padding bg-cream">
      <div className="container-site max-w-3xl">
        <h1 className="text-4xl font-bold text-ink mb-8">سياسة الإرجاع والاسترجاع</h1>
        <div className="bg-white rounded-3xl p-8 border border-ink/10 flex flex-col gap-5 text-ink/80">
          <div>
            <h2 className="text-2xl font-bold text-ink mb-3">حالات القبول</h2>
            <p>نقبل الإرجاع في الحالات التالية:</p>
            <ul className="list-disc list-inside mt-2 flex flex-col gap-1">
              <li>المنتج وصل تالفا أو معطوبا</li>
              <li>المنتج المستلم مختلف عن المطلوب</li>
              <li>المنتج لم يصل خلال 5 أيام من التأكيد</li>
            </ul>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-ink mb-3">كيفية طلب الإرجاع</h2>
            <p>تواصلي معنا عبر الهاتف أو البريد الإلكتروني خلال 48 ساعة من الاستلام مع صورة المنتج إذا كان تالفا.</p>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-ink mb-3">حالات عدم القبول</h2>
            <p>لا نقبل الإرجاع إذا:</p>
            <ul className="list-disc list-inside mt-2 flex flex-col gap-1">
              <li>تم فتح المنتج واستخدامه (باستثناء وجود عيب)</li>
              <li>مضت أكثر من 48 ساعة على الاستلام دون إبلاغنا</li>
            </ul>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-ink mb-3">ضمان حنينة</h2>
            <p>إذا لم يعجبك المنتج لأي سبب مقبول، تواصلي معنا وكنحاولو نلقاو حل يناسبك.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
