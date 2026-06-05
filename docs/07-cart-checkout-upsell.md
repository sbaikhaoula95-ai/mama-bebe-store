# Cart, Checkout, Upsell, And Thank-You Flow

## Goal

Maximize:

- conversion rate,
- AOV,
- confirmation rate,
- delivery rate.

This is COD. The checkout is not a payment checkout. It is a high-intent order lead capture.

## Cart Drawer

No cart page.

Open the drawer when:

- user clicks cart icon,
- user adds a selected offer from product page,
- user adds cross-sell,
- user returns from declined upsell if needed.

## Cart Drawer Layout

1. Header:
   - title: `سلتك`
   - close button
2. Trust row:
   - الدفع عند الاستلام
   - توصيل 24-48 ساعة
3. Items:
   - product image placeholder
   - Arabic name
   - quantity controls
   - line total
4. Free delivery progress:
   - threshold 299 MAD
   - copy: `زيدي منتج آخر واستافدي من التوصيل المجاني`
5. Cross-sells:
   - title: `كملي روتين حنينة`
   - show products not already in cart
   - price 199 MAD
6. Totals:
   - subtotal
   - delivery: free over threshold, otherwise configurable
   - total
7. CTA:
   - `تأكيد الطلب`
   - opens checkout popup

## Cart Pricing Logic

Non-upsell items are priced by total non-upsell quantity:

```txt
1 item = 199
2 items = 299
3 items = 399
4+ items = 399 + 199 each extra
```

Accepted upsell item is always a separate line at 99 MAD and does not reprice the ladder after acceptance.

Example:

- User chooses Mama 2-pack = 299
- User accepts Lila upsell = 99
- Final total = 398

## Checkout Popup

Open from cart CTA.

### Header

Title:

> أكدي طلبك فدقيقة

Subtitle:

> ما تخلصي والو دابا. كنعيطو ليك نأكدو الطلب والعنوان، وكتخلصي حتى توصلك السلعة.

### Order Summary

Show:

- product names
- quantities
- subtotal
- delivery line
- total

### Trust And Scarcity

Add small chips:

- الدفع عند الاستلام
- توصيل 24-48 ساعة
- الكمية محدودة
- ضمان حنينة

### Fields

1. Full name: `الاسم الكامل`
2. Phone: `رقم الهاتف`
3. Re-enter phone: `أعيدي رقم الهاتف`
4. City: `المدينة`
5. Address: `العنوان الكامل`

Phone helper:

> مثال: 0612345678

Validation:

- Moroccan mobile only: `^0[67]\d{8}$`
- phone and phoneConfirm must match
- name/city/address required

## Submit Sequence

When user clicks checkout CTA:

1. Validate locally.
2. If invalid, show inline errors.
3. If valid, do not immediately send final order yet.
4. Show upsell modal.
5. After accept/decline/timeout, submit final order to backend with final cart and event IDs.

Reason: the backend/Sheet must receive the final order including the accepted upsell if accepted.

## Upsell Modal

### Behavior

- Shows after valid checkout form.
- Shows exactly one product.
- Countdown: 10-15 seconds.
- Price: 99 MAD.
- User can accept or decline.
- Timeout = decline.

### Copy

Title:

> عرض خاص قبل ما نكملو طلبك

Subtitle:

> زيدي هاد المنتج لطلبك غير ب 99 درهم. العرض غادي يسالي فثواني.

Accept:

> نعم، زيديها لطلبي ب 99 درهم

Decline:

> لا شكرا، كملي الطلب

### Recommendation Matrix

| Cart contains | Upsell |
|---|---|
| Mama only | Lila |
| Lila only | Mama |
| Calm only | Lila |
| Mama + Lila | Calm |
| Mama + Calm | Lila |
| Lila + Calm | Mama |
| All 3 already | Extra Mama refill or skip |
| Fallback | Mama |

### Implementation

Create:

- `getRecommendedUpsell(items): ProductSlug | null`
- `applyUpsell(items, productId): CartItem`

Accepted upsell line:

```ts
{
  productId: 'hnina-lila',
  quantity: 1,
  unitPrice: 99,
  lineTotal: 99,
  isUpsell: true,
  source: 'upsell'
}
```

## Order Payload From Frontend

Send to backend:

```json
{
  "customer": {
    "fullName": "string",
    "phone": "0612345678",
    "phoneConfirm": "0612345678",
    "city": "Casablanca",
    "address": "full address"
  },
  "items": [
    {
      "productId": "hnina-mama",
      "sku": "HNINA-MAMA",
      "name": "حنينة ماما ...",
      "quantity": 2,
      "unitPrice": 149.5,
      "lineTotal": 299,
      "isUpsell": false
    }
  ],
  "upsell": {
    "shown": true,
    "accepted": true,
    "productId": "hnina-lila",
    "price": 99
  },
  "totals": {
    "subtotal": 398,
    "deliveryFee": 0,
    "total": 398,
    "currency": "MAD"
  },
  "attribution": {
    "sourcePage": "https://hnina.shop/products/hnina-mama",
    "landingPage": "https://hnina.shop",
    "referrer": "",
    "utmSource": "",
    "utmMedium": "",
    "utmCampaign": "",
    "utmContent": "",
    "utmTerm": ""
  },
  "tracking": {
    "eventId": "evt_xxx",
    "fbp": "",
    "fbc": "",
    "ttp": "",
    "scid": "",
    "ttclid": "",
    "fbclid": "",
    "scClickId": ""
  }
}
```

## Thank-You Page

After backend returns order:

```json
{
  "orderId": "HN-20260605-0001",
  "status": "received"
}
```

Redirect:

```txt
/merci?orderId=HN-20260605-0001
```

Thank-you page should:

- read order summary from response state or fetch backend by order ID,
- show accepted upsell if accepted,
- explain confirmation call,
- tell customer to keep phone nearby,
- show cross-sells at original 199 MAD.

## Confirmation/Delivery Copy

Use this exact block:

> طلبك توصلنا. غادي نعيطو ليك قريبا باش نأكدو الطلب ونأخذو العنوان النهائي. خلي تيليفونك قريب وجاوبي على المكالمة باش يوصلك الطلب بسرعة.

## Fake Order Prevention

Frontend:

- phone regex
- phone confirmation
- hidden honeypot field
- disable submit while pending

Backend:

- rate limit by IP + phone
- reject mismatched phone fields
- store user agent and IP
- flag repeated phone/address if needed later

