import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PRODUCTS_LIST, getProductBySlug, getCrossSellProducts } from "@/config/products";
import { PlaceholderImage } from "@/components/brand/PlaceholderImage";
import { TrustBadges, PRODUCT_BADGES } from "@/components/brand/TrustBadges";
import { SectionHeader } from "@/components/brand/SectionHeader";
import { IngredientCards } from "@/components/product/IngredientCards";
import { ProductFaq } from "@/components/product/ProductFaq";
import { CrossSellGrid } from "@/components/product/CrossSellGrid";
import { OfferSelector } from "@/components/product/OfferSelector";
import { ProductHeroClient } from "./ProductHeroClient";

export const dynamicParams = false;

export function generateStaticParams() {
  return PRODUCTS_LIST.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) return {};

  return {
    title: `${product.arabicName} | حنينة`,
    description: `${product.heroSubheadline} الدفع عند الاستلام والتوصيل في المغرب.`,
    openGraph: {
      title: product.arabicName,
      description: product.heroSubheadline,
      type: "website",
      url: `https://hnina.shop/products/${product.slug}`,
    },
    alternates: {
      canonical: `https://hnina.shop/products/${product.slug}`,
    },
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) notFound();

  const crossSells = getCrossSellProducts(product.slug);

  return (
    <>
      {/* 1. PRODUCT HERO (Text Right, Image Left) */}
      <section className="section-padding bg-gradient-to-b from-cream to-white">
        <div className="container-site">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            {/* Content - Right in RTL */}
            <div className="flex flex-col gap-6 order-2 lg:order-1 lg:sticky lg:top-28">
              {/* Rating */}
              <div className="flex items-center gap-2">
                <div className="flex gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-5 h-5 text-gold" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <span className="text-ink/50 text-sm">4.9 (مئات الماميات)</span>
              </div>

              <div>
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-ink leading-tight">
                  {product.heroHeadline}
                </h1>
                <p className="text-ink/70 text-lg md:text-xl mt-4 leading-relaxed">
                  {product.heroSubheadline}
                </p>
              </div>

              <TrustBadges variant="chips" badges={PRODUCT_BADGES} />

              {/* Offer selector — client component */}
              <OfferSelector product={product} />
            </div>

            {/* Images - Left in RTL */}
            <div className="order-1 lg:order-2 flex flex-col gap-4">
              <PlaceholderImage
                imageKey={product.heroImageKey}
                alt={product.arabicName}
                aspectRatio="portrait"
                label={`صورة ${product.latinName}`}
                className="rounded-3xl shadow-sm"
              />
              <div className="grid grid-cols-2 gap-4">
                <PlaceholderImage
                  imageKey={product.secondaryImageKey}
                  alt={`كيفاش تستعملي ${product.latinName}`}
                  aspectRatio="square"
                  className="rounded-2xl"
                />
                <PlaceholderImage
                  imageKey={`${product.heroImageKey}-texture`}
                  alt={`مكونات ${product.latinName}`}
                  aspectRatio="square"
                  className="rounded-2xl"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. PRODUCT DESCRIPTION */}
      <section className="section-padding bg-white">
        <div className="container-site">
          <div className="grid grid-cols-1 lg:grid-cols-[1.05fr_0.95fr] gap-8 items-stretch">
            <div className="rounded-3xl bg-gradient-to-br from-forest to-ink p-8 md:p-10 text-cream shadow-lg">
              <span className="inline-flex rounded-full bg-cream/15 px-4 py-2 text-sm font-bold text-cream">
                {product.salesDescription.badge}
              </span>
              <h2 className="mt-5 text-3xl md:text-4xl font-bold leading-tight whitespace-pre-line">
                {product.shortHeading}
              </h2>
              <p className="mt-6 text-lg leading-relaxed text-cream/85">
                {product.salesDescription.body}
              </p>
              <p className="mt-6 rounded-2xl bg-cream/10 p-5 text-lg font-semibold leading-relaxed text-cream">
                {product.salesDescription.finalNote}
              </p>
            </div>

            <div className="rounded-3xl border border-ink/10 bg-cream p-6 md:p-8 shadow-sm">
              <div className="mb-5">
                <p className="text-sm font-bold text-forest">وصف المنتج</p>
                <h3 className="mt-2 text-2xl md:text-3xl font-bold text-ink leading-tight">
                  {product.salesDescription.title}
                </h3>
              </div>
              <div className="flex flex-col gap-4">
                {product.salesDescription.bullets.map((bullet, idx) => (
                  <div
                    key={bullet}
                    className="flex gap-4 rounded-2xl bg-white p-4 border border-ink/5"
                  >
                    <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-forest text-sm font-bold text-cream">
                      {idx + 1}
                    </span>
                    <p className="text-ink/75 leading-relaxed font-medium">
                      {bullet}
                    </p>
                  </div>
                ))}
              </div>
              <div className="mt-6 flex flex-wrap gap-2 text-sm font-bold">
                <span className="rounded-full bg-forest/10 px-4 py-2 text-forest">
                  الدفع عند الاستلام
                </span>
                <span className="rounded-full bg-gold/15 px-4 py-2 text-ink">
                  توصيل 24-48 ساعة
                </span>
                <span className="rounded-full bg-blush/20 px-4 py-2 text-ink">
                  مكونات طبيعية
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. PAIN / EMPATHY (Image Right, Text Left) */}
      <section className="section-padding bg-blush/5 border-y border-blush/10">
        <div className="container-site">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Image - Right in RTL */}
            <div className="order-1 lg:order-1 relative">
              <div className="absolute inset-0 bg-blush/20 rounded-3xl transform rotate-3 scale-105 -z-10"></div>
              <PlaceholderImage
                imageKey={`pain-${product.slug}`}
                alt="ماما مغربية"
                aspectRatio="square"
                className="rounded-3xl shadow-md"
              />
            </div>
            {/* Text - Left in RTL */}
            <div className="order-2 lg:order-2 flex flex-col gap-6">
              <SectionHeader
                eyebrow="عارفين بلي..."
                title="الأمومة رحلة زوينة، ولكن أحيانا كتقلقي"
                align="start"
              />
              <p className="text-xl leading-relaxed text-ink/80 border-r-4 border-blush pr-6 py-2">
                {product.painBlock}
              </p>
              <p className="text-lg text-ink/70 leading-relaxed">
                حنا فـ <span className="font-bold text-forest">حنينة</span> كنفهمو هاد الإحساس. داكشي علاش صممنا هاد المنتج باش يعطيك الثقة والراحة اللي كتقلبي عليها، بمكونات طبيعية مئة بالمئة، بلا مواد كيماوية قاسية.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. MECHANISM / SCIENCE (Text Right, Image Left) */}
      <section className="section-padding bg-cream">
        <div className="container-site">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Text - Right in RTL */}
            <div className="order-2 lg:order-1 flex flex-col gap-6">
              <SectionHeader
                eyebrow="العلم والطبيعة"
                title="كيفاش كيخدم هاد المنتج؟"
                subtitle={product.mechanism}
                align="start"
              />
              <div className="mt-4 flex flex-col gap-4">
                <div className="bg-white p-5 rounded-2xl border border-ink/5 flex gap-4 items-center shadow-sm">
                  <span className="text-3xl">🧪</span>
                  <div>
                    <h4 className="font-bold text-ink mb-1">مختبر جلدياً</h4>
                    <p className="text-sm text-ink/60">تم اختباره للتأكد من سلامته على البشرة الحساسة.</p>
                  </div>
                </div>
                <div className="bg-white p-5 rounded-2xl border border-ink/5 flex gap-4 items-center shadow-sm">
                  <span className="text-3xl">🌿</span>
                  <div>
                    <h4 className="font-bold text-ink mb-1">فعالية طبيعية</h4>
                    <p className="text-sm text-ink/60">{product.safeClaim}</p>
                  </div>
                </div>
                <div className="bg-white p-5 rounded-2xl border border-ink/5 flex gap-4 items-center shadow-sm">
                  <span className="text-3xl">🚫</span>
                  <div>
                    <h4 className="font-bold text-ink mb-1">بدون مواد ضارة</h4>
                    <p className="text-sm text-ink/60">0% بارابين، 0% كحول، 0% عطور اصطناعية مسببة للحساسية.</p>
                  </div>
                </div>
              </div>
            </div>
            {/* Image - Left in RTL */}
            <div className="order-1 lg:order-2 relative">
              <div className="absolute -inset-4 bg-sage/10 rounded-full blur-2xl -z-10"></div>
              <PlaceholderImage
                imageKey={`lab-${product.slug}`}
                alt={`المكونات الطبيعية المختبرة في ${product.arabicName}`}
                aspectRatio="square"
                className="rounded-3xl shadow-md"
              />
            </div>
          </div>
        </div>
      </section>

      {/* 4. AUTHORITY & PROOF (Image Right, Text Left) */}
      <section className="section-padding bg-white">
        <div className="container-site">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Image - Right in RTL */}
            <div className="order-1 lg:order-1">
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
            </div>
          </div>
        </div>
      </section>

      {/* 5. INGREDIENTS */}
      <section className="section-padding bg-cream">
        <div className="container-site">
          <SectionHeader
            eyebrow="مكوناتنا"
            title="مكونات مفهومة ومن مصادر موثوقة"
            subtitle="شفافية تامة: هادشي اللي كاين فالقرعة، ولا شيء آخر."
            className="mb-12"
          />
          <IngredientCards ingredients={product.ingredients} />
        </div>
      </section>

      {/* 6. HOW TO USE (Text Right, Image Left) */}
      <section className="section-padding bg-white">
        <div className="container-site">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Text - Right in RTL */}
            <div className="order-2 lg:order-1">
              <SectionHeader
                eyebrow="طريقة الاستعمال"
                title="رتوال بسيط وسهل"
                align="start"
                className="mb-8"
              />
              <div className="flex flex-col gap-6">
                {product.howToUse.map((step, idx) => (
                  <div key={idx} className="flex gap-5 items-start bg-cream/50 rounded-2xl p-6 border border-ink/5">
                    <div className="flex-shrink-0 w-12 h-12 bg-forest text-cream font-bold rounded-full flex items-center justify-center text-xl shadow-sm">
                      {idx + 1}
                    </div>
                    <p className="text-ink text-lg leading-relaxed pt-2">{step}</p>
                  </div>
                ))}
              </div>
            </div>
            {/* Image - Left in RTL */}
            <div className="order-1 lg:order-2">
              <PlaceholderImage
                imageKey={`${product.slug}-how-to-use`}
                alt="طريقة الاستعمال"
                aspectRatio="landscape"
                className="rounded-3xl shadow-md"
              />
            </div>
          </div>
        </div>
      </section>

      {/* 8. REVIEWS */}
      <section className="section-padding bg-cream">
        <div className="container-site">
          <SectionHeader
            eyebrow="آراء الزبونات"
            title="شنو كيقولو الماميات على حنينة؟"
            className="mb-12"
          />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {product.reviews.map((review, idx) => (
              <div
                key={idx}
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
                <div className="mt-auto pt-4 border-t border-ink/5 flex items-center gap-3">
                  <div className="w-10 h-10 bg-sage/20 rounded-full flex items-center justify-center text-forest font-bold">
                    {review.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-bold text-ink">{review.name}</p>
                    <p className="text-ink/50 text-sm">{review.city} • مشترية مؤكدة</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 9. GUARANTEE (Risk Reversal) */}
      <section className="section-padding bg-white">
        <div className="container-site max-w-4xl text-center">
          <div className="bg-gradient-to-b from-cream to-white border border-gold/20 rounded-3xl p-10 md:p-16 shadow-sm">
            <div className="w-20 h-20 bg-gold/10 text-gold rounded-full flex items-center justify-center text-4xl mx-auto mb-6">
              🛡️
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-ink mb-6">ضمان حنينة 100%</h2>
            <p className="text-xl text-ink/70 leading-relaxed max-w-2xl mx-auto mb-8">
              &quot;إلا ما كانش مزيان لوليدك، ما كاينش فحنينة.&quot;<br/>
              حنا متأكدين من جودة منتجاتنا. داكشي علاش كنقدمو ليك الدفع عند الاستلام. شوفي المنتج، تأكدي منو، وعاد خلصي. راحتك وراحة بيبيك هي الأهم عندنا.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <span className="bg-white border border-ink/10 px-6 py-3 rounded-full text-ink font-bold shadow-sm">✅ دفع عند الاستلام</span>
              <span className="bg-white border border-ink/10 px-6 py-3 rounded-full text-ink font-bold shadow-sm">✅ توصيل 24-48 ساعة</span>
              <span className="bg-white border border-ink/10 px-6 py-3 rounded-full text-ink font-bold shadow-sm">✅ خدمة زبناء في الاستماع</span>
            </div>
          </div>
        </div>
      </section>

      {/* 10. REPEAT OFFER SELECTOR */}
      <section className="section-padding bg-cream">
        <div className="container-site max-w-lg">
          <SectionHeader
            title="اختاري العرض واشتري الآن"
            subtitle="الدفع عند الاستلام، التوصيل في 24-48 ساعة"
            className="mb-8"
          />
          <OfferSelector product={product} />
        </div>
      </section>

      {/* 11. CROSS-SELLS */}
      <CrossSellGrid products={crossSells} />

      {/* 12. FAQ */}
      <section className="section-padding bg-white">
        <div className="container-site max-w-3xl">
          <SectionHeader
            eyebrow="أسئلة شائعة"
            title={`أسئلة حول ${product.latinName}`}
            className="mb-8"
          />
          <ProductFaq faq={product.faq} />
        </div>
      </section>

      {/* Sticky mobile CTA */}
      <ProductHeroClient product={product} />
    </>
  );
}
