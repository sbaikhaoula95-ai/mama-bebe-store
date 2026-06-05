# Coding Rules For The AI Coder

## General

- Build for production, not a throwaway demo.
- Keep code simple and explicit.
- Do not over-abstract the first version.
- Use TypeScript strictly in frontend.
- Use Pydantic validation in backend.
- Do not hardcode secrets.
- Do not trust frontend totals.
- Arabic copy must remain readable and not be replaced with lorem ipsum.

## Frontend Rules

- Use Next.js App Router.
- Use server components by default.
- Use client components only for cart, checkout, modals, tracking, and interactive forms.
- Put all product data in `config/products.ts`.
- Put all offer math in `lib/cart-pricing.ts`.
- Do not duplicate prices across components.
- Use Tailwind utility classes and reusable components.
- Add `dir="rtl"` globally.
- Use semantic HTML.
- Keep accessibility in modals/drawers.
- Use `next/image` for real images when available.
- Use placeholder image components until assets arrive.

## Backend Rules

- Use FastAPI routers.
- Use async SQLAlchemy.
- Use Alembic for schema changes.
- Run migrations on app start.
- Store order before external integrations.
- External integrations must not block order success.
- Log integration failures.
- Use typed service modules:
  - pricing
  - sheets
  - tracking
  - order numbers
- Hash user identifiers only in tracking services.
- Do not send address to ad platforms.

## Validation Rules

Frontend and backend must both validate:

- name required
- phone valid Moroccan mobile
- phone confirmation matches
- city required
- address required
- items not empty

Backend is final authority.

## Pricing Rules

Use one source:

- 1 item = 199
- 2 items = 299
- 3 items = 399
- 4+ = 399 + 199 each extra
- upsell = 99

Accepted upsell does not reprice the main ladder.

## Tracking Rules

- Defer browser pixels.
- Generate event IDs client-side for dedup.
- Pass event IDs to backend.
- Use same event ID for browser and server conversion event.
- Server hashes phone for CAPI.
- Meta/Snap phone normalization: `212` + local without leading zero.
- TikTok phone normalization: `+212` + local without leading zero.

## Copy Rules

- Do not use medical cure claims.
- Do not mention eczema on Hnina Calm page or ads.
- Do not promise baby will sleep.
- Do not promise stretch marks disappear.
- Use "supports", "helps reduce appearance", "soothes", "ritual".
- Keep tone warm and local.

## Git/Delivery Rules

Before handing off:

- run frontend lint/typecheck/build,
- run backend tests if added,
- run backend app locally,
- verify Docker builds,
- submit one test order through frontend,
- verify DB and Sheet.

