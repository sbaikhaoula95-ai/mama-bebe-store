# Google Sheets Webhook

## Purpose

Google Sheets is the lightweight operations dashboard for COD orders.

Backend remains source of truth, but every order is also sent to Google Sheets for:

- fast confirmation calls,
- manual address review,
- delivery tracking,
- carrier export,
- founder operations.

## Required Sheets

Create one Google Spreadsheet with three tabs:

1. `orders`
2. `order_items`
3. `events`

CSV templates are in:

- `templates/orders-sheet-template.csv`
- `templates/order-items-sheet-template.csv`
- `templates/events-sheet-template.csv`

## Apps Script

Create an Apps Script web app using:

- `scripts/google-sheets/Code.gs`

Deploy:

- Execute as: Me
- Who has access: Anyone with the link

Security:

- Use `SHEET_WEBHOOK_SECRET`.
- Backend sends `secret` in payload.
- Apps Script rejects if secret does not match `SCRIPT_SECRET`.

## Backend Request

Backend sends `POST` JSON to `SHEET_WEBHOOK_URL`:

```json
{
  "secret": "shared_secret",
  "order": {
    "orderId": "HN-20260605-0001",
    "createdAt": "2026-06-05T00:00:00Z",
    "status": "received",
    "customerName": "string",
    "phone": "0612345678",
    "city": "Casablanca",
    "address": "full address",
    "subtotal": 398,
    "deliveryFee": 0,
    "total": 398,
    "currency": "MAD",
    "upsellShown": true,
    "upsellAccepted": true,
    "upsellProductId": "hnina-lila",
    "sourcePage": "https://hnina.shop/products/hnina-mama",
    "utmSource": "facebook",
    "utmMedium": "paid",
    "utmCampaign": "mama_launch",
    "eventId": "order_event_id",
    "userAgent": "Mozilla..."
  },
  "items": [
    {
      "orderId": "HN-20260605-0001",
      "productId": "hnina-mama",
      "sku": "HNINA-MAMA",
      "nameAr": "حنينة ماما — زيت الهندية والأرغان لتشققات الحمل وشد البشرة",
      "quantity": 2,
      "unitPrice": 149.5,
      "lineTotal": 299,
      "isUpsell": false
    }
  ],
  "events": [
    {
      "orderId": "HN-20260605-0001",
      "type": "order_created",
      "message": "Order created from website"
    }
  ]
}
```

## Sheet Columns

### `orders`

See `templates/orders-sheet-template.csv`.

Must include:

- orderId
- createdAt
- status
- customerName
- phone
- city
- address
- subtotal
- deliveryFee
- total
- upsell info
- UTM/source
- confirmation call columns:
  - callStatus
  - confirmedAt
  - deliveryStatus
  - notes

### `order_items`

One row per item.

### `events`

Operational log rows.

## Backend Failure Handling

If Sheet webhook fails:

- still return order success to customer,
- mark `sheet_status=failed`,
- log response,
- later retry manually or via endpoint.

## Apps Script Setup Steps

1. Create Google Sheet.
2. Add tabs: `orders`, `order_items`, `events`.
3. Paste headers from CSV templates.
4. Open Extensions → Apps Script.
5. Paste `Code.gs`.
6. Set script property:
   - key: `SCRIPT_SECRET`
   - value: same as backend `SHEET_WEBHOOK_SECRET`
7. Deploy as web app.
8. Copy URL into backend `SHEET_WEBHOOK_URL`.
9. Send test order.

