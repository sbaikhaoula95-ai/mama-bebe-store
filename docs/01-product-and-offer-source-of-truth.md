# Product And Offer Source Of Truth

This file defines the exact product catalog, offers, pricing, cross-sells, upsell rules, and safe claims. The coder must implement product data from this document in a typed config file, not hardcode scattered values across components.

## Brand

- Arabic brand: **حنينة**
- Latin brand: **HNINA**
- Domain: `hnina.shop`
- Currency: `MAD`
- Market: Morocco
- Payment method: Cash on Delivery only

## Product 1: Hnina Mama

**Full Arabic name:**  
**حنينة ماما — زيت الهندية والأرغان لتشققات الحمل وشد البشرة**

**Slug:** `hnina-mama`

**Short card heading:**  
زيت طبيعي لماما خلال الحمل وبعد الولادة

**Card subheading:**  
بالهندية والأرغان، كيساعد البشرة تبقى مرنة وناعمة مع رتوال يومي بسيط.

**English descriptor:**  
Prickly Pear & Argan Firming Oil for pregnancy and postpartum skin.

**Primary audience:** Pregnant and postpartum Moroccan women.

**Problem:** Stretch marks and loss of skin elasticity during and after pregnancy.

**Safe claim:** Helps reduce the appearance of stretch marks and supports skin elasticity.

**Forbidden claims:** removes stretch marks, erases stretch marks, treats, cures, before/after results.

**Hero ingredients:**

- Prickly pear seed oil / زيت الهندية
- Argan oil / زيت الأرغان
- Sweet almond carrier / زيت اللوز الحلو

**Format:** 30-50ml amber PET dropper bottle.

**Position in funnel:** Lead product. Most ads should point here first.

## Product 2: Hnina Lila

**Full Arabic name:**  
**حنينة ليلى — زيت الخزامى والبابونج لتدليك ونوم البيبي**

**Slug:** `hnina-lila`

**Short card heading:**  
رتوال هادئ قبل نوم البيبي

**Card subheading:**  
زيت خفيف للتدليك بالخزامى والبابونج، باش تكون لحظة النوم دافئة وهادية.

**English descriptor:**  
Lavender, chamomile, and sweet almond baby bedtime massage oil.

**Primary audience:** Parents of babies from 3 months onward. If the formula is tested and approved for newborns, copy may say 0+ only after real supplier confirmation.

**Problem:** Fussy nights, difficulty settling into bedtime, parent exhaustion.

**Safe claim:** Supports a calming bedtime ritual for gentle baby massage.

**Forbidden claims:** makes baby sleep, cures insomnia, treats colic, cures crying, sleep aid, medical sleep disorder language.

**Hero ingredients:**

- Lavender / الخزامى
- Roman chamomile / البابونج
- Sweet almond oil / زيت اللوز الحلو

**Format:** 50-100ml PET or frosted bottle with pump.

**Position in funnel:** Strongest cross-sell and post-form upsell for Hnina Mama buyers.

## Product 3: Hnina Calm

**Full Arabic name:**  
**حنينة كالم — بلسم الكاليندولا والأرغان للبشرة الجافة والحساسة والمتهيجة**

**Slug:** `hnina-calm`

**Short card heading:**  
بلسم لطيف للبشرة الحساسة

**Card subheading:**  
بالكاليندولا والأرغان، كيرطب البشرة الجافة والحساسة ويخليها مرتاحة.

**English descriptor:**  
Calendula & Argan Soothing Balm for very dry, sensitive, irritated baby skin.

**Primary audience:** Moms of babies with dry, sensitive, reactive, or irritated skin.

**Problem:** Dryness, sensitivity, discomfort, visible irritation, mom guilt.

**Safe claim:** Soothes and deeply nourishes very dry, sensitive, irritated skin.

**Forbidden claims:** eczema, dermatitis, rash treatment, cures, heals, treats, atopic skin. Do not show red inflamed skin before/after images.

**Hero ingredients:**

- Calendula / الكاليندولا
- Argan oil / زيت الأرغان
- Beeswax / شمع النحل
- Sweet almond oil / زيت اللوز الحلو

**Format:** 50-60ml PP jar with tamper seal.

**Position in funnel:** Trust-heavy product. Launch after Mama/Lila have reviews and authority assets.

## Locked Offer Ladder

The offer ladder is per selected product page and also applies to mix-and-match totals in cart.

| Quantity | Price | Label |
|---|---:|---|
| 1 piece | 199 MAD | تجربة أولى |
| 2 pieces | 299 MAD | الأكثر اختيارا |
| 3 pieces | 399 MAD | أفضل قيمة |

Rules:

- If the user selects 2 pieces on a product page, add quantity 2 of that product at total 299.
- If the user selects 3 pieces, add quantity 3 at total 399.
- If cart contains mixed products, calculate by total quantity:
  - 1 item total = 199
  - 2 items total = 299
  - 3 items total = 399
  - 4+ items = 399 + 199 for each extra item unless manually changed later.
- Show savings with words like "أفضل قيمة", but avoid fake crossed-out discount noise everywhere.

## Cross-Sell Rule

Cross-sells in these areas show products at original **199 MAD**:

- product page bottom
- cart drawer
- checkout popup reminder
- thank-you page

No discount tag on cross-sells.

## Post-Form Upsell Rule

The only discounted product anywhere on the site:

- Price: **99 MAD**
- Timing: after checkout form validates and the user clicks confirm
- Duration: 10-15 seconds
- One product only
- Relevant product not already in cart when possible
- If accepted, it becomes a line item in final order and Google Sheet.
- If declined/timeout, the original order continues.

## Upsell Recommendation Matrix

| Cart contains | Show one upsell at 99 MAD |
|---|---|
| Mama only | Lila |
| Lila only | Mama |
| Calm only | Lila |
| Mama + Lila | Calm |
| Mama + Calm | Lila |
| Lila + Calm | Mama |
| All 3 already | Extra Mama refill, or skip |
| Fallback | Mama |

## Product Card Requirements

Each card must include:

- Product image placeholder
- Full Arabic name
- Short emotional heading
- 4.8-4.9 star rating
- "الدفع عند الاستلام"
- "توصيل 24-48 ساعة"
- Price line: "ابتداء من 199 درهم"
- Scarcity line: "الدفعة محدودة هذا الأسبوع"
- CTA: "اختاري العرض"

## Inventory Scarcity Copy

Use believable scarcity:

- "دفعة صغيرة من الزيوت الطبيعية"
- "الكمية محدودة حسب توفر المكونات"
- "توصيل مجاني فوق 299 درهم"

Avoid fake countdowns everywhere. Only the upsell modal has a real countdown.

