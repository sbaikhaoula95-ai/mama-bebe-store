export const SITE = {
  name: "حنينة",
  nameLatin: "HNINA",
  domain: "hnina.shop",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://hnina.shop",
  apiUrl: process.env.NEXT_PUBLIC_API_BASE_URL || "https://api.hnina.shop",
  tagline: "عناية طبيعية وموثوقة لماما والبيبي",
  description:
    "منتجات حنينة للعناية بماما والبيبي بمكونات طبيعية، الدفع عند الاستلام والتوصيل في المغرب.",
  seo: {
    homeTitle: "حنينة | عناية طبيعية لماما والبيبي في المغرب",
    homeDescription:
      "منتجات حنينة للعناية بماما والبيبي بمكونات طبيعية، الدفع عند الاستلام والتوصيل في المغرب.",
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
  brandPromise:
    "إلا ما كانش مزيان لوليدك، ما كاينش فحنينة.",
  footerCopy:
    "حنينة علامة مغربية للعناية الطبيعية بماما والبيبي. كنختارو مكونات لطيفة، واضحة، ومفهومة باش كل ماما تحس بالأمان قبل ما تطلب.",
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
