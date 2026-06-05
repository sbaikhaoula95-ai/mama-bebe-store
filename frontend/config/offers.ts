export const OFFER_TIERS = [
  {
    quantity: 1,
    total: 199,
    label: "تجربة أولى",
    badge: null,
    savings: null,
  },
  {
    quantity: 2,
    total: 299,
    label: "الأكثر اختيارا",
    badge: "وفري 99 درهم",
    savings: 99,
  },
  {
    quantity: 3,
    total: 399,
    label: "أفضل قيمة",
    badge: "وفري 198 درهم",
    savings: 198,
  },
] as const;

export const UPSELL_PRICE = 99;
export const FREE_DELIVERY_THRESHOLD = 299;
export const PRODUCT_UNIT_PRICE = 199;
export const CURRENCY = "MAD";

export type OfferTier = (typeof OFFER_TIERS)[number];
