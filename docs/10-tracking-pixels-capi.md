# Tracking, Web Pixels, CAPI, Hashing, And Deduplication

## Goal

Track the ecommerce funnel for Meta, TikTok, and Snapchat while keeping the website fast and using CAPI for better attribution.

Platforms:

- Meta Pixel + Meta Conversions API
- TikTok Pixel + TikTok Events API
- Snapchat Pixel + Snapchat Conversions API

## Events To Track

| User action | Browser event | Server event | Dedup required |
|---|---|---|---|
| Page view | PageView | optional | no |
| Product view | ViewContent | optional | yes if server sent |
| Add to cart | AddToCart | optional | yes if server sent |
| Checkout popup opened | InitiateCheckout | optional | yes if server sent |
| Valid form submitted / order created | Purchase or Lead | Purchase or Lead | yes |

Recommendation for COD:

- Use `Purchase` for final confirmed website order submission because value, currency, and items exist.
- Also store internal status as `received`, not paid.
- Do not fire `Purchase` again when the phone call confirms unless building a separate offline-event flow later.

## Deferred Browser Pixels

Pixels must not block first paint.

Frontend should:

1. Load page normally.
2. After hydration, use `requestIdleCallback` if available, else `setTimeout`.
3. Load pixel scripts.
4. Fire PageView after script ready.

Never place blocking pixel scripts in the initial HTML head unless Next.js strategy is `afterInteractive` or delayed.

## Event ID Deduplication

For browser and server event deduplication:

- Generate one `eventId` on the frontend for each conversion action.
- Use the same ID for:
  - browser pixel event (`eventID`, `event_id`, or platform equivalent)
  - backend order payload
  - server CAPI payload

Example:

```ts
const eventId = `order_${Date.now()}_${crypto.randomUUID()}`;
```

For Meta:

- Browser: `fbq('track', 'Purchase', payload, { eventID: eventId })`
- Server CAPI: top-level `event_id: eventId`

For Snapchat:

- Use `client_dedup_id` for server payload.

For TikTok:

- Use `event_id` where supported by Events API payload.

## Moroccan Phone Normalization

Frontend validation accepts only:

```txt
^0[67]\d{8}$
```

Example:

```txt
0612345678
```

Backend should normalize into platform formats:

### Raw local

```txt
0612345678
```

### Meta CAPI format before hashing

Meta phone should be digits only, include country code, remove leading local zero:

```txt
212612345678
```

Then SHA-256 hash lowercase hex.

### Snapchat CAPI format before hashing

Snap phone should be digits only, include country code, no plus, no local leading zero:

```txt
212612345678
```

Then SHA-256 hash lowercase hex.

### TikTok Events API format before hashing

TikTok phone should be E.164 with plus before hashing:

```txt
+212612345678
```

Then SHA-256 hash lowercase hex.

Important:

- Do not hash in browser for server CAPI.
- Backend hashes server-side.
- Do not double-hash.
- Hash exact normalized value required by each platform.

## Hashing Helper

Backend Python helper:

```py
import hashlib

def sha256_hex(value: str) -> str:
    return hashlib.sha256(value.encode("utf-8")).hexdigest()

def normalize_ma_phone_local(phone: str) -> str:
    # accepts already-validated 06/07 number
    digits = "".join(ch for ch in phone if ch.isdigit())
    if not len(digits) == 10 or not digits.startswith(("06", "07")):
        raise ValueError("Invalid Moroccan mobile")
    return digits

def normalize_phone_meta_snap(phone: str) -> str:
    local = normalize_ma_phone_local(phone)
    return "212" + local[1:]

def normalize_phone_tiktok(phone: str) -> str:
    return "+" + normalize_phone_meta_snap(phone)
```

## Meta Pixel

Public env:

- `NEXT_PUBLIC_META_PIXEL_ID`

Events:

```ts
fbq('track', 'PageView');
fbq('track', 'ViewContent', {
  content_ids: [sku],
  content_type: 'product',
  content_name: arabicName,
  currency: 'MAD',
  value: 199
}, { eventID });
fbq('track', 'AddToCart', {
  content_ids: [sku],
  content_type: 'product',
  currency: 'MAD',
  value
}, { eventID });
fbq('track', 'InitiateCheckout', {
  currency: 'MAD',
  value,
  num_items
}, { eventID });
fbq('track', 'Purchase', {
  currency: 'MAD',
  value: total,
  contents,
  content_type: 'product'
}, { eventID });
```

## Meta CAPI Payload

Endpoint:

```txt
POST https://graph.facebook.com/vXX.X/{pixel_id}/events?access_token={token}
```

Payload shape:

```json
{
  "data": [
    {
      "event_name": "Purchase",
      "event_time": 1710000000,
      "event_id": "order_event_id",
      "action_source": "website",
      "event_source_url": "https://hnina.shop/merci?orderId=...",
      "user_data": {
        "ph": ["sha256(212612345678)"],
        "fn": ["sha256(normalized first name optional)"],
        "ct": ["sha256(city lowercase no punctuation optional)"],
        "country": ["sha256(ma)"],
        "client_ip_address": "request ip",
        "client_user_agent": "request user-agent",
        "fbp": "_fbp cookie",
        "fbc": "_fbc cookie"
      },
      "custom_data": {
        "currency": "MAD",
        "value": 398,
        "order_id": "HN-20260605-0001",
        "contents": [
          {"id": "HNINA-MAMA", "quantity": 2, "item_price": 149.5}
        ],
        "content_type": "product"
      }
    }
  ]
}
```

## TikTok Pixel

Public env:

- `NEXT_PUBLIC_TIKTOK_PIXEL_ID`

Events:

- `ViewContent`
- `AddToCart`
- `InitiateCheckout`
- `CompletePayment` for final COD order submission, or `PlaceAnOrder` if preferred and supported by current pixel SDK.

Use one naming convention consistently in browser and server.

For user matching:

- Browser may use `ttq.identify` if collecting phone, but prefer backend CAPI for sensitive data.
- TikTok phone format for matching is E.164 `+212...`.

## TikTok Events API Notes

Backend env:

- `TIKTOK_PIXEL_CODE`
- `TIKTOK_ACCESS_TOKEN`
- `TIKTOK_TEST_EVENT_CODE` optional

User phone:

- normalize as `+212612345678`
- hash SHA-256 lowercase hex before sending as `phone_number`

Include:

- `_ttp` cookie when available
- `ttclid` click ID when available
- IP and user agent

## Snapchat Pixel

Public env:

- `NEXT_PUBLIC_SNAP_PIXEL_ID`

Track:

- `PAGE_VIEW`
- `VIEW_CONTENT`
- `ADD_CART`
- `START_CHECKOUT`
- `PURCHASE`

## Snapchat CAPI Notes

Backend env:

- `SNAP_PIXEL_ID`
- `SNAP_ACCESS_TOKEN`

Phone:

- normalize as `212612345678`
- hash SHA-256 lowercase hex
- send in `ph`

Dedup:

- server uses `client_dedup_id`
- frontend should pass same event ID if browser event supports dedup ID.

Include:

- `_scid` cookie as `sc_cookie1` if available
- `ScCid` click ID as `sc_click_id` if available
- IP and user agent

## Frontend Tracking Module

Create `lib/tracking-client.ts`:

- `loadPixelsDeferred()`
- `trackPageView()`
- `trackViewContent(product, eventId)`
- `trackAddToCart(items, value, eventId)`
- `trackInitiateCheckout(cart, eventId)`
- `trackPurchase(order, eventId)`

All methods should no-op if env IDs are missing.

## Backend Tracking Module

Create:

```txt
backend/app/services/tracking/
  meta.py
  tiktok.py
  snapchat.py
  hashing.py
  payloads.py
```

Behavior:

- If token/env missing, skip platform and log warning.
- Never fail order creation because an ad API is down.
- Run CAPI sends after DB commit.
- Store tracking request/response summaries in `tracking_events` table.

## Privacy

- Do not send address to ad platforms.
- Do not send unhashed phone/name to CAPI.
- Keep raw phone/address in backend DB only for order fulfillment.
- Add privacy policy explaining pixels and advertising measurement.

