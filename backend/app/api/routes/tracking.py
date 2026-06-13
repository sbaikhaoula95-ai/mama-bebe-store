"""Public page-view ingestion. One row per visitor pageview."""
from __future__ import annotations

from fastapi import APIRouter, Depends, Request
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.config import settings
from app.core.logging import logger
from app.db.session import get_db
from app.models.page_view import PageView
from app.schemas.tracking import PageViewIn, PageViewOut
from app.services.fraud.maxmind import extract_client_ip
from app.services.fraud.ip_enrichment import enrich_ip

router = APIRouter()


@router.post("/track/pageview", response_model=PageViewOut, status_code=202)
async def ingest_pageview(
    payload: PageViewIn,
    request: Request,
    db: AsyncSession = Depends(get_db),
):
    """
    Stores a page view. Lookup against MaxMind happens here (cached in DB so
    the same IP is not re-charged within `TRACKING_IP_CACHE_HOURS`).

    The admin dashboard treats `is_valid_visit = TRUE` rows as "clicks".
    """
    if not settings.tracking_enabled:
        return PageViewOut(ok=True, counted=False, reason="tracking_disabled")

    client_ip = extract_client_ip(
        request.headers,
        request.client.host if request.client else None,
    )
    user_agent = request.headers.get("user-agent", "")[:1000]

    enriched = await enrich_ip(db, client_ip)

    page_view = PageView(
        session_id=payload.session_id,
        path=payload.path[:2048],
        referrer=payload.referrer[:2048] if payload.referrer else None,
        user_agent=user_agent or None,
        client_ip=client_ip,
        utm_source=payload.utm_source,
        utm_medium=payload.utm_medium,
        utm_campaign=payload.utm_campaign,
        utm_content=payload.utm_content,
        utm_term=payload.utm_term,
        fbclid=payload.fbclid,
        ttclid=payload.ttclid,
        country_iso=enriched["country_iso"],
        is_vpn=enriched["is_vpn"],
        is_proxy=enriched["is_proxy"],
        is_hosting=enriched["is_hosting"],
        is_tor=enriched["is_tor"],
        risk_score=enriched["risk_score"],
        is_valid_visit=enriched["is_valid_morocco"],
        block_reason=enriched["block_reason"],
    )
    db.add(page_view)
    try:
        await db.commit()
    except Exception as exc:  # noqa: BLE001
        await db.rollback()
        logger.warning("Failed to persist page view: %s", exc)
        return PageViewOut(ok=False, counted=False, reason="persist_failed")

    return PageViewOut(
        ok=True,
        counted=enriched["is_valid_morocco"],
        reason=enriched["block_reason"],
    )
