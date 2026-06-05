import type { Metadata } from "next";
import Link from "next/link";
import { PlaceholderImage } from "@/components/brand/PlaceholderImage";
import { ProductCard } from "@/components/product/ProductCard";
import { TrustBadges, COD_BADGES } from "@/components/brand/TrustBadges";
import { SectionHeader } from "@/components/brand/SectionHeader";
import { PRODUCTS_LIST } from "@/config/products";
import { ProductFaq } from "@/components/product/ProductFaq";

export const metadata: Metadata = {
  title: "حنينة | عناية طبيعية لماما والبيبي في المغرب",
  description:
    "منتجات حنينة للعناية بماما والبيبي بمكونات طبيعية — زيت الهندية، الأرغان، الخزامى، البابونج والكاليندولا. الدفع عند الاستلام والتوصيل في المغرب.",
};

const homeFaq = [
  {
    question: "واش المنتجات مامونة؟",
    answer:
      "نعم، كل منتجات حنينة مصممة بمكونات طبيعية، لطيفة على البشرة الحساسة. نوصيك تديري اختبار صغير على منطقة صغيرة قبل الاستعمال.",
  },
  {
    question: "واش نقدر نخلص عند الاستلام؟",
    answer:
      "بالتأكيد. الدفع عند الاستلام هو الطريقة الوحيدة للدفع. ما تخلصي والو حتى يوصلك الطلب.",
  },
  {
    question: "شحال كيوصل الطلب؟",
    answer:
      "التوصيل في 24-48 ساعة في معظم مدن المغرب. كنعيطو ليك نأكدو الطلب والعنوان قبل التوصيل.",
  },
  {
    question: "كيفاش كنستعمل كل منتج؟",
    answer:
      "كل منتج عنده تعليمات استعمال واضحة. بشكل عام: خدي كمية صغيرة، سخنيها بين يديك، ودهني برفق.",
  },
  {
    question: "واش نقدر نطلب أكثر من منتج؟",
    answer:
      "نعم. كلما زادت الكمية، كلما كان الثمن أحسن. قطعتان بـ 299 درهم وثلاث قطع بـ 399 درهم.",
  },
];

export default function HomePage() {
  return (
    <>
      {/* 1. HERO (Text Right, Image Left) */}
      <section className="bg-gradient-to-b from-blush/10 to-cream section-padding">
        <div className="container-site">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Text - Right in RTL */}
            <div className="flex flex-col gap-6 order-2 lg:order-1">
              <span className="badge-gold self-start">علامة مغربية لماما والبيبي</span>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-ink leading-tight text-balance">
                عناية طبيعية وموثوقة للحظات اللي كتهمك{" "}
                <span className="text-forest">أنتِ ووليدك</span>
              </h1>
              <p className="text-lg md:text-xl text-ink/70 leading-relaxed">
                حنينة كتجمع مكونات معروفة فالمغرب بحال الهندية، الأرغان، الخزامى،
                البابونج والكاليندولا فمنتجات لطيفة وسهلة الاستعمال.
              </p>

              {/* Trust row */}
              <TrustBadges
                variant="chips"
                badges={[
                  { icon: "💵", text: "الدفع عند الاستلام" },
                  { icon: "🚀", text: "توصيل 24-48 ساعة" },
                  { icon: "🧪", text: "مختبر جلديا" },
                  { icon: "💚", text: "مناسب للبشرة الحساسة" },
                ]}
              />

              <div className="flex flex-col sm:flex-row gap-3 mt-4">
                <Link href="/products" className="btn-primary text-center text-lg px-8 py-4">
                  تسوقي منتجات حنينة
                </Link>
                <Link href="#why-hnina" className="btn-secondary text-center text-lg px-8 py-4">
                  علاش الماميات كيثقو فينا؟
                </Link>
              </div>
            </div>

            {/* Image - Left in RTL */}
            <div className="order-1 lg:order-2 relative">
              <div className="absolute inset-0 bg-forest/5 rounded-[3rem] transform -rotate-3 scale-105 -z-10"></div>
              <PlaceholderImage
                imageKey="home-hero-moroccan-mom-baby-natural-care"
                alt="ماما مغربية مع بيبيها تستخدم منتجات حنينة الطبيعية"
                aspectRatio="portrait"
                className="max-w-md mx-auto lg:max-w-none rounded-[3rem] shadow-xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* 2. PAIN / EMPATHY (Image Right, Text Left) */}
      <section className="section-padding bg-white border-y border-ink/5">
        <div className="container-site">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Image - Right in RTL */}
            <div className="order-1 lg:order-1 relative">
              <div className="absolute -inset-4 bg-blush/10 rounded-full blur-3xl -z-10"></div>
              <PlaceholderImage
                imageKey="home-empathy-mom"
                alt="أمومة بكل تحدياتها وجمالها"
                aspectRatio="square"
                className="rounded-3xl shadow-md"
              />
            </div>
            {/* Text - Left in RTL */}
            <div className="order-2 lg:order-2 flex flex-col gap-6">
              <SectionHeader
                eyebrow="حنا كنفهموك"
                title="الأمومة زوينة، ولكن أحيانا كتحسي بالضغط"
                align="start"
              />
              <p className="text-xl leading-relaxed text-ink/80 border-r-4 border-blush pr-6 py-2">
                عارفين بلي كتخافي على بيبيك من أي حاجة كيميائية، وعارفين بلي جسمك تبدل وبغيتي ترجعي ثقتك بنفسك بلا ما تستعملي منتجات مجهولة المصدر.
              </p>
              <p className="text-lg text-ink/70 leading-relaxed">
                داكشي علاش خلقنا <span className="font-bold text-forest">حنينة</span>. باش نعطيوك منتجات طبيعية، بسيطة، ومفهومة. منتجات كترد ليك الثقة والراحة، وكتخليك تستمتعي بكل لحظة مع وليدك.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. PROBLEM TRIPTYCH */}
      <section className="section-padding bg-cream">
        <div className="container-site">
          <SectionHeader
            eyebrow="منتجاتنا"
            title="حلول طبيعية لكل لحظة"
            subtitle="حنينة كتفهم التحديات اليومية لكل ماما وكتقدم حلول طبيعية وبسيطة"
            className="mb-12"
          />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                emoji: "🌿",
                title: "تشققات الحمل وشد البشرة",
                body: "زيت الهندية والأرغان يساعد بشرتك تبقى مرنة خلال الحمل وبعد الولادة",
                href: "/products/hnina-mama",
                cta: "اكتشفي حنينة ماما",
                bg: "from-blush/15 to-white",
              },
              {
                emoji: "🌙",
                title: "نوم البيبي والليالي الصعيبة",
                body: "رتوال هادئ بالخزامى والبابونج لتدليك البيبي قبل النوم بلطف",
                href: "/products/hnina-lila",
                cta: "اكتشفي حنينة ليلى",
                bg: "from-sage/15 to-white",
              },
              {
                emoji: "🌸",
                title: "البشرة الجافة والحساسة",
                body: "بلسم الكاليندولا والأرغان يرطب ويهدئ بشرة البيبي الحساسة",
                href: "/products/hnina-calm",
                cta: "اكتشفي حنينة كالم",
                bg: "from-gold/15 to-white",
              },
            ].map((card) => (
              <Link
                key={card.href}
                href={card.href}
                className={`bg-gradient-to-br ${card.bg} rounded-3xl p-8 flex flex-col gap-4 hover:shadow-lg transition-all transform hover:-translate-y-1 group border border-ink/5`}
              >
                <span className="text-5xl mb-2" role="img" aria-hidden="true">
                  {card.emoji}
                </span>
                <h3 className="text-2xl font-bold text-ink">{card.title}</h3>
                <p className="text-ink/70 text-base leading-relaxed flex-grow">{card.body}</p>
                <span className="text-forest font-bold text-base group-hover:underline mt-4 flex items-center gap-2">
                  {card.cta} <span className="text-xl">←</span>
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 4. SCIENCE & PROOF (Text Right, Image Left) */}
      <section className="section-padding bg-white">
        <div className="container-site">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Text - Right in RTL */}
            <div className="order-2 lg:order-1 flex flex-col gap-6">
              <SectionHeader
                eyebrow="العلم والطبيعة"
                title="جودة مختبرة، أمان مضمون"
                align="start"
              />
              <p className="text-lg text-ink/70 leading-relaxed">
                ماشي غير هضرة. منتجات حنينة كتدوز من اختبارات صارمة باش نتأكدو أنها آمنة 100% على بشرتك وبشرة بيبيك.
              </p>
              <div className="mt-4 flex flex-col gap-4">
                <div className="bg-sage/5 p-5 rounded-2xl border border-sage/20 flex gap-4 items-center">
                  <span className="text-3xl">🔬</span>
                  <div>
                    <h4 className="font-bold text-ink mb-1">مختبر جلدياً</h4>
                    <p className="text-sm text-ink/60">تم اختباره من طرف أطباء الجلد للتأكد من خلوه من أي مهيجات.</p>
                  </div>
                </div>
                <div className="bg-sage/5 p-5 rounded-2xl border border-sage/20 flex gap-4 items-center">
                  <span className="text-3xl">🌿</span>
                  <div>
                    <h4 className="font-bold text-ink mb-1">0% مواد كيميائية قاسية</h4>
                    <p className="text-sm text-ink/60">بدون بارابين، بدون سلفات، وبدون عطور اصطناعية.</p>
                  </div>
                </div>
              </div>
            </div>
            {/* Image - Left in RTL */}
            <div className="order-1 lg:order-2 relative">
              <div className="absolute -inset-4 bg-sage/10 rounded-3xl transform rotate-3 -z-10"></div>
              <PlaceholderImage
                imageKey="science-lab-testing"
                alt="اختبارات الجودة والسلامة"
                aspectRatio="landscape"
                className="rounded-3xl shadow-md"
              />
            </div>
          </div>
        </div>
      </section>

      {/* 5. PRODUCT COLLECTION PREVIEW */}
      <section className="section-padding bg-cream">
        <div className="container-site">
          <SectionHeader
            eyebrow="تسوقي الآن"
            title="اختاري العناية اللي تناسبك"
            subtitle="كل منتج مصمم بعناية لجانب مختلف من العناية بماما والبيبي"
            className="mb-12"
          />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {PRODUCTS_LIST.map((product) => (
              <ProductCard key={product.slug} product={product} />
            ))}
          </div>

          {/* AOV block */}
          <div className="mt-16 bg-forest text-cream rounded-[3rem] p-10 md:p-16 text-center relative overflow-hidden shadow-xl">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>
            <div className="relative z-10">
              <span className="inline-block bg-gold/20 text-gold font-bold px-4 py-1 rounded-full mb-6 text-sm">عرض خاص</span>
              <h3 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 leading-tight">
                خدي 2 ب 299 درهم<br/>أو 3 ب 399 درهم
              </h3>
              <p className="text-cream/80 mb-10 text-xl max-w-2xl mx-auto leading-relaxed">
                كلما زادت الكمية، كلما كان الثمن أحسن. ابدأي برتوال متكامل من أول طلب، واستافدي من التوصيل السريع.
              </p>
              <Link href="/products" className="bg-cream text-forest font-bold text-xl px-12 py-5 rounded-full hover:bg-blush/20 hover:text-ink transition-colors inline-block shadow-lg">
                شوفي كل العروض
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 6. WHY HNINA (Alternating) */}
      <section id="why-hnina" className="section-padding bg-white">
        <div className="container-site">
          <SectionHeader
            eyebrow="لماذا حنينة"
            title="عناية كتجمع بين الحنان والمعرفة"
            className="mb-16"
          />

          <div className="flex flex-col gap-20">
            {[
              {
                title: "مكونات مفهومة ومن مصادر موثوقة",
                body: "عارفة شحال كتقلقي من أي حاجة كتستعمليها فالدار مع البيبي. لذلك حنينة كتختار مكونات طبيعية، لطيفة، ومفهومة. زيت الهندية من سوس، والأرغان من تعاونيات مغربية.",
                imageKey: "ingredient-argan",
                badges: ["بدون بارابين", "بدون كحول", "مكونات طبيعية"],
                reverse: false, // Image Right, Text Left
              },
              {
                title: "الدفع عند الاستلام — ما تخسري والو",
                body: "نعرفو أن الشراء أونلاين كيخلي بعض الماميات قلقانات. لهذا كنقدمو الدفع عند الاستلام فقط. كتشوفي المنتج وكتتأكدي منو قبل ما تخلصي.",
                imageKey: "home-hero-moroccan-mom-baby-natural-care",
                badges: ["الدفع عند الاستلام", "توصيل 24-48 ساعة"],
                reverse: true, // Text Right, Image Left
              },
            ].map((item, idx) => (
              <div
                key={idx}
                className={`grid grid-cols-1 lg:grid-cols-2 gap-12 items-center ${item.reverse ? "lg:flex-row-reverse" : ""}`}
              >
                <div
                  className={`flex flex-col gap-5 ${item.reverse ? "lg:order-2" : "lg:order-1"}`}
                >
                  <h3 className="text-3xl font-bold text-ink leading-tight">
                    {item.title}
                  </h3>
                  <p className="text-ink/70 leading-relaxed text-lg">{item.body}</p>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {item.badges.map((b) => (
                      <span key={b} className="trust-chip font-medium">{b}</span>
                    ))}
                  </div>
                </div>
                <div className={item.reverse ? "lg:order-1" : "lg:order-2"}>
                  <PlaceholderImage
                    imageKey={item.imageKey}
                    alt={item.title}
                    aspectRatio="landscape"
                    className="rounded-3xl shadow-md"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. INGREDIENTS FROM NATURE */}
      <section className="section-padding bg-cream">
        <div className="container-site">
          <SectionHeader
            eyebrow="من الطبيعة"
            title="مكوناتنا — لطيفة ومفهومة"
            subtitle="كل مكون اخترناه بعناية لأثره الطبيعي على بشرة الماما والبيبي"
            className="mb-12"
          />
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {[
              { key: "ingredient-prickly-pear", nameAr: "زيت الهندية", origin: "من سوس المغربية", icon: "🌵" },
              { key: "ingredient-argan", nameAr: "زيت الأرغان", origin: "تعاونيات مغربية", icon: "✨" },
              { key: "ingredient-lavender", nameAr: "الخزامى", origin: "طبيعي 100٪", icon: "💜" },
              { key: "ingredient-chamomile", nameAr: "البابونج", origin: "طبيعي 100٪", icon: "🌼" },
              { key: "ingredient-calendula", nameAr: "الكاليندولا", origin: "طبيعي 100٪", icon: "🌸" },
            ].map((ing) => (
              <div
                key={ing.key}
                className="bg-white rounded-3xl p-6 text-center flex flex-col items-center gap-4 border border-ink/5 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="w-20 h-20 bg-sage/10 rounded-full flex items-center justify-center text-4xl">
                  <span role="img" aria-hidden="true">{ing.icon}</span>
                </div>
                <div>
                  <p className="font-bold text-ink text-lg mb-1">{ing.nameAr}</p>
                  <p className="text-ink/50 text-sm">{ing.origin}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 8. AUTHORITY SECTION (Image Right, Text Left) */}
      <section className="section-padding bg-white">
        <div className="container-site">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Image - Right in RTL */}
            <div className="order-1 lg:order-1 relative">
              <div className="absolute inset-0 bg-sage/20 rounded-3xl transform -rotate-3 scale-105 -z-10"></div>
              <PlaceholderImage
                imageKey="authority-pediatrician-placeholder"
                alt="طبيبة أطفال تنصح بمنتجات حنينة"
                aspectRatio="square"
                className="rounded-3xl shadow-lg"
              />
            </div>
            {/* Text - Left in RTL */}
            <div className="order-2 lg:order-2 flex flex-col gap-6">
              <SectionHeader
                eyebrow="ثقة الخبراء"
                title="ينصح به أطباء الأطفال والقابلات"
                align="start"
              />
              <div className="bg-sage/10 rounded-3xl p-8 relative">
                <span className="absolute top-4 right-6 text-6xl text-sage/30 font-serif">&quot;</span>
                <p className="text-ink italic text-xl leading-relaxed mb-6 relative z-10">
                  المكونات الطبيعية اللطيفة هي الخيار الأفضل لبشرة البيبي والماما.
                  مكونات حنينة مختارة بعناية وتجمع بين الفعالية واللطف، بدون أي مواد كيميائية قد تسبب تهيجات.
                </p>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-sage/30 rounded-full flex items-center justify-center text-xl">👩‍⚕️</div>
                  <div>
                    <p className="font-bold text-ink">د. فاطمة الزهراء [سيتم الإضافة]</p>
                    <p className="text-ink/60 text-sm">طبيبة أطفال متخصصة</p>
                  </div>
                </div>
              </div>
              <div className="bg-blush/10 rounded-3xl p-8 relative mt-2">
                <span className="absolute top-4 right-6 text-6xl text-blush/30 font-serif">&quot;</span>
                <p className="text-ink italic text-xl leading-relaxed mb-6 relative z-10">
                  في فترة الحمل والنفاس، العناية بالبشرة مهمة. الهندية والأرغان من أفضل ما يمكن اختياره للحفاظ على مرونة البشرة.
                </p>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blush/30 rounded-full flex items-center justify-center text-xl">🤱</div>
                  <div>
                    <p className="font-bold text-ink">مريم [سيتم الإضافة]</p>
                    <p className="text-ink/60 text-sm">قابلة معتمدة</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 9. REVIEWS */}
      <section className="section-padding bg-cream border-y border-ink/5">
        <div className="container-site">
          <SectionHeader
            eyebrow="آراء الزبونات"
            title="ماميات كيثقو في حنينة"
            className="mb-12"
          />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                name: "سلمى",
                city: "الدار البيضاء",
                text: "جربت حنينة ماما فالحمل، الزيت خفيف وريحته طبيعية بزاف. كنستعملو كل يوم.",
                product: "حنينة ماما",
                rating: 5,
              },
              {
                name: "مريم",
                city: "الرباط",
                text: "حنينة ليلى ولات جزء من رتوال النعاس ديال ولدي. ريحتو هادية وبيبي كيتهدى.",
                product: "حنينة ليلى",
                rating: 5,
              },
              {
                name: "خديجة",
                city: "مراكش",
                text: "بلسم كالم عجبني حيث ما فيهش ريحة قوية وبشرة بنتي ولات مرتاحة.",
                product: "حنينة كالم",
                rating: 5,
              },
            ].map((review) => (
              <div
                key={review.name}
                className="bg-white rounded-3xl p-8 border border-ink/5 shadow-sm flex flex-col gap-4"
              >
                <div className="flex gap-1">
                  {[...Array(review.rating)].map((_, i) => (
                    <svg key={i} className="w-5 h-5 text-gold" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-ink/80 leading-relaxed text-lg italic">&quot;{review.text}&quot;</p>
                <div className="mt-auto pt-4 border-t border-ink/5 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-sage/20 rounded-full flex items-center justify-center text-forest font-bold">
                      {review.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-bold text-ink">{review.name}</p>
                      <p className="text-ink/50 text-xs">{review.city}</p>
                    </div>
                  </div>
                  <span className="bg-cream px-3 py-1 rounded-full text-xs font-bold text-forest">{review.product}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 10. GUARANTEE (Risk Reversal) */}
      <section className="section-padding bg-white">
        <div className="container-site max-w-4xl text-center">
          <div className="bg-gradient-to-b from-cream to-white border border-gold/20 rounded-[3rem] p-10 md:p-16 shadow-lg relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-gold via-forest to-gold"></div>
            <div className="w-24 h-24 bg-gold/10 text-gold rounded-full flex items-center justify-center text-5xl mx-auto mb-8 shadow-inner">
              🛡️
            </div>
            <h2 className="text-3xl md:text-5xl font-bold text-ink mb-6">ضمان حنينة 100%</h2>
            <p className="text-xl md:text-2xl text-ink/80 leading-relaxed max-w-2xl mx-auto mb-10">
              &quot;إلا ما كانش مزيان لوليدك، ما كاينش فحنينة.&quot;<br/>
              حنا متأكدين من جودة منتجاتنا. داكشي علاش كنقدمو ليك الدفع عند الاستلام. شوفي المنتج، تأكدي منو، وعاد خلصي. راحتك وراحة بيبيك هي الأهم عندنا.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <span className="bg-white border border-ink/10 px-6 py-3 rounded-full text-ink font-bold shadow-sm flex items-center gap-2">
                <span className="text-forest">✅</span> دفع عند الاستلام
              </span>
              <span className="bg-white border border-ink/10 px-6 py-3 rounded-full text-ink font-bold shadow-sm flex items-center gap-2">
                <span className="text-forest">✅</span> توصيل 24-48 ساعة
              </span>
              <span className="bg-white border border-ink/10 px-6 py-3 rounded-full text-ink font-bold shadow-sm flex items-center gap-2">
                <span className="text-forest">✅</span> خدمة زبناء في الاستماع
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 11. HOW COD WORKS */}
      <section className="section-padding bg-forest text-cream">
        <div className="container-site">
          <SectionHeader
            eyebrow="بسيط وواضح"
            title="كيفاش كيوصل طلبك؟"
            subtitle="ثلاث خطوات بسيطة حتى يوصلك طلبك"
            className="mb-16 [&_h2]:text-cream [&_p]:text-cream/70 [&_span]:bg-cream/15 [&_span]:text-cream"
          />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
            {/* Connecting line for desktop */}
            <div className="hidden md:block absolute top-10 left-[15%] right-[15%] h-0.5 bg-cream/20 -z-0"></div>
            
            {[
              {
                step: "1",
                title: "اختاري المنتج والعرض",
                body: "كتختاري المنتج اللي كتحتاجيه وكتختاري العرض المناسب — قطعة، قطعتان أو ثلاثة.",
              },
              {
                step: "2",
                title: "تأكيد الطلب عبر الهاتف",
                body: "كنعيطو ليك نأكدو الطلب ونأخذو العنوان النهائي. خلي تيليفونك قريب.",
              },
              {
                step: "3",
                title: "الدفع عند الاستلام",
                body: "كيوصلك الطلب خلال 24-48 ساعة وكتخلصي حتى توصلك السلعة بيديك.",
              },
            ].map((step) => (
              <div key={step.step} className="flex flex-col items-center text-center relative z-10">
                <div className="w-20 h-20 bg-forest border-4 border-cream/20 rounded-full flex items-center justify-center font-bold text-3xl mb-6 shadow-lg">
                  {step.step}
                </div>
                <h3 className="font-bold text-2xl mb-4">{step.title}</h3>
                <p className="text-cream/70 leading-relaxed text-lg">{step.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 12. FAQ */}
      <section className="section-padding bg-white">
        <div className="container-site max-w-3xl">
          <SectionHeader
            eyebrow="أسئلة شائعة"
            title="أسئلة تدور فبالك؟"
            className="mb-10"
          />
          <ProductFaq faq={homeFaq} />
        </div>
      </section>

      {/* 13. FINAL CTA */}
      <section className="section-padding bg-gradient-to-b from-cream to-blush/15">
        <div className="container-site text-center">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-ink mb-6 leading-tight">
            اختاري العناية اللي محتاجاها اليوم
          </h2>
          <p className="text-ink/70 text-xl mb-10 max-w-2xl mx-auto leading-relaxed">
            الدفع عند الاستلام، التوصيل في 24-48 ساعة، ومكونات طبيعية موثوقة.
          </p>
          <Link href="/products" className="btn-primary text-2xl px-16 py-6 shadow-xl hover:shadow-2xl transition-all transform hover:-translate-y-1">
            تسوقي منتجات حنينة
          </Link>
        </div>
      </section>
    </>
  );
}
