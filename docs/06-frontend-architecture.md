# Frontend Architecture

## Stack

- Next.js App Router
- React
- TypeScript
- Tailwind CSS
- Zustand for cart state
- React Hook Form + Zod for checkout/contact validation
- Framer Motion for subtle modal/drawer/section animations
- `next/font/google` for Cairo or Tajawal

## Folder Structure

```txt
frontend/
  app/
    layout.tsx
    page.tsx
    products/
      page.tsx
    products/[slug]/
      page.tsx
    about/
      page.tsx
    contact/
      page.tsx
    merci/
      page.tsx
    policies/
      shipping/page.tsx
      returns/page.tsx
      privacy/page.tsx
      terms/page.tsx
      cod/page.tsx
  components/
    layout/
      AnnouncementBar.tsx
      Header.tsx
      Footer.tsx
    brand/
      Logo.tsx
      TrustBadges.tsx
      SectionHeader.tsx
      PlaceholderImage.tsx
    product/
      ProductCard.tsx
      ProductHero.tsx
      OfferSelector.tsx
      IngredientCards.tsx
      ProductFaq.tsx
      CrossSellGrid.tsx
    cart/
      CartDrawer.tsx
      CartLineItem.tsx
      CartTotals.tsx
      CheckoutPopup.tsx
      UpsellModal.tsx
    tracking/
      PixelLoader.tsx
  config/
    products.ts
    offers.ts
    site.ts
    tracking.ts
  lib/
    api.ts
    cart-pricing.ts
    event-id.ts
    phone.ts
    tracking-client.ts
    utm.ts
  store/
    cart-store.ts
  styles/
    globals.css
  Dockerfile
  docker-compose.example.yml
  .env.example
```

## Routing

Use product slugs:

- `/products/hnina-mama`
- `/products/hnina-lila`
- `/products/hnina-calm`

Collection:

- `/products`

Thank-you:

- `/merci?orderId=HN-...`

No `/cart` route.

## Product Config

Create `config/products.ts` with typed data:

```ts
export type ProductSlug = 'hnina-mama' | 'hnina-lila' | 'hnina-calm';

export type Product = {
  id: ProductSlug;
  slug: ProductSlug;
  sku: string;
  arabicName: string;
  latinName: string;
  shortHeading: string;
  subheading: string;
  description: string;
  heroImageKey: string;
  price: 199;
  ingredients: Array<{
    name: string;
    origin: string;
    benefit: string;
    safety: string;
  }>;
  safeClaims: string[];
  forbiddenClaims: string[];
};
```

The product names must exactly match:

- `حنينة ماما — زيت الهندية والأرغان لتشققات الحمل وشد البشرة`
- `حنينة ليلى — زيت الخزامى والبابونج لتدليك ونوم البيبي`
- `حنينة كالم — بلسم الكاليندولا والأرغان للبشرة الجافة والحساسة والمتهيجة`

## Offer Config

Create `config/offers.ts`:

```ts
export const OFFER_TIERS = [
  { quantity: 1, total: 199, label: 'تجربة أولى' },
  { quantity: 2, total: 299, label: 'الأكثر اختيارا' },
  { quantity: 3, total: 399, label: 'أفضل قيمة' },
] as const;

export const UPSELL_PRICE = 99;
export const FREE_DELIVERY_THRESHOLD = 299;
```

## Cart State

Use Zustand with localStorage persistence.

Cart item shape:

```ts
type CartItem = {
  lineId: string;
  productId: ProductSlug;
  quantity: number;
  source: 'product_page' | 'cart_cross_sell' | 'thank_you_cross_sell' | 'upsell';
  unitPrice?: number;
  lineTotal?: number;
  isUpsell?: boolean;
};
```

Pricing should be derived with `calculateCartTotals(cartItems)` instead of stored permanently, except accepted upsell line fixed at 99 MAD.

## API Client

Frontend talks to backend:

- `POST /api/orders`
- `GET /api/orders/{order_id}` for thank-you summary if needed
- `POST /api/contact`

Use `NEXT_PUBLIC_API_BASE_URL=https://api.hnina.shop`.

## Forms

Checkout schema:

```ts
const moroccanPhoneRegex = /^0[67]\d{8}$/;
```

Fields:

- fullName
- phone
- phoneConfirm
- city
- address

Validation:

- fullName min 3 chars
- phone matches regex
- phoneConfirm equals phone
- city min 2 chars
- address min 8 chars

## Data Captured Client-Side

Include with order request:

- cart items
- accepted upsell
- final totals
- source page
- UTM params
- landing page URL
- referrer
- user agent
- event IDs used for pixel dedup
- cookies: `_fbp`, `_fbc`, `_ttp`, `_scid`, click IDs if present

## Performance

- Use server components for static pages where possible.
- Cart and checkout are client components.
- Defer pixels until after hydration/idle time.
- Lazy-load below-fold image placeholders.
- Use `next/image` for real images later.
- Keep JS small; do not add heavy UI libraries.

## SEO

Arabic metadata:

- Home title: `حنينة | عناية طبيعية لماما والبيبي في المغرب`
- Description: `منتجات حنينة للعناية بماما والبيبي بمكونات طبيعية، الدفع عند الاستلام والتوصيل في المغرب.`

Each product page must include:

- Arabic title
- Arabic description
- OG image placeholder
- canonical URL

## Error States

Checkout errors:

- backend unavailable: "وقع مشكل مؤقت، عاودي حاولي بعد لحظات."
- invalid phone: "دخلي رقم هاتف مغربي صحيح كيبدأ ب 06 أو 07."
- duplicate phone mismatch: "الرقمين ما متطابقينش."

## Security

- Do not expose backend secrets in frontend.
- Only expose public pixel IDs and API base URL.
- Do not hash phone in browser for CAPI. Backend handles server hashing.
- Browser pixels may use their standard client API, but do not store sensitive data in localStorage.

