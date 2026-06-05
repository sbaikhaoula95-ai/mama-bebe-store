import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "الدفع عند الاستلام | حنينة",
};

export default function CodPage() {
  return (
    <section className="section-padding bg-cream">
      <div className="container-site max-w-3xl">
        <h1 className="text-4xl font-bold text-ink mb-8">الدفع عند الاستلام</h1>
        <div className="bg-white rounded-3xl p-8 border border-ink/10 flex flex-col gap-6 text-ink/80">
          <div className="bg-forest/10 rounded-2xl p-5 text-center">
            <div className="text-4xl mb-2">💵</div>
            <p className="text-xl font-bold text-forest">
              ما تخلصي والو حتى يوصلك الطلب بيديك
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-ink mb-3">كيف يعمل الدفع عند الاستلام؟</h2>
            <div className="flex flex-col gap-4">
              {[
                {
                  step: "1",
                  title: "اطلبي المنتج",
                  body: "اختاري المنتج والعرض واملأي بياناتك في نموذج الطلب.",
                },
                {
                  step: "2",
                  title: "تأكيد الطلب",
                  body: "سيتصل بك فريقنا لتأكيد الطلب والعنوان.",
                },
                {
                  step: "3",
                  title: "التوصيل",
                  body: "يصلك الطلب في 24-48 ساعة.",
                },
                {
                  step: "4",
                  title: "الدفع عند الاستلام",
                  body: "تدفعين ثمن المنتج نقدا للمندوب عند استلام الطلب.",
                },
              ].map((s) => (
                <div key={s.step} className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-forest text-cream rounded-full flex items-center justify-center font-bold">
                    {s.step}
                  </div>
                  <div>
                    <p className="font-bold text-ink">{s.title}</p>
                    <p className="text-ink/60 text-sm">{s.body}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-ink mb-3">لماذا نقدم الدفع عند الاستلام فقط؟</h2>
            <p>
              نريد أن تكوني مرتاحة تماما قبل الدفع. مع الدفع عند الاستلام، تتأكدين
              أن المنتج وصل وهو في حالة جيدة قبل أن تدفعي.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-ink mb-3">العملة</h2>
            <p>جميع الأسعار بالدرهم المغربي (MAD).</p>
          </div>
        </div>
      </div>
    </section>
  );
}
