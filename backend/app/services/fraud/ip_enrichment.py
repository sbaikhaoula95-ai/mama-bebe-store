"""
IP enrichment service used by analytics (`page_views`).

Rules:
- We cache every IP→{country, vpn, proxy, ...} lookup in `ip_lookups` for
  `settings.tracking_ip_cache_hours` (default 7 days) — so we don't burn MaxMind credits.
- An IP is "valid Moroccan" iff `country_iso` is in `tracking_country_whitelist`
  AND none of the suspicious traits are set (vpn/proxy/hosting/tor/anonymous).
- If MaxMind is disabled or credentials are missing, every lookup returns
  `is_valid_morocco=False, block_reason="maxmind_disabled"` so the dashboard
  shows ZERO "valid" clicks until MaxMind is configured. That is the correct
  fail-closed behaviour for "we only count clean Moroccan visits."
"""
from __future__ import annotations

from datetime import datetime, timedelta, timezone
from decimal import Decimal
from ipaddress import ip_address
from typing import Any

import httpx
from sqlalchemy import select
from sqlalchemy.dialects.postgresql import insert as pg_insert
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.config import settings
from app.core.logging import logger
from app.models.page_view import IpLookup

MAXMIND_SCORE_URL = "https://minfraud.maxmind.com/minfraud/v2.0/score"


_SUSPICIOUS_TRAIT_KEYS = (
    "is_anonymous",
    "is_anonymous_proxy",
    "is_anonymous_vpn",
    "is_hosting_provider",
    "is_public_proxy",
    "is_residential_proxy",
    "is_tor_exit_node",
)


def _is_public_ip(ip: str) -> bool:
    try:
        parsed = ip_address(ip)
    except ValueError:
        return False
    return not (
        parsed.is_private
        or parsed.is_loopback
        or parsed.is_link_local
        or parsed.is_multicast
        or parsed.is_reserved
        or parsed.is_unspecified
    )


def _evaluate_traits(traits: dict[str, Any]) -> dict[str, bool]:
    """Pull out the boolean flags we care about from a MaxMind response."""
    return {
        "is_anonymous": bool(traits.get("is_anonymous")),
        "is_anonymous_vpn": bool(traits.get("is_anonymous_vpn")),
        "is_public_proxy": bool(traits.get("is_public_proxy"))
        or bool(traits.get("is_anonymous_proxy")),
        "is_residential_proxy": bool(traits.get("is_residential_proxy")),
        "is_hosting_provider": bool(traits.get("is_hosting_provider")),
        "is_tor_exit_node": bool(traits.get("is_tor_exit_node")),
    }


async def _fetch_from_maxmind(ip: str) -> dict[str, Any] | None:
    if not settings.maxmind_account_id or not settings.maxmind_license_key:
        return None
    payload = {
        "device": {"ip_address": ip},
        "event": {"transaction_id": f"pv-{ip}"},
    }
    try:
        async with httpx.AsyncClient(timeout=4.0) as client:
            response = await client.post(
                MAXMIND_SCORE_URL,
                json=payload,
                auth=(settings.maxmind_account_id, settings.maxmind_license_key),
            )
            response.raise_for_status()
            return response.json()
    except httpx.HTTPStatusError as exc:
        logger.warning(
            "MaxMind IP lookup HTTP error: ip=%s status=%s body=%s",
            ip,
            exc.response.status_code,
            exc.response.text[:200],
        )
    except httpx.HTTPError as exc:
        logger.warning("MaxMind IP lookup failed: ip=%s error=%s", ip, exc)
    return None


def _build_private_lookup(ip: str) -> dict[str, Any]:
    """Local/private/dev IPs are passed through but never counted as valid."""
    # Localhost / private IPs are allowed during dev so the admin can test the
    # tracker locally without burning MaxMind credits.
    in_dev = settings.app_env != "production"
    return {
        "country_iso": "MA" if in_dev else None,
        "is_vpn": False,
        "is_proxy": False,
        "is_hosting": False,
        "is_tor": False,
        "is_anonymous": False,
        "risk_score": None,
        "is_valid_morocco": in_dev,
        "block_reason": None if in_dev else "non_public_ip",
        "source": "local-private",
    }


def _build_lookup_from_maxmind(data: dict[str, Any]) -> dict[str, Any]:
    ip_data = data.get("ip_address") or {}
    country_iso = (ip_data.get("country") or {}).get("iso_code")
    traits = _evaluate_traits(ip_data.get("traits") or {})
    risk_score_raw = data.get("risk_score")
    risk_score = Decimal(str(risk_score_raw)) if risk_score_raw is not None else None

    is_valid = True
    block_reason: str | None = None

    whitelist = settings.tracking_country_whitelist
    if not country_iso or country_iso.upper() not in whitelist:
        is_valid = False
        block_reason = "country_not_morocco"
    elif any(traits.values()):
        is_valid = False
        if traits["is_anonymous_vpn"]:
            block_reason = "vpn"
        elif traits["is_tor_exit_node"]:
            block_reason = "tor"
        elif traits["is_public_proxy"] or traits["is_residential_proxy"]:
            block_reason = "proxy"
        elif traits["is_hosting_provider"]:
            block_reason = "hosting_datacenter"
        else:
            block_reason = "anonymous"
    elif (
        risk_score is not None
        and float(risk_score) >= settings.maxmind_risk_score_threshold
    ):
        is_valid = False
        block_reason = "risk_score_too_high"

    return {
        "country_iso": country_iso,
        "is_vpn": traits["is_anonymous_vpn"],
        "is_proxy": traits["is_public_proxy"] or traits["is_residential_proxy"],
        "is_hosting": traits["is_hosting_provider"],
        "is_tor": traits["is_tor_exit_node"],
        "is_anonymous": traits["is_anonymous"],
        "risk_score": risk_score,
        "is_valid_morocco": is_valid,
        "block_reason": block_reason,
        "source": "maxmind",
    }


def _build_disabled_lookup() -> dict[str, Any]:
    return {
        "country_iso": None,
        "is_vpn": False,
        "is_proxy": False,
        "is_hosting": False,
        "is_tor": False,
        "is_anonymous": False,
        "risk_score": None,
        "is_valid_morocco": False,
        "block_reason": "maxmind_disabled",
        "source": "disabled",
    }


async def _refresh_cache(db: AsyncSession, ip: str, lookup: dict[str, Any]) -> None:
    now = datetime.now(timezone.utc)
    expires_at = now + timedelta(hours=settings.tracking_ip_cache_hours)

    stmt = (
        pg_insert(IpLookup)
        .values(
            ip=ip,
            country_iso=lookup["country_iso"],
            is_vpn=lookup["is_vpn"],
            is_proxy=lookup["is_proxy"],
            is_hosting=lookup["is_hosting"],
            is_tor=lookup["is_tor"],
            is_anonymous=lookup["is_anonymous"],
            risk_score=lookup["risk_score"],
            is_valid_morocco=lookup["is_valid_morocco"],
            block_reason=lookup["block_reason"],
            source=lookup["source"],
            looked_up_at=now,
            expires_at=expires_at,
        )
        .on_conflict_do_update(
            index_elements=[IpLookup.ip],
            set_={
                "country_iso": lookup["country_iso"],
                "is_vpn": lookup["is_vpn"],
                "is_proxy": lookup["is_proxy"],
                "is_hosting": lookup["is_hosting"],
                "is_tor": lookup["is_tor"],
                "is_anonymous": lookup["is_anonymous"],
                "risk_score": lookup["risk_score"],
                "is_valid_morocco": lookup["is_valid_morocco"],
                "block_reason": lookup["block_reason"],
                "source": lookup["source"],
                "looked_up_at": now,
                "expires_at": expires_at,
            },
        )
    )
    try:
        await db.execute(stmt)
    except Exception as exc:  # noqa: BLE001
        logger.warning("Failed to upsert ip_lookup for %s: %s", ip, exc)


async def enrich_ip(db: AsyncSession, ip: str | None) -> dict[str, Any]:
    """
    Return enrichment for `ip`, hitting the DB cache first.
    Always returns a dict with the standard keys; never raises.
    """
    if not ip:
        return {
            "country_iso": None,
            "is_vpn": False,
            "is_proxy": False,
            "is_hosting": False,
            "is_tor": False,
            "is_anonymous": False,
            "risk_score": None,
            "is_valid_morocco": False,
            "block_reason": "missing_ip",
            "source": "missing",
        }

    ip = ip.strip()

    if not _is_public_ip(ip):
        return _build_private_lookup(ip)

    # 1. Try cache (and refresh if expired).
    now = datetime.now(timezone.utc)
    cached = (
        await db.execute(select(IpLookup).where(IpLookup.ip == ip))
    ).scalar_one_or_none()
    if cached and cached.expires_at and cached.expires_at > now:
        return {
            "country_iso": cached.country_iso,
            "is_vpn": cached.is_vpn,
            "is_proxy": cached.is_proxy,
            "is_hosting": cached.is_hosting,
            "is_tor": cached.is_tor,
            "is_anonymous": cached.is_anonymous,
            "risk_score": cached.risk_score,
            "is_valid_morocco": cached.is_valid_morocco,
            "block_reason": cached.block_reason,
            "source": cached.source,
        }

    # 2. Cold path — hit MaxMind if enabled, else fail closed.
    if not settings.maxmind_enabled:
        lookup = _build_disabled_lookup()
        await _refresh_cache(db, ip, lookup)
        return lookup

    raw = await _fetch_from_maxmind(ip)
    if raw is None:
        # Treat lookup failure as "unknown" → not counted as valid.
        lookup = _build_disabled_lookup()
        lookup["block_reason"] = "maxmind_lookup_failed"
        await _refresh_cache(db, ip, lookup)
        return lookup

    lookup = _build_lookup_from_maxmind(raw)
    await _refresh_cache(db, ip, lookup)
    return lookup
