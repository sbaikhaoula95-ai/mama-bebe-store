from __future__ import annotations
import uuid
from datetime import datetime
from decimal import Decimal
from hmac import compare_digest

from fastapi import APIRouter, Depends, Header, HTTPException, Query, Request
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import func, or_, select
from sqlalchemy.orm import selectinload

from app.db.session import get_db
from app.schemas.order import CreateOrderIn, CreateOrderOut
from app.models.order import Order, OrderItem
from app.models.tracking_event import TrackingEvent
from app.services.pricing import (
    calculate_order_totals,
    get_item_unit_price,
    get_product_info,
    UPSELL_PRICE,
)
from app.services.order_numbers import generate_order_number
from app.services.sheet_webhook import send_to_google_sheets
from app.services.tracking.meta import send_meta_capi
from app.services.tracking.tiktok import send_tiktok_capi
from app.services.tracking.snapchat import send_snap_capi
from app.services.fraud.maxmind import evaluate_order_ip, extract_client_ip
from app.core.config import settings
from app.core.logging import logger

router = APIRouter()


def _record_sheet_result(
    order: Order,
    sheet_success: bool,
    sheet_error: str | None,
) -> None:
    order.sheet_status = "sent" if sheet_success else "failed"
    order.sheet_sent_at = datetime.utcnow() if sheet_success else None
    order.sheet_last_error = None if sheet_success else (sheet_error or "unknown_error")[:2000]


async def _require_webhook_secret(
    x_webhook_secret: str | None = Header(default=None, alias="X-Webhook-Secret"),
) -> None:
    configured_secret = settings.webhook_shared_secret
    if not configured_secret or configured_secret == "CHANGE_ME":
        logger.error("WEBHOOK_SHARED_SECRET is not configured for protected order tools.")
        raise HTTPException(status_code=503, detail="Webhook shared secret is not configured.")

    if not x_webhook_secret or not compare_digest(x_webhook_secret, configured_secret):
        raise HTTPException(status_code=401, detail="Invalid webhook secret.")


def _sheet_config_status() -> dict[str, bool]:
    webhook_url = settings.sheet_webhook_url.strip()
    return {
        "configured": bool(webhook_url),
        "looksLikeAppsScriptExecUrl": webhook_url.startswith(
            "https://script.google.com/macros/s/"
        )
        and webhook_url.endswith("/exec"),
    }


@router.post("/orders", status_code=201)
async def create_order(
    payload: CreateOrderIn,
    request: Request,
    db: AsyncSession = Depends(get_db),
):
    """Create a COD order. Recalculates totals server-side."""

    client_ip = extract_client_ip(
        request.headers,
        request.client.host if request.client else None,
    )
    user_agent = request.headers.get("user-agent", "")

    fraud_decision = await evaluate_order_ip(client_ip, payload.customer.phone)
    if not fraud_decision.allowed:
        logger.warning(
            "Order blocked by MaxMind: reason=%s ip=%s phone=%s country=%s risk=%s",
            fraud_decision.reason,
            client_ip,
            payload.customer.phone,
            fraud_decision.country_iso,
            fraud_decision.risk_score,
        )
        raise HTTPException(
            status_code=403,
            detail="لا يمكن تأكيد الطلب حاليا. تواصلي معنا على واتساب لإتمام الطلب.",
        )

    # Server-side pricing — never trust frontend totals
    try:
        totals = calculate_order_totals(payload.items)
    except ValueError as e:
        raise HTTPException(status_code=422, detail=str(e))

    # Generate order number
    order_number = await generate_order_number(db)

    # Build Order
    order = Order(
        order_number=order_number,
        status="received",
        customer_name=payload.customer.full_name,
        phone=payload.customer.phone,
        phone_normalized="212" + payload.customer.phone[1:],
        city=payload.customer.city,
        address=payload.customer.address,
        subtotal=totals["subtotal"],
        delivery_fee=totals["delivery_fee"],
        total=totals["total"],
        currency="MAD",
        upsell_shown=payload.upsell.shown,
        upsell_accepted=payload.upsell.accepted,
        upsell_product_id=payload.upsell.product_id,
        source_page=payload.attribution.source_page,
        landing_page=payload.attribution.landing_page,
        referrer=payload.attribution.referrer,
        utm_source=payload.attribution.utm_source,
        utm_medium=payload.attribution.utm_medium,
        utm_campaign=payload.attribution.utm_campaign,
        utm_content=payload.attribution.utm_content,
        utm_term=payload.attribution.utm_term,
        event_id=payload.tracking.event_id,
        fbp=payload.tracking.fbp,
        fbc=payload.tracking.fbc,
        ttp=payload.tracking.ttp,
        scid=payload.tracking.scid,
        fbclid=payload.tracking.fbclid,
        ttclid=payload.tracking.ttclid,
        sc_click_id=payload.tracking.sc_click_id,
        client_ip=client_ip,
        user_agent=user_agent[:500] if user_agent else None,
        sheet_status="pending",
    )
    db.add(order)
    await db.flush()  # get order.id

    # Build OrderItems with server-side prices
    non_upsell_qty = totals["non_upsell_qty"]
    order_items: list[OrderItem] = []

    for item_in in payload.items:
        product_info = get_product_info(item_in.product_id)
        unit_price = get_item_unit_price(
            item_in.product_id,
            item_in.is_upsell,
            non_upsell_qty,
            item_in.quantity,
        )
        line_total = (
            UPSELL_PRICE * item_in.quantity
            if item_in.is_upsell
            else unit_price * item_in.quantity
        ).quantize(Decimal("0.01"))

        oi = OrderItem(
            order_id=order.id,
            product_id=item_in.product_id,
            sku=product_info["sku"],
            name_ar=product_info["name_ar"],
            quantity=item_in.quantity,
            unit_price=unit_price,
            line_total=line_total,
            is_upsell=item_in.is_upsell,
            source="upsell" if item_in.is_upsell else "product_page",
        )
        db.add(oi)
        order_items.append(oi)

    await db.commit()
    await db.refresh(order)

    logger.info(
        f"Order created: {order.order_number} | {order.customer_name} | "
        f"{order.city} | {order.total} MAD"
    )

    # Fire integrations after DB commit — failures must not break order
    # Google Sheets
    sheet_success, sheet_error = await send_to_google_sheets(order, order_items)
    _record_sheet_result(order, sheet_success, sheet_error)
    await db.commit()

    # CAPI — fire all, store results
    capi_results = {}
    for platform, send_fn in [
        ("meta", send_meta_capi),
        ("tiktok", send_tiktok_capi),
        ("snapchat", send_snap_capi),
    ]:
        try:
            status, code, body = await send_fn(order, order_items)
            capi_results[platform] = status
            te = TrackingEvent(
                order_id=order.id,
                platform=platform,
                event_name="Purchase",
                event_id=order.event_id,
                payload_summary={"order_number": order.order_number},
                status=status,
                response_code=code,
                response_body=body[:500] if body else None,
            )
            db.add(te)
        except Exception as e:
            logger.error(f"CAPI {platform} unexpected error: {e}")

    await db.commit()

    first_name = order.customer_name.split()[0] if order.customer_name else order.customer_name

    out = CreateOrderOut(
        order_id=str(order.id),
        order_number=order.order_number,
        status=order.status,
        customer_first_name=first_name,
        city=order.city,
        total=order.total,
        currency=order.currency,
    )
    return out.model_dump(by_alias=True, mode="json")


@router.get("/orders/sheets/status")
async def get_google_sheets_status(
    _: None = Depends(_require_webhook_secret),
    db: AsyncSession = Depends(get_db),
):
    """Report whether Google Sheets is configured and how many orders need retry."""
    result = await db.execute(
        select(Order.sheet_status, func.count(Order.id)).group_by(Order.sheet_status)
    )
    counts = {status or "unknown": count for status, count in result.all()}

    return {
        "googleSheets": _sheet_config_status(),
        "counts": counts,
    }


@router.post("/orders/sheets/retry-failed")
async def retry_failed_google_sheets_orders(
    limit: int = Query(default=25, ge=1, le=200),
    _: None = Depends(_require_webhook_secret),
    db: AsyncSession = Depends(get_db),
):
    """Retry pending/failed Google Sheets sends after fixing the webhook config."""
    if not settings.sheet_webhook_url.strip():
        raise HTTPException(status_code=503, detail="SHEET_WEBHOOK_URL is not configured.")

    result = await db.execute(
        select(Order)
        .where(
            or_(
                Order.sheet_status.in_(("pending", "failed")),
                Order.sheet_status.is_(None),
            )
        )
        .options(selectinload(Order.items))
        .order_by(Order.created_at.asc())
        .limit(limit)
    )
    orders = result.scalars().all()

    retries = []
    sent_count = 0
    failed_count = 0
    for order in orders:
        sheet_success, sheet_error = await send_to_google_sheets(order, list(order.items))
        _record_sheet_result(order, sheet_success, sheet_error)
        if sheet_success:
            sent_count += 1
        else:
            failed_count += 1
        retries.append(
            {
                "orderId": str(order.id),
                "orderNumber": order.order_number,
                "sheetStatus": order.sheet_status,
                "sheetLastError": order.sheet_last_error,
            }
        )

    await db.commit()

    return {
        "googleSheets": _sheet_config_status(),
        "processed": len(retries),
        "sent": sent_count,
        "failed": failed_count,
        "results": retries,
    }


@router.post("/orders/{order_id}/sheet/resend")
async def resend_order_to_google_sheets(
    order_id: str,
    _: None = Depends(_require_webhook_secret),
    db: AsyncSession = Depends(get_db),
):
    """Resend one order to Google Sheets."""
    if not settings.sheet_webhook_url.strip():
        raise HTTPException(status_code=503, detail="SHEET_WEBHOOK_URL is not configured.")

    try:
        uid = uuid.UUID(order_id)
    except ValueError:
        raise HTTPException(status_code=404, detail="طلب غير موجود")

    result = await db.execute(
        select(Order).where(Order.id == uid).options(selectinload(Order.items))
    )
    order = result.scalar_one_or_none()

    if not order:
        raise HTTPException(status_code=404, detail="طلب غير موجود")

    sheet_success, sheet_error = await send_to_google_sheets(order, list(order.items))
    _record_sheet_result(order, sheet_success, sheet_error)
    await db.commit()

    return {
        "orderId": str(order.id),
        "orderNumber": order.order_number,
        "sheetStatus": order.sheet_status,
        "sheetLastError": order.sheet_last_error,
    }


@router.get("/orders/{order_id}")
async def get_order(
    order_id: str,
    db: AsyncSession = Depends(get_db),
):
    """Retrieve order summary for thank-you page."""
    try:
        uid = uuid.UUID(order_id)
    except ValueError:
        raise HTTPException(status_code=404, detail="طلب غير موجود")

    result = await db.execute(select(Order).where(Order.id == uid))
    order = result.scalar_one_or_none()

    if not order:
        raise HTTPException(status_code=404, detail="طلب غير موجود")

    first_name = order.customer_name.split()[0] if order.customer_name else order.customer_name

    out = CreateOrderOut(
        order_id=str(order.id),
        order_number=order.order_number,
        status=order.status,
        customer_first_name=first_name,
        city=order.city,
        total=order.total,
        currency=order.currency,
    )
    return out.model_dump(by_alias=True, mode="json")
