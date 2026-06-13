export const SITE = {
  name: "حنينة",
  nameLatin: "HNINA",
  domain: "hnina.shop",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://hnina.shop",
  apiUrl: process.env.NEXT_PUBLIC_API_BASE_URL || "https://api.hnina.shop",
  // Identity (see BRAND.md):
  // Hnina = the modern Moroccan natural apothecary for mom & baby.
  // Authority of a pharmacy, tenderness of a mother, heritage of beldi ingredients.
  tagline: "صيدلية طبيعية لماما والبيبي — مكونات مغربية، آمنة، موصى بها من طرف أطباء الأطفال والقابلات.",
  taglineFr:
    "Apothicaire naturel pour Maman & Bébé — Made in Morocco, validé par sages-femmes & pédiatres.",
  description:
    "حنينة هي الصيدلية الطبيعية المغربية لماما والبيبي. مكونات مغربية أصيلة، تركيبات مختبرة جلديا، الدفع عند الاستلام والتوصيل في 24-48 ساعة.",
  seo: {
    homeTitle: "حنينة | الصيدلية الطبيعية لماما والبيبي في المغرب",
    homeDescription:
      "حنينة — الصيدلية الطبيعية المغربية لماما والبيبي. مكونات مغربية أصيلة، موصى بها من طرف أطباء الأطفال والقابلات. الدفع عند الاستلام، توصيل 24-48 ساعة.",
  },
  contact: {
    email: "contact@hnina.shop",
    phone: "+212 600 000 000",
    hours: "الإثنين — الجمعة، 9 صباحا — 6 مساء",
    address: "المغرب",
  },
  social: {
    instagram: "https://instagram.com/hnina.shop",
    facebook: "https://facebook.com/hnina.shop",
    tiktok: "https://tiktok.com/@hnina.shop",
  },
  brandPromise: "إلا ما كانش مزيان لوليدك، ما كاينش فحنينة.",
  brandPositioning: "صيدلية حنينة الطبيعية · ماما والبيبي · صنع في المغرب",
  footerCopy:
    "حنينة هي الصيدلية الطبيعية المغربية لماما والبيبي. منتجاتنا مصنوعة بمكونات مغربية أصيلة، مختبرة جلديا، وموصى بها من طرف أطباء الأطفال والقابلات — باش كل ماما تحس بالأمان قبل وبعد ما تطلب.",
  authorityChips: [
    "👩‍⚕️ موصى به من أطباء الأطفال",
    "🤱 موافق عليه من القابلات",
    "🧪 مختبر جلديا",
    "🇲🇦 صنع في المغرب",
  ],
  nav: [
    { label: "الرئيسية", href: "/" },
    { label: "المنتجات", href: "/products" },
    { label: "من نحن", href: "/about" },
    { label: "تواصلي معنا", href: "/contact" },
  ],
  policyLinks: [
    { label: "الشحن والتوصيل", href: "/policies/shipping" },
    { label: "الإرجاع والاسترجاع", href: "/policies/returns" },
    { label: "سياسة الخصوصية", href: "/policies/privacy" },
    { label: "الشروط والأحكام", href: "/policies/terms" },
    { label: "الدفع عند الاستلام", href: "/policies/cod" },
  ],
};
