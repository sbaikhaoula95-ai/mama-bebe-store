import type { Metadata } from "next";
import Link from "next/link";
import { PlaceholderImage } from "@/components/brand/PlaceholderImage";
import { TrustBadges } from "@/components/brand/TrustBadges";
import { SectionHeader } from "@/components/brand/SectionHeader";

export const metadata: Metadata = {
  title: "من نحن | حنينة — الصيدلية الطبيعية لماما والبيبي",
  description:
    "حنينة هي الصيدلية الطبيعية المغربية لماما والبيبي. مكونات مغربية أصيلة، تركيبات مختبرة جلديا، موصى بها من طرف أطباء الأطفال والقابلات.",
};

const protocoleSteps = [
  {
    icon: "🌿",
    title: "1 · اختيار المكون",
    body: "كل مكون كنختاروه من تعاونية مغربية معتمدة — الأرغان من سوس، الهندية من أگادير، اللافندة من الأطلس المتوسط، الكاليندولا من الهربوريستيري.",
  },
  {
    icon: "🧪",
    title: "2 · التحليل المخبري",
    body: "تحليل في المخبر لكل دفعة: نقاء، تركيز المركبات النشطة، وغياب الملوثات (معادن، ميكروبات).",
  },
  {
    icon: "✚",
    title: "3 · صياغة التركيبة",
    body: "تركيبة بسيطة، ضرورية، بلا أي مكون مشكوك فيه. INCI كامل، بلا بارابين، سلفات، كحول، أو عطور اصطناعية.",
  },
  {
    icon: "👩‍⚕️",
    title: "4 · مراجعة طبية",
    body: "كل منتج كيتعرض على طبيب أطفال وقابلة معتمدين فالمغرب قبل ما يدخل الكاطالوگ.",
  },
  {
    icon: "🔬",
    title: "5 · اختبار جلدي",
    body: "اختبار جلدي على عينة من المتطوعات للتأكد من اللطف والسلامة على البشرة الحساسة.",
  },
  {
    icon: "🏷️",
    title: "6 · الترقيم والتتبع",
    body: "كل قنينة كاتجي بـ batch code، تاريخ الإنتاج، وتاريخ الصلاحية. كل دفعة قابلة للتتبع.",
  },
];

export default function AboutPage() {
  return (
    <>
      {/* Hero */}
      <section className="section-padding bg-gradient-to-b from-pharmacy/8 to-cream">
        <div className="container-site">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="flex flex-col gap-6">
              <span className="chip-authority self-start">✚ من نحن</span>
              <h1 className="text-4xl md:text-5xl font-bold text-ink leading-tight">
                حنينة —{" "}
                <span className="text-pharmacy">الصيدلية الطبيعية المغربية</span>
                <br />
                لماما والبيبي
              </h1>
              <p className="text-ink/70 text-lg leading-relaxed">
                ماشي علامة عادية، وماشي زيت من السوق. حنينة هي مشروع <strong className="text-pharmacy">صيدلية طبيعية حديثة</strong> صممناها خصيصا للماما المغربية: تجمع بين صرامة الصيدلية (مكونات موثقة، تركيبات مختبرة جلديا، مراجعة طبية) ودفء الأمومة (لهجة مغربية، دفع عند الاستلام، مكالمة بشرية).
              </p>
              <p className="text-pharmacy font-semibold italic text-xl">
                « إلا ما كانش مزيان لوليدك، ما كاينش فحنينة. »
              </p>
              <div className="mt-2 flex flex-wrap gap-2">
                <span className="chip-authority">👩‍⚕️ موصى به طبيا</span>
                <span className="chip-authority">🧪 مختبر جلديا</span>
                <span className="chip-authority">🇲🇦 صنع في المغرب</span>
              </div>
            </div>
            <PlaceholderImage
              imageKey="home-hero-moroccan-mom-baby-natural-care"
              alt="قصة حنينة — صيدلية طبيعية لماما والبيبي"
              aspectRatio="portrait"
              className="rounded-[3rem] shadow-xl"
            />
          </div>
        </div>
      </section>

      {/* Mission / Positioning */}
      <section className="section-padding bg-white">
        <div className="container-site max-w-3xl">
          <SectionHeader
            eyebrow="مهمتنا"
            title="نجمعو رحمة ماما مع صرامة صيدلية"
            align="start"
            className="mb-8"
          />
          <div className="prose prose-lg text-ink/80 leading-relaxed flex flex-col gap-5">
            <p>
              فالمغرب، الماما عندها 3 خيارات ملي تحب تشري منتج عناية لراسها أو لبيبيها:
              المنتجات المستوردة (غاليين، ما كيفهموش الماما المغربية)، منتجات الصيدلية الكيميائية
              (فيها مكونات قاسية ومستحضرات بترولية)، أو زيوت السوق (رخيصين، بلا ضمانة، بلا تتبع).
            </p>
            <p>
              <strong className="text-pharmacy">حنينة جات باش تعطي خيار رابع</strong>: صيدلية طبيعية مغربية حديثة، مكونات
              أصيلة من التعاونيات، تركيبات مدروسة ومختبرة، موصى بها من طرف أطباء الأطفال والقابلات،
              بالأسعار اللي تستحقها كل ماما.
            </p>
            <p>
              كل منتج فحنينة كيدوز من <Link href="#protocole" className="text-pharmacy underline font-bold">بروتوكول صارم من 6 مراحل</Link> (تشوفيهم تحت)، باش كي تشريي قنينة، تكوني واثقة 100٪.
            </p>
          </div>
        </div>
      </section>

      {/* PROTOCOLE — l'apothicaire en 6 étapes */}
      <section id="protocole" className="section-padding bg-cream">
        <div className="container-site">
          <SectionHeader
            eyebrow="✚ بروتوكول حنينة"
            title="6 مراحل قبل ما يوصل ليك أي منتج"
            subtitle="نفس مستوى الصرامة اللي كاتعرفو الصيدلية — بمكونات الطبيعة المغربية."
            className="mb-12"
          />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {protocoleSteps.map((step) => (
              <div
                key={step.title}
                className="bg-white rounded-2xl p-6 flex flex-col gap-3 border border-pharmacy/10 hover-lift"
              >
                <span className="text-3xl" role="img" aria-hidden="true">
                  {step.icon}
                </span>
                <h3 className="font-bold text-ink text-lg">{step.title}</h3>
                <p className="text-ink/60 leading-relaxed text-sm">{step.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What we don't do (anti-positioning) */}
      <section className="section-padding bg-white">
        <div className="container-site max-w-4xl">
          <SectionHeader
            eyebrow="ماشي حنينة"
            title="حنينة ماشي هي…"
            align="start"
            className="mb-10"
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {[
              {
                title: "ماشي علامة كيميائية",
                body: "0٪ بارابين · 0٪ سلفات · 0٪ كحول · 0٪ عطور اصطناعية · 0٪ مكون مشكوك فيه.",
              },
              {
                title: "ماشي زيت من السوق",
                body: "كل قنينة عندها INCI كامل، رقم دفعة، تاريخ صلاحية، ومصدر موثق. ماشي زيت بلا اسم.",
              },
              {
                title: "ماشي علامة مستوردة بثمن غالي",
                body: "كنخدمو 100٪ بمكونات مغربية، من تعاونيات معتمدة. السعر معقول لكل ماما.",
              },
              {
                title: "ماشي مجرد دكان أونلاين",
                body: "كنعيطو لكل زبونة بالداريجة، كنأكدو الطلب، كنجاوبو على الأسئلة. خدمة بشرية ماشي روبوت.",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="bg-cream rounded-2xl p-6 border border-pharmacy/10 flex flex-col gap-2"
              >
                <h3 className="font-bold text-ink text-lg">{item.title}</h3>
                <p className="text-ink/60 leading-relaxed">{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust & Safety */}
      <section className="section-padding bg-cream">
        <div className="container-site">
          <SectionHeader
            eyebrow="ثقتنا ديالك"
            title="المعايير اللي كنحترموها"
            className="mb-12"
          />
          <TrustBadges variant="grid" />
        </div>
      </section>

      {/* COD Promise */}
      <section className="section-padding bg-pharmacy text-cream">
        <div className="container-site text-center max-w-2xl">
          <span className="inline-block bg-cream/10 text-cream font-bold px-4 py-1.5 rounded-full mb-6 text-sm">
            ✚ وعد حنينة
          </span>
          <h2 className="text-3xl font-bold mb-4">ماشي بيع — مسؤولية</h2>
          <p className="text-cream/80 text-lg mb-6 leading-relaxed">
            الدفع عند الاستلام. التوصيل في 24-48 ساعة. كنعيطو ليك بالداريجة باش نأكدو الطلب.
            إذا ما عجبكيش المنتج، تواصلي معنا وكنحلو المشكل — هذا هو معنى ضمان حنينة.
          </p>
          <Link
            href="/products"
            className="bg-cream text-pharmacy font-bold text-lg px-10 py-4 rounded-full hover:bg-white transition-colors inline-block"
          >
            تسوقي صيدلية حنينة
          </Link>
        </div>
      </section>

      {/* Founder note placeholder */}
      <section className="section-padding bg-cream">
        <div className="container-site max-w-2xl">
          <div className="bg-white rounded-3xl p-8 border border-pharmacy/10 shadow-sm">
            <div className="w-16 h-16 bg-pharmacy/10 text-pharmacy rounded-full flex items-center justify-center text-2xl mb-4">
              ✚
            </div>
            <p className="text-ink italic text-lg leading-relaxed mb-4">
              &quot;بنينا حنينة لأنا كنا كنبغيو منتجات نتيقو فيهم لراسنا ولوليداتنا — وما كنا كنلقاوهمش. خلقنا الصيدلية اللي كنا حنا بنفسنا بغيناها تكون موجودة.&quot;
            </p>
            <p className="text-pharmacy font-bold">— فريق حنينة</p>
          </div>
        </div>
      </section>
    </>
  );
}
