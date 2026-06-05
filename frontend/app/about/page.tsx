import type { Metadata } from "next";
import { PlaceholderImage } from "@/components/brand/PlaceholderImage";
import { TrustBadges } from "@/components/brand/TrustBadges";
import { SectionHeader } from "@/components/brand/SectionHeader";
import Link from "next/link";

export const metadata: Metadata = {
  title: "من نحن | حنينة",
  description:
    "حنينة علامة مغربية للعناية الطبيعية بماما والبيبي. مكونات طبيعية، لطيفة، ومفهومة.",
};

export default function AboutPage() {
  return (
    <>
      {/* Hero */}
      <section className="section-padding bg-gradient-to-b from-sage/10 to-cream">
        <div className="container-site">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="flex flex-col gap-6">
              <span className="badge-gold self-start">من نحن</span>
              <h1 className="text-4xl md:text-5xl font-bold text-ink leading-tight">
                حنينة — علامة مغربية{" "}
                <span className="text-forest">للعناية الطبيعية</span>
              </h1>
              <p className="text-ink/70 text-lg leading-relaxed">
                حنينة علامة مغربية للعناية الطبيعية بماما والبيبي. كنختارو مكونات
                لطيفة، واضحة، ومفهومة باش كل ماما تحس بالأمان قبل ما تطلب.
              </p>
              <p className="text-gold font-semibold italic text-xl">
                إلا ما كانش مزيان لوليدك، ما كاينش فحنينة.
              </p>
            </div>
            <PlaceholderImage
              imageKey="home-hero-moroccan-mom-baby-natural-care"
              alt="قصة حنينة — عناية طبيعية للماما والبيبي"
              aspectRatio="portrait"
            />
          </div>
        </div>
      </section>

      {/* Brand Story */}
      <section className="section-padding bg-white">
        <div className="container-site max-w-3xl">
          <SectionHeader
            eyebrow="قصتنا"
            title="لماذا أنشأنا حنينة؟"
            align="start"
            className="mb-8"
          />
          <div className="prose prose-lg text-ink/80 leading-relaxed flex flex-col gap-5">
            <p>
              حنينة وُلدت من فهم حقيقي لاحتياجات الماما المغربية. عارفين شحال
              كتقلقي من أي منتج كتستعمليه مع البيبي — واش مامون؟ واش طبيعي
              فعلا؟ واش راسي كيشري فيه؟
            </p>
            <p>
              لهذا قررنا نبنيو علامة مغربية أصيلة تجمع بين المكونات المعروفة
              فالمغرب — بحال الهندية من سوس، والأرغان من التعاونيات، والخزامى
              والبابونج الطبيعيين — فمنتجات بسيطة، فعالة، وسهلة الاستعمال.
            </p>
            <p>
              كل منتج في حنينة مصمم لحظة معينة في حياة الماما والبيبي. من
              العناية بتشققات الحمل، إلى رتوال النوم الهادئ، إلى ترطيب البشرة
              الحساسة.
            </p>
          </div>
        </div>
      </section>

      {/* Ingredient Philosophy */}
      <section className="section-padding bg-cream">
        <div className="container-site">
          <SectionHeader
            eyebrow="فلسفة المكونات"
            title="كل مكون له سبب"
            subtitle="نختار فقط ما نفهمه ونثق فيه"
            className="mb-12"
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              {
                title: "من مصادر موثوقة",
                body: "زيت الهندية من سوس المغربية، والأرغان من تعاونيات نسائية معتمدة، والمكونات الأخرى من موردين موثوقين.",
                icon: "🇲🇦",
              },
              {
                title: "بدون ما يضر",
                body: "لا بارابين، لا كحول، لا مواد مشكوك فيها. كل ما في منتجاتنا مفهوم وشفاف.",
                icon: "🚫",
              },
              {
                title: "مختبر جلديا",
                body: "منتجاتنا مختبرة على البشرة الحساسة باش نضمنو لطفها وسلامتها.",
                icon: "🧪",
              },
              {
                title: "مناسب للماما والبيبي",
                body: "كل منتج مصمم مع مراعاة حساسية بشرة البيبي واحتياجات الماما خلال الحمل وبعده.",
                icon: "🤱",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="bg-white rounded-2xl p-6 flex gap-4 border border-ink/10"
              >
                <span className="text-3xl flex-shrink-0" role="img" aria-hidden="true">
                  {item.icon}
                </span>
                <div>
                  <h3 className="font-bold text-ink text-lg mb-2">{item.title}</h3>
                  <p className="text-ink/60 leading-relaxed">{item.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust & Safety */}
      <section className="section-padding bg-white">
        <div className="container-site">
          <SectionHeader
            eyebrow="الثقة والسلامة"
            title="معاييرنا الصارمة"
            className="mb-12"
          />
          <TrustBadges variant="grid" />
        </div>
      </section>

      {/* COD Promise */}
      <section className="section-padding bg-forest text-cream">
        <div className="container-site text-center max-w-2xl">
          <h2 className="text-3xl font-bold mb-4">وعدنا معك</h2>
          <p className="text-cream/70 text-lg mb-6 leading-relaxed">
            الدفع عند الاستلام. التوصيل في 24-48 ساعة. كنعيطو ليك نأكدو
            الطلب. إذا ما عجبكيش المنتج، تواصلي معنا وكنحلو المشكل.
          </p>
          <Link href="/products" className="bg-cream text-forest font-bold text-lg px-10 py-4 rounded-full hover:bg-blush/20 transition-colors inline-block">
            تسوقي الآن
          </Link>
        </div>
      </section>

      {/* Founder note placeholder */}
      <section className="section-padding bg-cream">
        <div className="container-site max-w-2xl">
          <div className="bg-white rounded-3xl p-8 border border-ink/10">
            <div className="w-16 h-16 bg-sage/20 rounded-full flex items-center justify-center text-2xl mb-4">
              🌿
            </div>
            <p className="text-ink italic text-lg leading-relaxed mb-4">
              &quot;بنينا حنينة لأننا نؤمن أن كل ماما تستحق منتجات آمنة ومفهومة لها
              ولبيبيها. ما فيهاش مبالغة، غير مكونات طبيعية وصادقة.&quot;
            </p>
            <p className="text-ink/50 font-medium">فريق حنينة [سيتم الإضافة]</p>
          </div>
        </div>
      </section>
    </>
  );
}
