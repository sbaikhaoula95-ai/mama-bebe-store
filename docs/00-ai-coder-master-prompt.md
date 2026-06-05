# AI Coder Master Prompt

You are building **Hnina** (`hnina.shop`), an Arabic-first Morocco COD DTC ecommerce brand for premium mom and baby topical care.

Your job is to create production-ready code in two folders:

- `frontend/`: Next.js + React + TypeScript + Tailwind CSS
- `backend/`: Python FastAPI + PostgreSQL

You must read every file in `docs/` before coding. The docs are the source of truth.

## Business Context

Hnina sells dropshipping/private-label products at a premium price by making the store look like the brand owns the products. The site must feel like a trusted Moroccan authority brand, not a cheap dropshipping store.

The ICP is Moroccan women and mothers. They trust:

- Darija and Arabic copy that sounds local.
- Natural Moroccan ingredients.
- Pediatrician/midwife/dermatologist authority.
- Halal, lab-tested, dermatologically tested, made-in-Morocco badges.
- Real mom UGC, reviews, ratings, and COD reassurance.
- Fast delivery and clear confirmation-call expectations.

## Locked Brand

- Brand: **حنينة**
- Latin: **HNINA**
- Domain: `hnina.shop`
- API domain: `api.hnina.shop`
- Database name: `hnina`

## Locked Products

1. **حنينة ماما — زيت الهندية والأرغان لتشققات الحمل وشد البشرة**
2. **حنينة ليلى — زيت الخزامى والبابونج لتدليك ونوم البيبي**
3. **حنينة كالم — بلسم الكاليندولا والأرغان للبشرة الجافة والحساسة والمتهيجة**

## Locked Offer

For each product:

- 1 piece: **199 MAD**
- 2 pieces: **299 MAD**
- 3 pieces: **399 MAD**

Cross-sells always show original 199 MAD.

The only discount is the post-checkout-form upsell:

- One relevant product
- 10-15 second countdown
- Price: **99 MAD**
- If accepted, add it to the order and send it to backend + Google Sheet.
- If declined or timeout, continue with the original order.

## Required Pages

- Home
- Collection
- Product landing page for each product
- About us
- Contact us
- Policies: shipping, returns, privacy, terms, COD/payment
- Thank-you page

No cart page. Use cart drawer only.

## Checkout Flow

1. Product CTA adds selected offer to cart and opens cart drawer.
2. Cart drawer shows order summary, cross-sells, AOV nudges, and checkout CTA.
3. Checkout CTA opens popup with:
   - order summary
   - social proof
   - scarcity/reassurance
   - fields: full name, phone, re-enter phone, city, address
4. Validate:
   - phone and re-enter phone match
   - Moroccan mobile regex: `^0[67]\d{8}$`
   - city/address/name not empty
5. On valid CTA:
   - show 10-15s one-click upsell at 99 MAD
   - accept/decline/timeout finalizes order
6. Backend stores order in PostgreSQL, sends Google Sheets webhook, fires server CAPI events.
7. Frontend redirects to thank-you page with final order summary and confirmation-call instructions.

## Technical Requirements

Frontend:

- Next.js App Router
- React + TypeScript
- Tailwind CSS
- RTL Arabic-first
- Zustand for cart
- Zod + React Hook Form for forms
- Deferred web pixels for Meta, TikTok, Snapchat
- Event deduplication IDs shared with backend
- Fast mobile performance
- Use placeholder image components/blocks where real images are missing.

Backend:

- Python 3.12+
- FastAPI
- SQLAlchemy 2.x async
- Alembic migrations, run on backend start
- PostgreSQL
- Pydantic settings
- HTTPX for outbound webhooks/CAPI
- Store raw order data safely; hash user data only for ad platforms.
- No real secrets in repo.

Deployment:

- Dockerfile for each app.
- `.env.example` for frontend and backend.
- EasyPanel-ready.
- Backend CORS must allow `https://hnina.shop`.

## Implementation Priorities

1. Build stable product data model and offer calculation.
2. Build mobile-first RTL storefront.
3. Build cart drawer + offer tiers + cross-sells.
4. Build checkout popup + phone validation.
5. Build upsell modal and order finalization.
6. Build FastAPI order API + DB + Sheet webhook.
7. Build tracking: web pixels + CAPI with dedup.
8. Build thank-you page that improves confirmation/delivery.
9. Add policy/about/contact pages.
10. Add Docker/env/deployment assets.

## Quality Bar

The output must feel like a premium DTC brand and an implementation-ready ecommerce app, not a prototype.

If uncertain, choose the option that improves:

1. trust,
2. conversion rate,
3. confirmation rate,
4. delivery rate,
5. AOV,
6. speed.

