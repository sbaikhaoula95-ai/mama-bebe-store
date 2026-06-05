# Deployment, Docker, And EasyPanel

## Domains

- Frontend: `https://hnina.shop`
- Backend: `https://api.hnina.shop`

## Infrastructure

The user already has:

- EasyPanel server
- PostgreSQL installed
- database name: `hnina`

Use environment variables for all secrets.

## Required Repositories/Folders

The coder should create:

```txt
frontend/
backend/
```

Each folder must be independently deployable in EasyPanel.

## Frontend Dockerfile

Use multi-stage Next.js Docker build.

Requirements:

- install dependencies
- build Next.js app
- run standalone output if configured
- expose port `3000`

Frontend env:

- `NEXT_PUBLIC_SITE_URL=https://hnina.shop`
- `NEXT_PUBLIC_API_BASE_URL=https://api.hnina.shop`
- public pixel IDs only

## Backend Dockerfile

Requirements:

- Python 3.12 slim
- install requirements
- copy app
- expose port `8000`
- run migrations before server

Start command:

```sh
alembic upgrade head && uvicorn app.main:app --host 0.0.0.0 --port 8000
```

If using Gunicorn:

```sh
alembic upgrade head && gunicorn app.main:app -k uvicorn.workers.UvicornWorker -b 0.0.0.0:8000
```

## EasyPanel Frontend Service

Suggested:

- App type: Dockerfile
- Port: `3000`
- Domain: `hnina.shop`
- HTTPS enabled
- Env from `frontend/.env.example`

## EasyPanel Backend Service

Suggested:

- App type: Dockerfile
- Port: `8000`
- Domain: `api.hnina.shop`
- HTTPS enabled
- Env from `backend/.env.example`

## Database URL

Use the internal EasyPanel PostgreSQL service URL in backend env.

Example format only:

```txt
postgresql+asyncpg://USER:PASSWORD@hnina_database:5432/hnina
```

Do not commit the real password.

If EasyPanel gives a URL starting with `postgres://`, convert for SQLAlchemy async:

```txt
postgres://user:pass@host:5432/hnina?sslmode=disable
```

to:

```txt
postgresql+asyncpg://user:pass@host:5432/hnina
```

For internal Docker network, SSL is usually disabled/not needed.

## CORS

Backend must allow:

```txt
https://hnina.shop
https://www.hnina.shop
http://localhost:3000
```

## Health Checks

Backend:

```txt
GET /health
```

Frontend:

```txt
GET /
```

## Logging

Backend logs must show:

- order created
- sheet webhook success/failure
- each CAPI platform skipped/success/failure
- validation errors without exposing full PII

Frontend logs:

- keep console clean in production

## Deployment Checklist

1. Push repo to GitHub.
2. Create frontend app in EasyPanel.
3. Add frontend env vars.
4. Attach `hnina.shop`.
5. Create backend app in EasyPanel.
6. Add backend env vars.
7. Attach `api.hnina.shop`.
8. Confirm backend can connect to DB.
9. Confirm migrations run.
10. Submit test order.
11. Confirm order in DB.
12. Confirm order in Google Sheet.
13. Confirm pixels in test tools.
14. Confirm CAPI test events.

## Rollback

Keep previous successful image/build in EasyPanel when possible.

If backend migration fails:

- app should not start
- inspect logs
- fix migration
- redeploy

Do not manually edit production DB unless necessary.

