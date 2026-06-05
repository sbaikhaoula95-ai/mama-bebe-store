# Database Schema And Migrations

Database name: `hnina`

Use PostgreSQL with Alembic migrations.

Do not put the real password in committed files. Use `DATABASE_URL` from environment.

## Tables

### `orders`

Stores one COD order.

| Column | Type | Notes |
|---|---|---|
| `id` | UUID PK | internal |
| `order_number` | text unique | `HN-YYYYMMDD-0001` |
| `status` | text | `received`, `called`, `confirmed`, `shipped`, `delivered`, `cancelled`, `returned` |
| `customer_name` | text | raw for fulfillment |
| `phone` | text | raw local phone `06...` |
| `phone_normalized` | text | `2126...` |
| `city` | text | raw |
| `address` | text | raw |
| `subtotal` | numeric(10,2) | MAD |
| `delivery_fee` | numeric(10,2) | MAD |
| `total` | numeric(10,2) | MAD |
| `currency` | text | `MAD` |
| `upsell_shown` | boolean | |
| `upsell_accepted` | boolean | |
| `upsell_product_id` | text nullable | |
| `source_page` | text nullable | |
| `landing_page` | text nullable | |
| `referrer` | text nullable | |
| `utm_source` | text nullable | |
| `utm_medium` | text nullable | |
| `utm_campaign` | text nullable | |
| `utm_content` | text nullable | |
| `utm_term` | text nullable | |
| `event_id` | text | dedup |
| `fbp` | text nullable | |
| `fbc` | text nullable | |
| `ttp` | text nullable | |
| `scid` | text nullable | |
| `fbclid` | text nullable | |
| `ttclid` | text nullable | |
| `sc_click_id` | text nullable | |
| `client_ip` | text nullable | |
| `user_agent` | text nullable | |
| `sheet_sent_at` | timestamptz nullable | |
| `sheet_status` | text nullable | |
| `created_at` | timestamptz | default now |
| `updated_at` | timestamptz | default now |

Indexes:

- unique `order_number`
- index `phone`
- index `status`
- index `created_at`
- index `event_id`

### `order_items`

| Column | Type | Notes |
|---|---|---|
| `id` | UUID PK | |
| `order_id` | UUID FK orders(id) | cascade |
| `product_id` | text | `hnina-mama`, `hnina-lila`, `hnina-calm` |
| `sku` | text | |
| `name_ar` | text | full Arabic name |
| `quantity` | integer | |
| `unit_price` | numeric(10,2) | effective |
| `line_total` | numeric(10,2) | |
| `is_upsell` | boolean | |
| `source` | text | product/cart/upsell |
| `created_at` | timestamptz | |

### `tracking_events`

Stores server-side CAPI attempts.

| Column | Type | Notes |
|---|---|---|
| `id` | UUID PK | |
| `order_id` | UUID FK nullable | |
| `platform` | text | `meta`, `tiktok`, `snapchat` |
| `event_name` | text | |
| `event_id` | text | dedup |
| `payload_summary` | jsonb | no raw PII |
| `status` | text | `success`, `failed`, `skipped` |
| `response_code` | integer nullable | |
| `response_body` | text nullable | truncate if long |
| `created_at` | timestamptz | |

### `contact_messages`

| Column | Type | Notes |
|---|---|---|
| `id` | UUID PK | |
| `name` | text | |
| `phone` | text | |
| `message` | text | |
| `source_page` | text nullable | |
| `created_at` | timestamptz | |

## Product Constants

Keep product constants in backend code too. Backend must not trust frontend names/prices.

```py
PRODUCTS = {
    "hnina-mama": {
        "sku": "HNINA-MAMA",
        "name_ar": "حنينة ماما — زيت الهندية والأرغان لتشققات الحمل وشد البشرة",
    },
    "hnina-lila": {
        "sku": "HNINA-LILA",
        "name_ar": "حنينة ليلى — زيت الخزامى والبابونج لتدليك ونوم البيبي",
    },
    "hnina-calm": {
        "sku": "HNINA-CALM",
        "name_ar": "حنينة كالم — بلسم الكاليندولا والأرغان للبشرة الجافة والحساسة والمتهيجة",
    },
}
```

## Migration Requirements

Alembic must run on backend start.

First migration:

- create all tables
- add indexes
- add status enum as text with check constraint or plain text for speed

## Order Status Lifecycle

Initial:

- `received`

Manual future statuses:

- `called`
- `confirmed`
- `shipped`
- `delivered`
- `cancelled`
- `returned`

The MVP does not need admin panel, but DB should support status updates later.

## Sheet Sync Status

`sheet_status`:

- `pending`
- `sent`
- `failed`

If webhook fails:

- keep order in DB
- set `sheet_status=failed`
- log response

Later, add a retry endpoint or background job.

