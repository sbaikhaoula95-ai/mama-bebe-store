# Design System

## Visual Direction

Hnina must look like:

- premium natural care,
- Moroccan but modern,
- safe for mom and baby,
- trustworthy enough to charge premium prices,
- not a generic dropshipping template.

## Palette

Use this palette as Tailwind tokens.

| Token | Hex | Usage |
|---|---|---|
| `cream` | `#FBF7F1` | main background |
| `sage` | `#7C9A82` | soft natural sections |
| `forest` | `#4F6F52` | primary CTA, logo circle |
| `ink` | `#22332A` | main text |
| `blush` | `#D8A39B` | maternal accent |
| `gold` | `#C7A35B` | premium badge/accent |
| `white` | `#FFFFFF` | cards |
| `danger` | `#B42318` | form errors |

## Typography

Arabic:

- Primary: `Cairo` or `Tajawal`
- Use `font-display: swap`

Latin:

- Use same font for consistency, or `Inter` for small technical UI.

Hierarchy:

- Hero h1: 36-52px desktop, 30-36px mobile
- Section h2: 28-40px desktop, 24-30px mobile
- Body: 16-18px
- Small badges: 12-14px

## Logo Lockup

Header lockup:

- Circle mark:
  - background: `forest`
  - text: `H`
  - text color: `cream`
  - shape: perfect circle
- Text block:
  - top: **حنينة**
  - bottom: **HNINA**
  - top larger than bottom

RTL desktop:

```txt
[H circle]  حنينة
            HNINA
```

Use this same lockup in footer and loading screen.

## Layout Rules

- `dir="rtl"` on the document root.
- Max content width: 1180-1240px.
- Section padding:
  - desktop: 80-112px vertical
  - mobile: 48-64px vertical
- Use alternating text/image sections:
  - Section A: text right, image left
  - Section B: image right, text left
- On mobile, text always appears before image unless the image is critical proof.

## Components

### Buttons

Primary:

- background: forest
- text: cream/white
- border radius: 999px or 16px
- label examples:
  - أضيفي للسلة
  - تأكيد الطلب
  - تسوقي الآن

Secondary:

- border: forest
- text: forest
- background: transparent/cream

### Cards

Product card:

- white/cream background
- soft border `rgba(34,51,42,0.12)`
- radius 24px
- subtle shadow
- image ratio 4:5
- product name Arabic
- star rating
- trust chips
- price
- CTA

Review card:

- avatar placeholder
- Moroccan first name + city
- stars
- short Darija review

Trust chip:

- pill shape
- icon + short text
- examples: "الدفع عند الاستلام", "24-48 ساعة", "مختبر جلديا"

### Forms

- Large touch-friendly inputs.
- Arabic labels above fields.
- Error text below fields in red.
- Phone input helper: `مثال: 0612345678`.
- Use visible focus rings.

### Cart Drawer

- Opens from left on RTL? Prefer visually from the left because cart icon is left in header, but either side is fine if consistent.
- Full height.
- Mobile: bottom sheet/full screen.
- Include sticky checkout CTA at bottom.

### Checkout Popup

- Center modal desktop.
- Bottom sheet mobile.
- Show order summary before fields.
- Show trust badges above CTA.
- Keep fields simple and large.

### Upsell Modal

- Strong visual hierarchy.
- Countdown ring or bar.
- Product image placeholder.
- 99 MAD price.
- Accept CTA stronger than decline, but decline must be visible.

## Image Placeholders

Until real images are available, create elegant placeholders using:

- gradient background cream/sage,
- ingredient illustrations,
- product bottle/jar silhouette,
- text label like `صورة المنتج هنا`.

Required image slots:

- `home-hero-moroccan-mom-baby-natural-care`
- `ingredient-prickly-pear`
- `ingredient-argan`
- `ingredient-lavender`
- `ingredient-chamomile`
- `ingredient-calendula`
- `product-hnina-mama-hero`
- `product-hnina-mama-usage-1`
- `product-hnina-mama-ingredient-1`
- `product-hnina-lila-hero`
- `product-hnina-lila-bedtime-ritual`
- `product-hnina-calm-hero`
- `product-hnina-calm-balm-texture`
- `authority-pediatrician-placeholder`
- `ugc-mom-placeholder-1`

## Motion

Use subtle Framer Motion only:

- fade + translate up on section reveal
- cart drawer slide
- modal fade/scale
- countdown progress

No heavy animations that slow mobile.

## Accessibility

- Buttons are real buttons.
- Modals trap focus.
- ESC closes cart/modal unless the user is submitting.
- Color contrast must be readable.
- All images have Arabic alt text.

