# QA And Launch Checklist

## Brand QA

- Logo shows `حنينة` and `HNINA`.
- Header mark is `H` inside a forest green circle.
- Domain references use `hnina.shop`.
- Brand feels premium, not dropshipping.
- All pages are RTL Arabic-first.
- No fake reviews, fake doctors, or fake certificate numbers in production.

## Product QA

- Product names match exactly:
  - `حنينة ماما — زيت الهندية والأرغان لتشققات الحمل وشد البشرة`
  - `حنينة ليلى — زيت الخزامى والبابونج لتدليك ونوم البيبي`
  - `حنينة كالم — بلسم الكاليندولا والأرغان للبشرة الجافة والحساسة والمتهيجة`
- Hnina Calm does not use the words:
  - eczema
  - إكزيما
  - dermatitis
  - rash treatment
  - cure/heal/treat
- Hnina Lila does not claim to make baby sleep or cure colic.
- Hnina Mama does not claim to erase/remove stretch marks.

## Offer QA

- 1 piece = 199 MAD.
- 2 pieces = 299 MAD.
- 3 pieces = 399 MAD.
- Cross-sells show original 199 MAD.
- Only post-form upsell uses 99 MAD.
- Accepted upsell is included in final total.
- Declined/timeout upsell does not change final total.

## Cart QA

- No `/cart` page exists.
- Cart icon opens drawer.
- Add-to-cart opens drawer.
- Drawer shows items, totals, cross-sells, free delivery progress.
- Quantity updates recalculate totals.
- Drawer works on mobile and desktop.

## Checkout QA

- Popup opens from cart CTA.
- Fields:
  - full name
  - phone
  - re-enter phone
  - city
  - address
- Phone accepts `0612345678`.
- Phone accepts `0712345678`.
- Phone rejects:
  - `0512345678`
  - `+212612345678`
  - `612345678`
  - too short/long numbers
- Phone confirmation must match.
- Invalid fields show Darija errors.
- Submit disabled while pending.

## Upsell QA

- Appears only after valid form submit.
- Shows one product only.
- Timer lasts 10-15 seconds.
- Accept adds 99 MAD line item.
- Decline finalizes without upsell.
- Timeout finalizes without upsell.
- Matrix works:
  - Mama only -> Lila
  - Lila only -> Mama
  - Calm only -> Lila
  - Mama + Lila -> Calm
  - Mama + Calm -> Lila
  - Lila + Calm -> Mama

## Backend QA

- `GET /health` returns ok.
- `POST /api/orders` validates inputs.
- Backend recalculates totals.
- Backend stores order and items.
- Backend returns order ID.
- Migrations run on start.
- Order creation does not fail when Sheet/CAPI integrations fail.
- CORS allows `https://hnina.shop`.

## Google Sheets QA

- Sheets tabs exist:
  - orders
  - order_items
  - events
- Headers match templates.
- Apps Script secret is configured.
- Test order appears in orders tab.
- Items appear in order_items tab.
- Event appears in events tab.

## Tracking QA

- Browser pixels are deferred.
- PageView fires after script load.
- ViewContent fires on product pages.
- AddToCart fires on add.
- InitiateCheckout fires when popup opens.
- Purchase fires after final order submission.
- Same event ID is sent browser + backend for Purchase.
- Meta CAPI hashes phone as `212...`.
- TikTok CAPI hashes phone as `+212...`.
- Snap CAPI hashes phone as `212...`.
- Missing ad tokens do not break order creation.

## Responsive QA

Test:

- 360px mobile
- 390px iPhone
- 768px tablet
- 1024px laptop
- 1440px desktop

Check:

- no horizontal scroll,
- sticky CTA works,
- modals fit,
- cart drawer usable,
- text readable,
- images do not distort.

## Performance QA

- Lighthouse mobile performance target: 85+.
- No blocking pixels in initial load.
- Images lazy-loaded below fold.
- No heavy animation libraries except Framer Motion if needed.
- Product page loads fast on 4G.

## Final Test Order

Submit:

- product: Mama 2-pack
- upsell: accept Lila
- expected total: 398 MAD
- phone: valid Moroccan number

Confirm:

- frontend thank-you shows Mama + Lila upsell
- backend DB has order
- Google Sheet has order
- CAPI attempts logged

