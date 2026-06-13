"""
Stateless admin auth.

We don't need a full JWT lib for a single-admin login: a small HMAC-signed token
made from stdlib is enough and avoids adding dependencies.

Token shape:  base64url(payload_json) "." base64url(hmac_sha256(payload_json, secret))

Payload: {"sub": "admin", "iat": <epoch>, "exp": <epoch>}.

The token is rejected if:
- the signature is wrong (HMAC mismatch),
- the token is expired,
- ADMIN_TOKEN_SECRET / ADMIN_PASSWORD are not configured.
"""
from __future__ import annotations

import base64
import hashlib
import hmac
import json
import secrets
import time
from typing import Any

from fastapi import Depends, Header, HTTPException, status

from app.core.config import settings


# ─────────────────────────────────────────────────────────────────────────────
# Token build / verify
# ─────────────────────────────────────────────────────────────────────────────

def _b64encode(data: bytes) -> str:
    return base64.urlsafe_b64encode(data).rstrip(b"=").decode("ascii")


def _b64decode(s: str) -> bytes:
    padding = "=" * (-len(s) % 4)
    return base64.urlsafe_b64decode(s + padding)


def _sign(payload_b64: str, secret: str) -> str:
    sig = hmac.new(
        secret.encode("utf-8"),
        payload_b64.encode("ascii"),
        hashlib.sha256,
    ).digest()
    return _b64encode(sig)


def _check_secret_configured() -> None:
    if not settings.admin_password:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Admin login is not configured on the server (ADMIN_PASSWORD missing).",
        )
    if (
        not settings.admin_token_secret
        or settings.admin_token_secret == "CHANGE_ME_ADMIN_TOKEN_SECRET"
    ):
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Admin token secret is not configured (ADMIN_TOKEN_SECRET).",
        )


def issue_token(subject: str = "admin") -> tuple[str, int]:
    """Returns (token, expires_at_epoch)."""
    _check_secret_configured()
    now = int(time.time())
    exp = now + settings.admin_token_ttl_hours * 3600
    payload: dict[str, Any] = {
        "sub": subject,
        "iat": now,
        "exp": exp,
        # `nonce` is just to differ between two tokens issued in the same second.
        "nonce": secrets.token_urlsafe(8),
    }
    payload_b64 = _b64encode(json.dumps(payload, separators=(",", ":")).encode("utf-8"))
    signature = _sign(payload_b64, settings.admin_token_secret)
    return f"{payload_b64}.{signature}", exp


def verify_token(token: str) -> dict[str, Any]:
    _check_secret_configured()
    try:
        payload_b64, signature = token.split(".", 1)
    except ValueError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid admin token.",
        )

    expected = _sign(payload_b64, settings.admin_token_secret)
    if not hmac.compare_digest(expected, signature):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid admin token.",
        )

    try:
        payload = json.loads(_b64decode(payload_b64))
    except (ValueError, json.JSONDecodeError):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid admin token.",
        )

    if int(payload.get("exp", 0)) < int(time.time()):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Admin token expired.",
        )
    return payload


# ─────────────────────────────────────────────────────────────────────────────
# Login + FastAPI dependency
# ─────────────────────────────────────────────────────────────────────────────

def authenticate(username: str, password: str) -> bool:
    """Constant-time creds check against the env-configured admin."""
    _check_secret_configured()
    expected_username = settings.admin_username or "admin"
    return hmac.compare_digest(
        username.strip().encode("utf-8"), expected_username.encode("utf-8")
    ) and hmac.compare_digest(
        password.encode("utf-8"), settings.admin_password.encode("utf-8")
    )


def require_admin(
    authorization: str | None = Header(default=None, alias="Authorization"),
) -> dict[str, Any]:
    """FastAPI dependency that protects admin routes via Bearer token."""
    if not authorization or not authorization.lower().startswith("bearer "):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Missing admin Bearer token.",
            headers={"WWW-Authenticate": "Bearer"},
        )
    token = authorization.split(" ", 1)[1].strip()
    return verify_token(token)


AdminUser = Depends(require_admin)
