# Backend FastAPI Architecture

## Stack

- Python 3.12+
- FastAPI
- Uvicorn/Gunicorn
- SQLAlchemy 2.x async
- Alembic
- asyncpg
- Pydantic Settings
- HTTPX
- PostgreSQL

## Folder Structure

```txt
backend/
  app/
    main.py
    core/
      config.py
      security.py
      logging.py
      cors.py
    db/
      session.py
      base.py
      migrate.py
    models/
      order.py
      tracking_event.py
      contact_message.py
    schemas/
      order.py
      contact.py
      tracking.py
    api/
      routes/
        health.py
        orders.py
        contact.py
    services/
      pricing.py
      sheet_webhook.py
      order_numbers.py
      tracking/
        hashing.py
        meta.py
        tiktok.py
        snapchat.py
    migrations/
      env.py
      versions/
  Dockerfile
  docker-compose.example.yml
  .env.example
  requirements.txt
```

## API Routes

### `GET /health`

Return:

```json
{"status":"ok","service":"hnina-api"}
```

### `POST /api/orders`

Creates an order.

Responsibilities:

1. Validate Moroccan phone.
2. Validate phone confirmation.
3. Recalculate totals server-side.
4. Store order in PostgreSQL.
5. Send order to Google Sheets webhook.
6. Fire CAPI events where tokens are configured.
7. Return order ID and summary.

Never trust frontend totals. Recalculate.

### `GET /api/orders/{order_id}`

Used by thank-you page if needed.

Return safe order summary only:

- orderId
- items
- totals
- customer first name
- city
- status

Do not expose full address in public response unless a signed token is implemented. For first version, frontend can keep summary in sessionStorage after create order.

### `POST /api/contact`

Stores contact message and optionally sends to Sheet/email.

## Order Request Schema

```py
class CustomerIn(BaseModel):
    full_name: str
    phone: str
    phone_confirm: str
    city: str
    address: str

class OrderItemIn(BaseModel):
    product_id: Literal["hnina-mama", "hnina-lila", "hnina-calm"]
    quantity: int
    is_upsell: bool = False
    unit_price: Decimal | None = None

class UpsellIn(BaseModel):
    shown: bool
    accepted: bool
    product_id: str | None = None
    price: Decimal | None = None

class AttributionIn(BaseModel):
    source_page: str | None = None
    landing_page: str | None = None
    referrer: str | None = None
    utm_source: str | None = None
    utm_medium: str | None = None
    utm_campaign: str | None = None
    utm_content: str | None = None
    utm_term: str | None = None

class TrackingIn(BaseModel):
    event_id: str
    fbp: str | None = None
    fbc: str | None = None
    ttp: str | None = None
    scid: str | None = None
    fbclid: str | None = None
    ttclid: str | None = None
    sc_click_id: str | None = None

class CreateOrderIn(BaseModel):
    customer: CustomerIn
    items: list[OrderItemIn]
    upsell: UpsellIn
    attribution: AttributionIn
    tracking: TrackingIn
```

## Server-Side Pricing

Product base price:

```py
PRODUCT_PRICE = Decimal("199")
UPSELL_PRICE = Decimal("99")
```

Non-upsell item total:

```py
def ladder_total(qty: int) -> Decimal:
    if qty <= 0:
        return Decimal("0")
    if qty == 1:
        return Decimal("199")
    if qty == 2:
        return Decimal("299")
    if qty == 3:
        return Decimal("399")
    return Decimal("399") + Decimal("199") * Decimal(qty - 3)
```

Upsell line:

- accepted upsell quantity 1 = 99 MAD
- do not reprice ladder with upsell

## Validation

Phone:

```py
MOROCCO_PHONE_RE = re.compile(r"^0[67]\d{8}$")
```

Reject:

- invalid phone
- phone mismatch
- empty city/address/name
- no items
- quantity outside expected range
- unknown product ID
- upsell price other than 99

## Order Number Format

Use:

```txt
HN-YYYYMMDD-0001
```

Implement with database sequence or daily count.

## CORS

Allow:

- `https://hnina.shop`
- `https://www.hnina.shop` if used
- local dev URL

Do not allow `*` in production.

## Rate Limiting

Add basic limiter:

- per IP: max 10 order attempts per hour
- per phone: max 3 orders per day unless admin changes later

Can be implemented in app memory for MVP, but Redis is better later. If no Redis, at least add backend validation and DB duplicate flags.

## Outbound Failures

Order creation must not fail if:

- Google Sheet webhook is down
- Meta CAPI is down
- TikTok CAPI is down
- Snap CAPI is down

Behavior:

1. Store order.
2. Try integrations.
3. Store integration result in `tracking_events` or log table.
4. Return success to frontend.

## Security And Secrets

Do not commit:

- database URL with real password
- pixel access tokens
- Google Sheet webhook secret

The user provided an internal DB URL shape. In docs/env examples, use placeholders only.

## Backend Startup

On container start:

1. Run Alembic migrations.
2. Start API server.

Use entrypoint:

```sh
alembic upgrade head && uvicorn app.main:app --host 0.0.0.0 --port 8000
```

