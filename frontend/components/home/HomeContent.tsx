"use client";

import Link from "next/link";
import { PlaceholderImage } from "@/components/brand/PlaceholderImage";
import { ProductCard } from "@/components/product/ProductCard";
import { TrustBadges } from "@/components/brand/TrustBadges";
import { SectionHeader } from "@/components/brand/SectionHeader";
import { PRODUCTS_LIST } from "@/config/products";
import { ProductFaq } from "@/components/product/ProductFaq";
import { ScrollReveal } from "@/components/ui/ScrollReveal";

const homeFaq = [
  {
    question: "علاش نثق فحنينة بحال صيدلية؟",
    answer:
      "حنينة كتشتغل بمنطق صيدلية طبيعية: كل تركيبة مختبرة جلديا، كل مكون موثق فالملصق (INCI كامل)، وكل منتج موصى به من طرف أطباء الأطفال والقابلات. كنخدمو فقط بمكونات معروفة فالمغرب وبدون مواد كيميائية قاسية.",
  },
  {
    question: "واش المنتجات مامونة على البيبي وعلى الماما الحامل؟",
    answer:
      "نعم. منتجات حنينة موضعية، طبيعية، خالية من البارابين والسلفات والكحول والعطور الاصطناعية. مع ذلك، كنوصيك دائما بإختبار صغير على منطقة صغيرة قبل أول استعمال — كما توصي به أي صيدلية.",
  },
  {
    question: "واش نقدر نخلص عند الاستلام؟",
    answer:
      "بالتأكيد. الدفع عند الاستلام هو الطريقة الوحيدة للدفع فحنينة. ما كتخلصي والو حتى توصلك السلعة بيديك وتتأكدي منها.",
  },
  {
    question: "شحال كيوصل الطلب؟",
    answer:
      "التوصيل في 24-48 ساعة فأغلب مدن المغرب. كنعيطو ليك أولا باش نأكدو الطلب ونأخذو العنوان النهائي بالداريجة.",
  },
  {
    question: "واش نقدر نطلب أكثر من منتج؟",
    answer:
      "نعم. كلما زادت الكمية، كلما كان الثمن أحسن: قطعة 199 درهم · قطعتان 299 درهم · ثلاث قطع 399 درهم. كتقدري تخلطي بين منتجات الماما ومنتجات البيبي.",
  },
];

export function HomeContent() {
  return (
    <>
      {/* 1. HERO — apothecary authority + maternal warmth */}
      <section className="bg-gradient-to-b from-cream via-cream to-cream section-padding relative overflow-hidden">
        <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-pharmacy/5 rounded-full blur-[100px] -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-blush/10 rounded-full blur-[80px] translate-x-1/3 translate-y-1/3"></div>
        <div className="container-site relative">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="flex flex-col gap-6 order-2 lg:order-1 animate-fade-up">
              <span className="chip-authority self-start animate-fade-up delay-100">
                ✚ صيدلية طبيعية · ماما والبيبي
              </span>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-ink leading-tight text-balance animate-fade-up delay-200">
                <span className="gradient-text">حنينة</span> — الصيدلية الطبيعية المغربية
                <span className="block text-ink/90 mt-2">لماما والبيبي</span>
              </h1>
              <p className="text-lg md:text-xl text-ink/70 leading-relaxed animate-fade-up delay-300">
                مكونات مغربية أصيلة — الهندية، الأرغان، إكليل الجبل، الجرجير والكاليندولا —
                مصاغة فتركيبات مختبرة جلديا، وموصى بها من طرف{" "}
                <strong className="text-pharmacy">أطباء الأطفال والقابلات</strong>.
                ما عاد خاصك تخمي قبل ما تطلبي.
              </p>

              <div className="animate-fade-up delay-400">
                <TrustBadges
                  variant="chips"
                  badges={[
                    { icon: "👩‍⚕️", text: "موصى به من أطباء الأطفال" },
                    { icon: "🧪", text: "مختبر جلديا" },
                    { icon: "🇲🇦", text: "صنع في المغرب" },
                    { icon: "💵", text: "الدفع عند الاستلام" },
                  ]}
                />
              </div>

              <div className="flex flex-col sm:flex-row gap-3 mt-4 animate-fade-up delay-500">
                <Link href="/products" className="btn-primary text-center text-lg px-8 py-4 animate-pulse-glow">
                  تسوقي صيدلية حنينة
                </Link>
                <Link href="#why-hnina" className="btn-secondary text-center text-lg px-8 py-4">
                  علاش الماميات كيثقو فينا؟
                </Link>
              </div>

              <p className="text-sm text-ink/50 mt-2 font-medium">
                ✚ +10.000 ماما مغربية كتختار حنينة · تركيبات بدون بارابين، سلفات، كحول أو عطور اصطناعية
              </p>
            </div>

            <div className="order-1 lg:order-2 relative animate-scale-in delay-200">
              <div className="absolute inset-0 bg-pharmacy/5 rounded-[3rem] transform -rotate-3 scale-105 -z-10 animate-float"></div>
              <PlaceholderImage
                imageKey="home-hero-moroccan-mom-baby-natural-care"
                alt="ماما مغربية مع بيبيها تستخدم منتجات حنينة الطبيعية"
                aspectRatio="portrait"
                className="max-w-md mx-auto lg:max-w-none rounded-[3rem] shadow-2xl img-zoom"
              />
            </div>
          </div>
        </div>
      </section>

      {/* 1b. AUTHORITY STRIP — pharmacy-grade trust bar */}
      <section className="bg-pharmacy text-cream py-6 border-y border-pharmacy/30">
        <div className="container-site">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 text-center">
            {[
              { icon: "👩‍⚕️", label: "موصى به من أطباء الأطفال والقابلات" },
              { icon: "🧪", label: "مختبر جلديا — تركيبات لطيفة" },
              { icon: "🌿", label: "مكونات مغربية من تعاونيات معتمدة" },
              { icon: "🛡️", label: "بدون بارابين · سلفات · كحول · عطور" },
            ].map((b) => (
              <div key={b.label} className="flex flex-col items-center gap-1.5">
                <span className="text-2xl" role="img" aria-hidden="true">{b.icon}</span>
                <span className="text-xs md:text-sm font-bold text-cream/90 leading-tight">{b.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 2. PAIN / EMPATHY */}
      <section className="section-padding bg-white border-y border-ink/5">
        <div className="container-site">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <ScrollReveal direction="right" className="order-1 lg:order-1 relative">
              <div className="absolute -inset-4 bg-blush/10 rounded-full blur-3xl -z-10"></div>
              <PlaceholderImage
                imageKey="home-empathy-mom"
                alt="أمومة بكل تحدياتها وجمالها"
                aspectRatio="square"
                className="rounded-3xl shadow-md img-zoom"
              />
            </ScrollReveal>
            <ScrollReveal direction="left" className="order-2 lg:order-2 flex flex-col gap-6">
              <SectionHeader
                eyebrow="حنا كنفهموك"
                title="ما بقاتش كتلقاي منتجات لماما وللبيبي تستحقي تثقي فيها؟"
                align="start"
              />
              <p className="text-xl leading-relaxed text-ink/80 border-r-4 border-pharmacy pr-6 py-2">
                المنتجات المستوردة غاليين، الزيوت ديال السوق ما عندهاش ضمانة، والصيدلية كتعطيك منتجات كيميائية ما كتفهميش مكوناتها. ما بقاتش عارفة شكون تثقي فيه — لا ليك ولا لبيبيك.
              </p>
              <p className="text-lg text-ink/70 leading-relaxed">
                داكشي علاش خلقنا <span className="font-bold text-pharmacy">حنينة</span> — صيدلية طبيعية مغربية لماما والبيبي. كل تركيبة مدروسة، كل مكون موثق، كل منتج موصى به من طرف أطباء الأطفال والقابلات. الجمع بين العلم والطبيعة، باللهجة المغربية.
              </p>
              <div className="flex flex-wrap gap-2 mt-2">
                <span className="chip-authority">✚ تركيبات مدروسة</span>
                <span className="chip-authority">✚ مكونات موثقة</span>
                <span className="chip-authority">✚ موصى بها طبيا</span>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* 3. THREE SECTIONS — رفوف الصيدلية */}
      <section className="section-padding bg-cream">
        <div className="container-site">
          <ScrollReveal>
            <SectionHeader
              eyebrow="رفوف صيدلية حنينة"
              title="ثلاثة حلول طبيعية · لماما وللبيبي"
              subtitle="كل منتج موجه لمشكلة وحدة، بتركيبة مدروسة ومكونات معروفة فالصيدليات المغربية."
              className="mb-12"
            />
          </ScrollReveal>
          <ScrollReveal stagger>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  emoji: "🌸",
                  category: "للماما — الحمل وبعده",
                  title: "تشققات الحمل وشد البشرة",
                  body: "حنينة ماما: زيت الهندية والأرغان من تعاونيات سوس — يدعم مرونة البشرة خلال الحمل وبعد الولادة.",
                  href: "/products/hnina-mama",
                  cta: "اكتشفي حنينة ماما",
                  bg: "from-blush/15 to-white",
                },
                {
                  emoji: "💆‍♀️",
                  category: "للماما — تساقط الشعر",
                  title: "تقوية الجذور بعد الولادة",
                  body: "حنينة جذور: إكليل الجبل، الجرجير والنيجلة — تركيبة تراثية معروفة فالصيدلية المغربية.",
                  href: "/products/hnina-jodour",
                  cta: "اكتشفي حنينة جذور",
                  bg: "from-sage/15 to-white",
                },
                {
                  emoji: "👶",
                  category: "للبيبي — البشرة الحساسة",
                  title: "ترطيب البشرة الجافة والمتهيجة",
                  body: "حنينة كالم: بلسم الكاليندولا والأرغان وشمع النحل — للبشرة الحساسة جدا ديال البيبي.",
                  href: "/products/hnina-calm",
                  cta: "اكتشفي حنينة كالم",
                  bg: "from-gold/15 to-white",
                },
              ].map((card) => (
                <Link
                  key={card.href}
                  href={card.href}
                  className={`bg-gradient-to-br ${card.bg} rounded-3xl p-8 flex flex-col gap-3 hover-lift group border border-pharmacy/10`}
                >
                  <span className="text-5xl mb-2" role="img" aria-hidden="true">
                    {card.emoji}
                  </span>
                  <span className="chip-authority self-start">{card.category}</span>
                  <h3 className="text-2xl font-bold text-ink">{card.title}</h3>
                  <p className="text-ink/70 text-base leading-relaxed flex-grow">{card.body}</p>
                  <span className="text-pharmacy font-bold text-base group-hover:underline mt-4 flex items-center gap-2">
                    {card.cta}{" "}
                    <span className="text-xl transition-transform group-hover:-translate-x-1">←</span>
                  </span>
                </Link>
              ))}
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* 4. PROTOCOLE — لي معايير حنينة */}
      <section className="section-padding bg-white">
        <div className="container-site">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <ScrollReveal direction="right" className="order-2 lg:order-1 flex flex-col gap-6">
              <SectionHeader
                eyebrow="بروتوكول حنينة"
                title="نفس الصرامة ديال الصيدلية — بمكونات الطبيعة"
                align="start"
              />
              <p className="text-lg text-ink/70 leading-relaxed">
                كل منتج فحنينة كيدوز من بروتوكول صارم قبل ما يوصل ليك: اختيار المكون من تعاونية معتمدة،
                تحليل مخبري، اختبار جلدي، مراجعة من طبيب أطفال أو قابلة، ترقيم الدفعة (batch code)
                باش كل قنينة تكون قابلة للتتبع.
              </p>
              <div className="mt-4 flex flex-col gap-4">
                <div className="glass p-5 rounded-2xl flex gap-4 items-center hover-lift">
                  <span className="text-3xl">🧪</span>
                  <div>
                    <h4 className="font-bold text-ink mb-1">مختبر جلديا · INCI كامل</h4>
                    <p className="text-sm text-ink/60">
                      كل تركيبة مختبرة لتجنب أي تهيج، ومكوناتها كاملة موثقة فالملصق بحال الصيدلية.
                    </p>
                  </div>
                </div>
                <div className="glass p-5 rounded-2xl flex gap-4 items-center hover-lift">
                  <span className="text-3xl">👩‍⚕️</span>
                  <div>
                    <h4 className="font-bold text-ink mb-1">مراجعة من أطباء الأطفال والقابلات</h4>
                    <p className="text-sm text-ink/60">
                      كل منتج كيتم مراجعتو من طرف مهنيين فالميدان قبل ما يدخل الكاطالوگ ديال حنينة.
                    </p>
                  </div>
                </div>
                <div className="glass p-5 rounded-2xl flex gap-4 items-center hover-lift">
                  <span className="text-3xl">🛡️</span>
                  <div>
                    <h4 className="font-bold text-ink mb-1">0٪ بارابين · سلفات · كحول · عطور اصطناعية</h4>
                    <p className="text-sm text-ink/60">
                      ولا أي مكون مشكوك فيه. تركيبات نظيفة، بسيطة، ومفهومة — بحال ما خاص يكون.
                    </p>
                  </div>
                </div>
                <div className="glass p-5 rounded-2xl flex gap-4 items-center hover-lift">
                  <span className="text-3xl">🇲🇦</span>
                  <div>
                    <h4 className="font-bold text-ink mb-1">صنع في المغرب · مكونات من التعاونيات</h4>
                    <p className="text-sm text-ink/60">
                      الأرغان من سوس، الهندية من أگادير، اللافندة من الأطلس المتوسط — أصول موثقة.
                    </p>
                  </div>
                </div>
              </div>
            </ScrollReveal>
            <ScrollReveal direction="left" className="order-1 lg:order-2 relative">
              <div className="absolute -inset-4 bg-sage/10 rounded-3xl transform rotate-3 -z-10"></div>
              <PlaceholderImage
                imageKey="science-lab-testing"
                alt="اختبارات الجودة والسلامة"
                aspectRatio="landscape"
                className="rounded-3xl shadow-md img-zoom"
              />
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* 5. PRODUCT COLLECTION PREVIEW */}
      <section className="section-padding bg-cream relative overflow-hidden">
        <div className="absolute top-1/2 left-0 w-[300px] h-[300px] bg-sage/5 rounded-full blur-[80px] -translate-x-1/2"></div>
        <div className="container-site relative">
          <ScrollReveal>
            <SectionHeader
              eyebrow="تسوقي الآن"
              title="اختاري العناية اللي تناسبك"
              subtitle="كل منتج مصمم بعناية لجانب مختلف من العناية بماما والبيبي"
              className="mb-12"
            />
          </ScrollReveal>
          <ScrollReveal stagger>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {PRODUCTS_LIST.map((product) => (
                <ProductCard key={product.slug} product={product} />
              ))}
            </div>
          </ScrollReveal>

          {/* AOV block — routine complète maman+bébé */}
          <ScrollReveal direction="scale">
            <div className="mt-16 bg-pharmacy text-cream rounded-[3rem] p-10 md:p-16 text-center relative overflow-hidden shadow-2xl">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>
              <div className="absolute inset-0 bg-gradient-to-br from-white/[0.03] to-transparent"></div>
              <div className="relative z-10">
                <span className="inline-block bg-gold/20 text-gold font-bold px-4 py-1.5 rounded-full mb-6 text-sm">
                  ✚ روتين ماما + بيبي
                </span>
                <h3 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 leading-tight">
                  خدي 2 ب 299 درهم<br />أو 3 ب 399 درهم
                </h3>
                <p className="text-cream/80 mb-10 text-xl max-w-2xl mx-auto leading-relaxed">
                  كلما زادت الكمية، كلما كان الثمن أحسن. خلطي بين منتج للماما ومنتج للبيبي — وكوني عندك صيدلية حنينة كاملة فالدار.
                </p>
                <Link href="/products" className="bg-cream text-pharmacy font-bold text-xl px-12 py-5 rounded-full hover:bg-white hover:shadow-xl transition-all inline-block shadow-lg hover-lift">
                  شوفي كل العروض
                </Link>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* 6. WHY HNINA */}
      <section id="why-hnina" className="section-padding bg-white">
        <div className="container-site">
          <ScrollReveal>
            <SectionHeader
              eyebrow="علاش حنينة"
              title="رحمة ماما · صرامة صيدلية"
              subtitle="هاد المعادلة هي الفرق بين زيت من السوق وصيدلية طبيعية كتفهم الماما المغربية."
              className="mb-16"
            />
          </ScrollReveal>

          <div className="flex flex-col gap-20">
            {[
              {
                title: "بحال صيدلية — بشفافية كاملة على المكونات",
                body: "كل قنينة فحنينة كاتجي بـ INCI كامل على الملصق، رقم دفعة (batch code)، تاريخ صلاحية واضح، ومصدر المكون. مكونات طبيعية مغربية، موثقة، بلا أي مفاجآت. هاد المستوى من الشفافية ما كاتلقاهش فالسوق ولا فالزيوت ديال السوبيرماركي.",
                imageKey: "ingredient-argan",
                badges: ["INCI كامل", "رقم دفعة", "تاريخ صلاحية واضح"],
                reverse: false,
              },
              {
                title: "بحال ماما — باللهجة، عند الاستلام، بلا ضغط",
                body: "كنعيطو ليك بالداريجة باش نأكدو الطلب، نأخذو العنوان، ونجاوبوك على أسئلتك. الدفع عند الاستلام فقط — ما تخلصي والو حتى توصلك السلعة بيديك. وإلا ما عجبكيش المنتج، تواصلي معنا وكنحلو المشكل.",
                imageKey: "home-hero-moroccan-mom-baby-natural-care",
                badges: ["مكالمة بالداريجة", "دفع عند الاستلام", "توصيل 24-48 ساعة"],
                reverse: true,
              },
            ].map((item, idx) => (
              <div
                key={idx}
                className={`grid grid-cols-1 lg:grid-cols-2 gap-12 items-center`}
              >
                <ScrollReveal
                  direction={item.reverse ? "left" : "right"}
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
                </ScrollReveal>
                <ScrollReveal
                  direction={item.reverse ? "right" : "left"}
                  className={item.reverse ? "lg:order-1" : "lg:order-2"}
                >
                  <PlaceholderImage
                    imageKey={item.imageKey}
                    alt={item.title}
                    aspectRatio="landscape"
                    className="rounded-3xl shadow-md img-zoom"
                  />
                </ScrollReveal>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. INGREDIENTS FROM NATURE */}
      <section className="section-padding bg-cream relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-gold/5 rounded-full blur-[100px] translate-x-1/3 -translate-y-1/3"></div>
        <div className="container-site relative">
          <ScrollReveal>
            <SectionHeader
              eyebrow="من الطبيعة"
              title="مكوناتنا — لطيفة ومفهومة"
              subtitle="كل مكون اخترناه بعناية لأثره الطبيعي على بشرة الماما والبيبي"
              className="mb-12"
            />
          </ScrollReveal>
          <ScrollReveal stagger>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {[
                { key: "ingredient-prickly-pear", nameAr: "زيت الهندية", origin: "من سوس المغربية", icon: "🌵" },
                { key: "ingredient-argan", nameAr: "زيت الأرغان", origin: "تعاونيات مغربية", icon: "✨" },
                { key: "ingredient-rosemary", nameAr: "إكليل الجبل", origin: "طبيعي 100٪", icon: "🌿" },
                { key: "ingredient-jarjir", nameAr: "زيت الجرجير", origin: "تراث مغربي", icon: "🌱" },
                { key: "ingredient-calendula", nameAr: "الكاليندولا", origin: "طبيعي 100٪", icon: "🌸" },
              ].map((ing) => (
                <div
                  key={ing.key}
                  className="glass rounded-3xl p-6 text-center flex flex-col items-center gap-4 hover-lift"
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
          </ScrollReveal>
        </div>
      </section>

      {/* 8. AUTHORITY SECTION — pediatrician + midwife */}
      <section className="section-padding bg-white">
        <div className="container-site">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <ScrollReveal direction="right" className="order-1 lg:order-1 relative">
              <div className="absolute inset-0 bg-pharmacy/15 rounded-3xl transform -rotate-3 scale-105 -z-10"></div>
              <PlaceholderImage
                imageKey="authority-pediatrician-placeholder"
                alt="طبيبة أطفال تنصح بمنتجات حنينة"
                aspectRatio="square"
                className="rounded-3xl shadow-lg img-zoom"
              />
            </ScrollReveal>
            <ScrollReveal direction="left" className="order-2 lg:order-2 flex flex-col gap-6">
              <SectionHeader
                eyebrow="✚ ثقة الخبراء"
                title="موصى به من طرف أطباء الأطفال والقابلات المغربيات"
                align="start"
              />
              <div className="glass rounded-3xl p-8 relative hover-lift">
                <span className="absolute top-4 right-6 text-6xl text-sage/30 font-serif">&quot;</span>
                <p className="text-ink italic text-xl leading-relaxed mb-6 relative z-10">
                  المكونات الطبيعية اللطيفة هي الخيار الأفضل لبشرة البيبي والماما.
                  مكونات حنينة مختارة بعناية وتجمع بين الفعالية واللطف، بدون أي مواد كيميائية قد تسبب تهيجات.
                </p>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-sage/30 rounded-full flex items-center justify-center text-xl">👩‍⚕️</div>
                  <div>
                    <p className="font-bold text-ink">د. فاطمة الزهراء</p>
                    <p className="text-ink/60 text-sm">طبيبة أطفال متخصصة</p>
                  </div>
                </div>
              </div>
              <div className="bg-blush/10 rounded-3xl p-8 relative mt-2 border border-blush/20 hover-lift">
                <span className="absolute top-4 right-6 text-6xl text-blush/30 font-serif">&quot;</span>
                <p className="text-ink italic text-xl leading-relaxed mb-6 relative z-10">
                  في فترة الحمل والنفاس، العناية بالبشرة مهمة. الهندية والأرغان من أفضل ما يمكن اختياره للحفاظ على مرونة البشرة.
                </p>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blush/30 rounded-full flex items-center justify-center text-xl">🤱</div>
                  <div>
                    <p className="font-bold text-ink">مريم ب.</p>
                    <p className="text-ink/60 text-sm">قابلة معتمدة</p>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* 9. REVIEWS */}
      <section className="section-padding bg-cream border-y border-ink/5">
        <div className="container-site">
          <ScrollReveal>
            <SectionHeader
              eyebrow="آراء الزبونات"
              title="ماميات كيثقو في حنينة"
              className="mb-12"
            />
          </ScrollReveal>
          <ScrollReveal stagger>
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
                  text: "بدا شعري يطيح بزاف بعد الولادة وكنت قلقانة. بعد شهرين من حنينة جذور، التساقط قل وشعري ولا أقوى.",
                  product: "حنينة جذور",
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
                  className="glass rounded-3xl p-8 flex flex-col gap-4 hover-lift"
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
          </ScrollReveal>
        </div>
      </section>

      {/* 10. GUARANTEE — ضمان حنينة */}
      <section className="section-padding bg-white">
        <div className="container-site max-w-4xl text-center">
          <ScrollReveal direction="scale">
            <div className="bg-gradient-to-b from-cream to-white border border-pharmacy/20 rounded-[3rem] p-10 md:p-16 shadow-xl relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-pharmacy via-gold to-pharmacy"></div>
              <div className="w-24 h-24 bg-pharmacy/10 text-pharmacy rounded-full flex items-center justify-center text-5xl mx-auto mb-8 shadow-inner animate-float">
                ✚
              </div>
              <h2 className="text-3xl md:text-5xl font-bold text-ink mb-6">ضمان حنينة الكامل</h2>
              <p className="text-xl md:text-2xl text-ink/80 leading-relaxed max-w-2xl mx-auto mb-10">
                &quot;إلا ما كانش مزيان لوليدك، ما كاينش فحنينة.&quot;
                <br />
                كل منتج فحنينة كيدوز من بروتوكول الصيدلية ديالنا قبل ما يوصل ليك.
                ما عاد خاصك تجاربي بفلوسك — شوفي المنتج، تأكدي منو، وعاد خلصي.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <span className="glass px-6 py-3 rounded-full text-ink font-bold flex items-center gap-2 hover-lift">
                  <span className="text-pharmacy">✚</span> دفع عند الاستلام فقط
                </span>
                <span className="glass px-6 py-3 rounded-full text-ink font-bold flex items-center gap-2 hover-lift">
                  <span className="text-pharmacy">✚</span> توصيل 24-48 ساعة
                </span>
                <span className="glass px-6 py-3 rounded-full text-ink font-bold flex items-center gap-2 hover-lift">
                  <span className="text-pharmacy">✚</span> تتبع كل دفعة (batch)
                </span>
                <span className="glass px-6 py-3 rounded-full text-ink font-bold flex items-center gap-2 hover-lift">
                  <span className="text-pharmacy">✚</span> خدمة زبناء بالداريجة
                </span>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* 11. HOW COD WORKS */}
      <section className="section-padding bg-pharmacy text-cream relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-pharmacy via-pharmacy to-ink/50"></div>
        <div className="absolute top-0 left-0 w-[400px] h-[400px] bg-white/[0.02] rounded-full blur-[80px]"></div>
        <div className="container-site relative">
          <ScrollReveal>
            <SectionHeader
              eyebrow="بسيط وواضح"
              title="كيفاش كيوصل طلبك؟"
              subtitle="ثلاث خطوات بسيطة حتى يوصلك طلبك"
              className="mb-16 [&_h2]:text-cream [&_p]:text-cream/70 [&_span]:bg-cream/15 [&_span]:text-cream"
            />
          </ScrollReveal>
          <ScrollReveal stagger>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
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
                  <div className="w-20 h-20 glass-dark border-4 border-cream/20 rounded-full flex items-center justify-center font-bold text-3xl mb-6 shadow-lg">
                    {step.step}
                  </div>
                  <h3 className="font-bold text-2xl mb-4">{step.title}</h3>
                  <p className="text-cream/70 leading-relaxed text-lg">{step.body}</p>
                </div>
              ))}
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* 12. FAQ */}
      <section className="section-padding bg-white">
        <div className="container-site max-w-3xl">
          <ScrollReveal>
            <SectionHeader
              eyebrow="أسئلة شائعة"
              title="أسئلة تدور فبالك؟"
              className="mb-10"
            />
          </ScrollReveal>
          <ScrollReveal direction="up">
            <ProductFaq faq={homeFaq} />
          </ScrollReveal>
        </div>
      </section>

      {/* 13. FINAL CTA */}
      <section className="section-padding bg-gradient-to-b from-cream via-blush/10 to-blush/20 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(31,79,58,0.03)_0%,transparent_70%)]"></div>
        <div className="container-site text-center relative">
          <ScrollReveal direction="scale">
            <span className="chip-authority mb-6 inline-flex">✚ صيدلية حنينة الطبيعية</span>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-ink mb-6 leading-tight">
              ابدأي روتين العناية ديالك ودكشي ديال وليدك
            </h2>
            <p className="text-ink/70 text-xl mb-10 max-w-2xl mx-auto leading-relaxed">
              مكونات مغربية أصيلة، تركيبات مختبرة جلديا، موصى بها من طرف أطباء الأطفال والقابلات.
              الدفع عند الاستلام، التوصيل في 24-48 ساعة.
            </p>
            <Link
              href="/products"
              className="btn-primary text-2xl px-16 py-6 shadow-xl hover:shadow-2xl transition-all transform hover:-translate-y-1 animate-pulse-glow"
            >
              تسوقي صيدلية حنينة
            </Link>
          </ScrollReveal>
        </div>
      </section>
    </>
  );
}
