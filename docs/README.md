# Hnina Build Docs

This folder is the implementation source of truth for the AI coder building **Hnina** on:

- Frontend: `https://hnina.shop`
- Backend API: `https://api.hnina.shop`
- Database: PostgreSQL database named `hnina`
- Stack: Next.js + React + TypeScript + Tailwind on the frontend, Python FastAPI + PostgreSQL on the backend.

Do not treat this as a generic ecommerce build. Hnina is a **Morocco COD DTC branded store** built to sell topical mom and baby products at premium prices through trust, authority, emotional copy, proof, and a very short COD checkout.

## Read Order For The AI Coder

1. `00-ai-coder-master-prompt.md`
2. `01-product-and-offer-source-of-truth.md`
3. `02-brand-positioning-icp.md`
4. `03-site-map-and-cro.md`
5. `04-copywriting-and-darija.md`
6. `05-design-system.md`
7. `06-frontend-architecture.md`
8. `07-cart-checkout-upsell.md`
9. `08-backend-fastapi-architecture.md`
10. `09-database-schema-and-migrations.md`
11. `10-tracking-pixels-capi.md`
12. `11-google-sheets-webhook.md`
13. `12-deployment-docker-easypanel.md`
14. `13-env-examples.md`
15. `14-qa-launch-checklist.md`
16. `15-coding-rules.md`

## Required Output Structure

The coder must create:

```txt
frontend/
  Dockerfile
  docker-compose.example.yml
  .env.example
  ...
backend/
  Dockerfile
  docker-compose.example.yml
  .env.example
  ...
docs/
  ...
scripts/
  google-sheets/
    Code.gs
    README.md
templates/
  orders-sheet-template.csv
  order-items-sheet-template.csv
  events-sheet-template.csv
```

## Non-Negotiables

- Arabic-first, RTL, mobile-first.
- COD only. No online payment.
- Cart drawer only. No cart page.
- Checkout popup has 5 fields: name, phone, re-enter phone, city, address.
- Moroccan mobile validation only: `^0[67]\d{8}$`.
- After valid checkout submit, show one 10-15s upsell at **99 MAD**. This is the only discount on the site.
- Product offers: 1 piece = 199 MAD, 2 pieces = 299 MAD, 3 pieces = 399 MAD.
- Cross-sells in product pages, cart drawer, and thank-you page show original 199 MAD.
- Orders are stored in PostgreSQL and sent to Google Sheets via Apps Script webhook.
- Web pixels are deferred for speed.
- Server CAPI sends hashed user data and uses event IDs for deduplication.
- Do not commit real secrets. Use placeholders in `.env.example`.

