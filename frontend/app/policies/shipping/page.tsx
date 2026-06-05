import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "الشحن والتوصيل | حنينة",
};

export default function ShippingPage() {
  return (
    <section className="section-padding bg-cream">
      <div className="container-site max-w-3xl">
        <h1 className="text-4xl font-bold text-ink mb-8">سياسة الشحن والتوصيل</h1>
        <div className="bg-white rounded-3xl p-8 border border-ink/10 prose prose-lg text-ink/80 flex flex-col gap-5">
          <div>
            <h2 className="text-2xl font-bold text-ink mb-3">مناطق التوصيل</h2>
            <p>نوصل في جميع أنحاء المغرب — المدن والمناطق القروية.</p>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-ink mb-3">مدة التوصيل</h2>
            <p>24 إلى 48 ساعة من تأكيد الطلب عبر الهاتف في المدن الرئيسية. قد تمتد إلى 72 ساعة في بعض المناطق النائية.</p>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-ink mb-3">تكلفة التوصيل</h2>
            <p>التوصيل مجاني لكل طلب فوق 299 درهم. رسوم التوصيل للطلبات دون هذا الحد تُحدد عند الطلب.</p>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-ink mb-3">تأكيد الطلب</h2>
            <p>سيتصل بك فريقنا لتأكيد الطلب والعنوان قبل الشحن. يُرجى الإجابة على المكالمة لضمان وصول طلبك في الوقت المحدد.</p>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-ink mb-3">الدفع عند الاستلام</h2>
            <p>جميع طلباتنا بالدفع عند الاستلام. تدفعين ثمن المنتج فقط عند استلامه بيديك.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
