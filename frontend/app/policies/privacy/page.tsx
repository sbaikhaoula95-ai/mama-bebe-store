import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "سياسة الخصوصية | حنينة",
};

export default function PrivacyPage() {
  return (
    <section className="section-padding bg-cream">
      <div className="container-site max-w-3xl">
        <h1 className="text-4xl font-bold text-ink mb-8">سياسة الخصوصية</h1>
        <div className="bg-white rounded-3xl p-8 border border-ink/10 flex flex-col gap-5 text-ink/80">
          <div>
            <h2 className="text-2xl font-bold text-ink mb-3">البيانات التي نجمعها</h2>
            <p>عند تقديم الطلب، نجمع:</p>
            <ul className="list-disc list-inside mt-2 flex flex-col gap-1">
              <li>الاسم الكامل</li>
              <li>رقم الهاتف</li>
              <li>المدينة والعنوان</li>
            </ul>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-ink mb-3">كيف نستخدم بياناتك</h2>
            <p>نستخدم بياناتك حصريا لـ:</p>
            <ul className="list-disc list-inside mt-2 flex flex-col gap-1">
              <li>تأكيد الطلب وتوصيله</li>
              <li>التواصل معك بخصوص طلبك</li>
              <li>تحسين خدماتنا</li>
            </ul>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-ink mb-3">أدوات التتبع الإعلاني</h2>
            <p>
              نستخدم أدوات تتبع (بكسلات) من Meta وTikTok وSnapchat لقياس فعالية
              إعلاناتنا. هذه الأدوات مؤجلة ولا تؤثر على سرعة الموقع. بياناتك
              الشخصية (الهاتف والعنوان) لا تُشارك مع أي منصة إعلانية. فقط
              بيانات مُشفرة ومُدمجة تُستخدم للقياس.
            </p>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-ink mb-3">مشاركة البيانات</h2>
            <p>
              لا نبيع بياناتك لأي طرف ثالث. نشارك فقط ما يلزم مع خدمات
              التوصيل للوصول إليك.
            </p>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-ink mb-3">حقوقك</h2>
            <p>
              يمكنك طلب حذف بياناتك في أي وقت بالتواصل معنا عبر البريد
              الإلكتروني أو الهاتف.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
