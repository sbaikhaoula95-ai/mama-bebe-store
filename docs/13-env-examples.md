# Environment Variables

The coder must create real `.env.example` files in both `frontend/` and `backend/`.

Do not commit real secrets.

## `frontend/.env.example`

```env
# Site
NEXT_PUBLIC_SITE_URL=https://hnina.shop
NEXT_PUBLIC_API_BASE_URL=https://api.hnina.shop

# Public pixel IDs only
NEXT_PUBLIC_META_PIXEL_ID=
NEXT_PUBLIC_TIKTOK_PIXEL_ID=
NEXT_PUBLIC_SNAP_PIXEL_ID=

# Optional feature toggles
NEXT_PUBLIC_ENABLE_META_PIXEL=true
NEXT_PUBLIC_ENABLE_TIKTOK_PIXEL=true
NEXT_PUBLIC_ENABLE_SNAP_PIXEL=true
NEXT_PUBLIC_ENABLE_DEBUG_TRACKING=false
```

## `backend/.env.example`

```env
# App
APP_NAME=hnina-api
APP_ENV=production
DEBUG=false
PUBLIC_FRONTEND_URL=https://hnina.shop
API_BASE_URL=https://api.hnina.shop
ALLOWED_ORIGINS=https://hnina.shop,https://www.hnina.shop

# Database
# Example format only. Put the real EasyPanel internal database URL in production env.
DATABASE_URL=postgresql+asyncpg://hnina:CHANGE_ME@hnina_database:5432/hnina

# Security
WEBHOOK_SHARED_SECRET=CHANGE_ME
ORDER_LOOKUP_SECRET=CHANGE_ME

# Google Sheets Apps Script webhook (must be the deployed /exec URL)
SHEET_WEBHOOK_URL=

# Meta CAPI
META_PIXEL_ID=
META_ACCESS_TOKEN=
META_TEST_EVENT_CODE=
META_API_VERSION=v20.0

# TikTok Events API
TIKTOK_PIXEL_CODE=
TIKTOK_ACCESS_TOKEN=
TIKTOK_TEST_EVENT_CODE=

# Snapchat CAPI
SNAP_PIXEL_ID=
SNAP_ACCESS_TOKEN=

# Optional notifications
SMTP_HOST=
SMTP_PORT=
SMTP_USER=
SMTP_PASSWORD=
NOTIFY_EMAIL_TO=
TELEGRAM_BOT_TOKEN=
TELEGRAM_CHAT_ID=

# Rate limiting
ORDER_RATE_LIMIT_PER_IP_HOUR=10
ORDER_RATE_LIMIT_PER_PHONE_DAY=3

# MaxMind minFraud order protection
# Requires a MaxMind account ID and license key/API key.
# When enabled, orders are accepted only from Morocco, and VPN/proxy/Tor/hosting/high-risk IPs are blocked.
MAXMIND_ENABLED=false
MAXMIND_ACCOUNT_ID=
MAXMIND_LICENSE_KEY=
MAXMIND_RISK_SCORE_THRESHOLD=25
MAXMIND_WHITELISTED_PHONES=0610000000
```

## Notes

- The user has an EasyPanel PostgreSQL internal URL. Do not commit it if it includes a real password.
- Convert `postgres://` to `postgresql+asyncpg://` for SQLAlchemy async.
- Keep frontend env limited to public values.
- All CAPI access tokens belong only in backend env.
- Google Apps Script webhook uses URL-only auth (no shared secret). Only the backend knows the `/exec` URL.

