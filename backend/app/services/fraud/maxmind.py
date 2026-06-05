from __future__ import annotations

from dataclasses import dataclass
from ipaddress import ip_address
from typing import Any

import httpx

from app.core.config import settings
from app.core.logging import logger


MAXMIND_SCORE_URL = "https://minfraud.maxmind.com/minfraud/v2.0/score"


@dataclass(frozen=True)
class FraudDecision:
    allowed: bool
    reason: str
    country_iso: str | None = None
    risk_score: float | None = None


def extract_client_ip(headers: dict[str, str], fallback_ip: str | None) -> str | None:
    """Return the best client IP from common reverse-proxy headers."""
    for header in ("cf-connecting-ip", "x-real-ip"):
        value = headers.get(header)
        if value:
            return value.strip()

    forwarded_for = headers.get("x-forwarded-for")
    if forwarded_for:
        return forwarded_for.split(",", 1)[0].strip()

    return fallback_ip


def is_whitelisted_phone(phone: str) -> bool:
    return phone.strip() in settings.maxmind_phone_whitelist


def _is_public_ip(ip: str) -> bool:
    parsed = ip_address(ip)
    return not (
        parsed.is_private
        or parsed.is_loopback
        or parsed.is_link_local
        or parsed.is_multicast
        or parsed.is_reserved
        or parsed.is_unspecified
    )


def _has_suspicious_traits(traits: dict[str, Any]) -> bool:
    suspicious_flags = (
        "is_anonymous",
        "is_anonymous_proxy",
        "is_anonymous_vpn",
        "is_hosting_provider",
        "is_public_proxy",
        "is_residential_proxy",
        "is_tor_exit_node",
    )
    return any(bool(traits.get(flag)) for flag in suspicious_flags)


async def evaluate_order_ip(ip: str | None, phone: str) -> FraudDecision:
    if is_whitelisted_phone(phone):
        return FraudDecision(True, "whitelisted_phone")

    if not settings.maxmind_enabled:
        return FraudDecision(True, "maxmind_disabled")

    if not ip:
        return FraudDecision(False, "missing_ip")

    try:
        if not _is_public_ip(ip):
            if settings.app_env != "production":
                return FraudDecision(True, "non_public_ip_allowed_in_non_production")
            return FraudDecision(False, "non_public_ip")
    except ValueError:
        return FraudDecision(False, "invalid_ip")

    if not settings.maxmind_account_id or not settings.maxmind_license_key:
        logger.error("MaxMind is enabled but credentials are missing")
        return FraudDecision(False, "maxmind_credentials_missing")

    payload = {
        "device": {
            "ip_address": ip,
        },
        "event": {
            "transaction_id": phone,
        },
    }

    try:
        async with httpx.AsyncClient(timeout=4.0) as client:
            response = await client.post(
                MAXMIND_SCORE_URL,
                json=payload,
                auth=(settings.maxmind_account_id, settings.maxmind_license_key),
            )
            response.raise_for_status()
            data = response.json()
    except httpx.HTTPStatusError as exc:
        logger.error(
            "MaxMind rejected fraud lookup: status=%s body=%s",
            exc.response.status_code,
            exc.response.text[:300],
        )
        return FraudDecision(False, "maxmind_lookup_failed")
    except httpx.HTTPError as exc:
        logger.error("MaxMind fraud lookup failed: %s", exc)
        return FraudDecision(False, "maxmind_lookup_failed")

    risk_score = float(data.get("risk_score") or 0)
    ip_data = data.get("ip_address") or {}
    country_iso = (ip_data.get("country") or {}).get("iso_code")
    traits = ip_data.get("traits") or {}

    if country_iso != "MA":
        return FraudDecision(
            False,
            "country_not_morocco",
            country_iso=country_iso,
            risk_score=risk_score,
        )

    if _has_suspicious_traits(traits):
        return FraudDecision(
            False,
            "vpn_proxy_or_datacenter",
            country_iso=country_iso,
            risk_score=risk_score,
        )

    if risk_score >= settings.maxmind_risk_score_threshold:
        return FraudDecision(
            False,
            "risk_score_too_high",
            country_iso=country_iso,
            risk_score=risk_score,
        )

    return FraudDecision(
        True,
        "allowed",
        country_iso=country_iso,
        risk_score=risk_score,
    )
