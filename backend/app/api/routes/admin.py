"""
Admin dashboard routes.

Auth model: HMAC Bearer token (see `app.services.admin_auth`).
Login: POST /api/admin/login → returns token. Frontend stores it in localStorage.
All other routes require `Authorization: Bearer <token>` (verified via the
`require_admin` dependency).
"""
from __future__ import annotations

import uuid
from datetime import date, datetime, timedelta, timezone
from decimal import Decimal
from typing import Any, Optional

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy import and_, case, desc, func, or_, select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.db.session import get_db
from app.models.order import Order, OrderItem
from app.models.page_view import PageView
from app.models.tracking_event import TrackingEvent
from app.schemas.admin import (
    LoginIn,
    LoginOut,
    MeOut,
    MetricsOverview,
    MetricsResponse,
    OrderDetail,
    OrderItemDetail,
    OrderListItem,
    OrderListResponse,
    OrderStatusUpdate,
    ORDER_STATUS_VALUES,
    TimeseriesPoint,
    TopCity,
    TopProduct,
    TrafficBlockReason,
    UtmSource,
)
from app.services.admin_auth import authenticate, issue_token, require_admin

router = APIRouter()


# ─────────────────────────────────────────────────────────────────────────────
# Auth
# ─────────────────────────────────────────────────────────────────────────────


@router.post("/login", response_model=LoginOut)
async def admin_login(payload: LoginIn):
    if not authenticate(payload.username, payload.password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="بيانات الدخول غير صحيحة.",
        )
    token, exp = issue_token()
    return LoginOut(token=token, expires_at=exp, subject="admin")


@router.get("/me", response_model=MeOut)
async def admin_me(user: dict[str, Any] = Depends(require_admin)):
    return MeOut(subject=user.get("sub", "admin"), expires_at=int(user.get("exp", 0)))


# ─────────────────────────────────────────────────────────────────────────────
# Helpers
# ─────────────────────────────────────────────────────────────────────────────


def _parse_date(value: Optional[str], default: datetime) -> datetime:
    if not value:
        return default
    try:
        # Accept both YYYY-MM-DD and full ISO.
        if "T" in value:
            return datetime.fromisoformat(value.replace("Z", "+00:00"))
        d = date.fromisoformat(value)
        return datetime(d.year, d.month, d.day, tzinfo=timezone.utc)
    except ValueError:
        raise HTTPException(status_code=400, detail=f"Invalid date: {value}")


def _resolve_range(
    from_: Optional[str], to_: Optional[str]
) -> tuple[datetime, datetime]:
    now = datetime.now(timezone.utc)
    default_to = now
    default_from = now - timedelta(days=7)
    f = _parse_date(from_, default_from)
    t = _parse_date(to_, default_to)
    # If `to_` was given as YYYY-MM-DD it points to midnight; push to end-of-day.
    if to_ and "T" not in to_:
        t = t + timedelta(days=1) - timedelta(seconds=1)
    if f > t:
        raise HTTPException(status_code=400, detail="`from` must be before `to`.")
    return f, t


def _safe_pct(numerator: float, denominator: float) -> float:
    if not denominator:
        return 0.0
    return round((numerator / denominator) * 100, 2)


DELIVERY_SUCCESS_STATUSES = ("confirmed", "shipped", "delivered", "returned")


# ─────────────────────────────────────────────────────────────────────────────
# Metrics — main dashboard
# ─────────────────────────────────────────────────────────────────────────────


@router.get("/metrics", response_model=MetricsResponse)
async def get_metrics(
    from_: Optional[str] = Query(default=None, alias="from"),
    to_: Optional[str] = Query(default=None, alias="to"),
    db: AsyncSession = Depends(get_db),
    _: dict[str, Any] = Depends(require_admin),
):
    f, t = _resolve_range(from_, to_)

    # ─── Page views ───
    # Only is_valid_visit=true rows count as "clicks".
    visit_counts_row = (
        await db.execute(
            select(
                func.count(PageView.id).label("total"),
                func.count(
                    case((PageView.is_valid_visit.is_(True), 1))
                ).label("valid"),
            ).where(PageView.created_at.between(f, t))
        )
    ).one()
    visits_total = int(visit_counts_row.total or 0)
    visits_valid = int(visit_counts_row.valid or 0)
    visits_blocked = visits_total - visits_valid

    unique_sessions = int(
        (
            await db.execute(
                select(func.count(func.distinct(PageView.session_id))).where(
                    and_(
                        PageView.is_valid_visit.is_(True),
                        PageView.session_id.isnot(None),
                        PageView.created_at.between(f, t),
                    )
                )
            )
        ).scalar()
        or 0
    )

    # ─── Orders ───
    orders_rows = (
        await db.execute(
            select(Order.status, func.count(Order.id), func.coalesce(func.sum(Order.subtotal), 0))
            .where(Order.created_at.between(f, t))
            .group_by(Order.status)
        )
    ).all()
    status_counts: dict[str, int] = {s: 0 for s in ORDER_STATUS_VALUES}
    status_revenue: dict[str, Decimal] = {s: Decimal("0") for s in ORDER_STATUS_VALUES}
    for s, n, rev in orders_rows:
        key = s or "received"
        status_counts[key] = status_counts.get(key, 0) + int(n)
        status_revenue[key] = status_revenue.get(key, Decimal("0")) + Decimal(str(rev or 0))

    orders_total = sum(status_counts.values())
    orders_confirmed = status_counts.get("confirmed", 0)
    orders_shipped = status_counts.get("shipped", 0)
    orders_delivered = status_counts.get("delivered", 0)
    orders_cancelled = status_counts.get("cancelled", 0)
    orders_returned = status_counts.get("returned", 0)

    revenue_total = sum(status_revenue.values(), Decimal("0"))
    revenue_delivered = status_revenue.get("delivered", Decimal("0"))

    aov = (
        (revenue_total / orders_total).quantize(Decimal("0.01"))
        if orders_total
        else Decimal("0")
    )

    confirmed_or_better = sum(
        status_counts.get(s, 0) for s in DELIVERY_SUCCESS_STATUSES
    )
    delivery_rate = _safe_pct(orders_delivered, orders_delivered + orders_returned)
    confirmation_rate = _safe_pct(confirmed_or_better, orders_total)

    upsell_row = (
        await db.execute(
            select(
                func.count(case((Order.upsell_shown.is_(True), 1))).label("shown"),
                func.count(case((Order.upsell_accepted.is_(True), 1))).label("accepted"),
            ).where(Order.created_at.between(f, t))
        )
    ).one()
    upsell_take_rate = _safe_pct(
        int(upsell_row.accepted or 0), int(upsell_row.shown or 0)
    )

    overview = MetricsOverview(
        range_from=f,
        range_to=t,
        visits_total=visits_total,
        visits_valid=visits_valid,
        visits_blocked=visits_blocked,
        unique_sessions=unique_sessions,
        orders_total=orders_total,
        orders_confirmed=orders_confirmed,
        orders_shipped=orders_shipped,
        orders_delivered=orders_delivered,
        orders_cancelled=orders_cancelled,
        orders_returned=orders_returned,
        revenue_total=revenue_total,
        revenue_delivered=revenue_delivered,
        aov=aov,
        conversion_rate=_safe_pct(orders_total, visits_valid),
        confirmation_rate=confirmation_rate,
        delivery_rate=delivery_rate,
        upsell_take_rate=upsell_take_rate,
    )

    # ─── Daily timeseries (visits + orders + revenue) ───
    visits_by_day = (
        await db.execute(
            select(
                func.date_trunc("day", PageView.created_at).label("day"),
                func.count(PageView.id),
            )
            .where(
                and_(
                    PageView.is_valid_visit.is_(True),
                    PageView.created_at.between(f, t),
                )
            )
            .group_by("day")
        )
    ).all()
    orders_by_day = (
        await db.execute(
            select(
                func.date_trunc("day", Order.created_at).label("day"),
                func.count(Order.id),
                func.coalesce(func.sum(Order.subtotal), 0),
            )
            .where(Order.created_at.between(f, t))
            .group_by("day")
        )
    ).all()

    visit_map = {row.day.date().isoformat(): int(row[1]) for row in visits_by_day}
    order_map = {
        row.day.date().isoformat(): (int(row[1]), Decimal(str(row[2])))
        for row in orders_by_day
    }
    days: list[TimeseriesPoint] = []
    days_in_range = max(1, (t.date() - f.date()).days + 1)
    for i in range(days_in_range):
        day = (f.date() + timedelta(days=i)).isoformat()
        v = visit_map.get(day, 0)
        o_count, o_rev = order_map.get(day, (0, Decimal("0")))
        days.append(TimeseriesPoint(day=day, visits=v, orders=o_count, revenue=o_rev))

    # ─── Top products ───
    top_products_rows = (
        await db.execute(
            select(
                OrderItem.product_id,
                OrderItem.name_ar,
                func.sum(OrderItem.quantity).label("units"),
                func.sum(OrderItem.line_total).label("rev"),
            )
            .join(Order, Order.id == OrderItem.order_id)
            .where(Order.created_at.between(f, t))
            .group_by(OrderItem.product_id, OrderItem.name_ar)
            .order_by(desc("units"))
            .limit(10)
        )
    ).all()
    top_products = [
        TopProduct(
            product_id=row.product_id,
            name_ar=row.name_ar,
            units_sold=int(row.units or 0),
            revenue=Decimal(str(row.rev or 0)),
        )
        for row in top_products_rows
    ]

    # ─── Top cities ───
    top_cities_rows = (
        await db.execute(
            select(
                Order.city,
                func.count(Order.id).label("orders"),
                func.coalesce(func.sum(Order.subtotal), 0).label("rev"),
            )
            .where(Order.created_at.between(f, t))
            .group_by(Order.city)
            .order_by(desc("orders"))
            .limit(10)
        )
    ).all()
    top_cities = [
        TopCity(
            city=row.city or "—",
            orders=int(row.orders or 0),
            revenue=Decimal(str(row.rev or 0)),
        )
        for row in top_cities_rows
    ]

    # ─── UTM sources ───
    utm_rows = (
        await db.execute(
            select(
                func.coalesce(PageView.utm_source, "direct").label("src"),
                func.count(PageView.id).label("visits"),
            )
            .where(
                and_(
                    PageView.is_valid_visit.is_(True),
                    PageView.created_at.between(f, t),
                )
            )
            .group_by("src")
            .order_by(desc("visits"))
            .limit(10)
        )
    ).all()
    orders_by_source_rows = (
        await db.execute(
            select(
                func.coalesce(Order.utm_source, "direct").label("src"),
                func.count(Order.id).label("orders"),
            )
            .where(Order.created_at.between(f, t))
            .group_by("src")
        )
    ).all()
    orders_by_source = {row.src: int(row.orders) for row in orders_by_source_rows}

    utm_sources = [
        UtmSource(
            source=row.src,
            visits=int(row.visits or 0),
            orders=orders_by_source.get(row.src, 0),
            conversion_rate=_safe_pct(
                orders_by_source.get(row.src, 0), int(row.visits or 0)
            ),
        )
        for row in utm_rows
    ]

    # ─── Blocked reasons (so the admin sees why visits were filtered) ───
    blocked_rows = (
        await db.execute(
            select(
                func.coalesce(PageView.block_reason, "unknown"),
                func.count(PageView.id),
            )
            .where(
                and_(
                    PageView.is_valid_visit.is_(False),
                    PageView.created_at.between(f, t),
                )
            )
            .group_by(PageView.block_reason)
            .order_by(desc(func.count(PageView.id)))
            .limit(8)
        )
    ).all()
    blocked_reasons = [
        TrafficBlockReason(reason=row[0] or "unknown", count=int(row[1] or 0))
        for row in blocked_rows
    ]

    return MetricsResponse(
        overview=overview,
        timeseries=days,
        top_products=top_products,
        top_cities=top_cities,
        utm_sources=utm_sources,
        blocked_reasons=blocked_reasons,
        status_breakdown=status_counts,
    )


# ─────────────────────────────────────────────────────────────────────────────
# Orders — list + detail + status update
# ─────────────────────────────────────────────────────────────────────────────


@router.get("/orders", response_model=OrderListResponse)
async def list_orders(
    from_: Optional[str] = Query(default=None, alias="from"),
    to_: Optional[str] = Query(default=None, alias="to"),
    status_filter: Optional[str] = Query(default=None, alias="status"),
    q: Optional[str] = Query(default=None),
    page: int = Query(default=1, ge=1),
    page_size: int = Query(default=25, ge=1, le=200),
    db: AsyncSession = Depends(get_db),
    _: dict[str, Any] = Depends(require_admin),
):
    f, t = _resolve_range(from_, to_)
    where_clauses = [Order.created_at.between(f, t)]

    if status_filter and status_filter != "all":
        if status_filter not in ORDER_STATUS_VALUES:
            raise HTTPException(status_code=400, detail=f"Unknown status: {status_filter}")
        where_clauses.append(Order.status == status_filter)

    if q:
        like = f"%{q.strip()}%"
        where_clauses.append(
            or_(
                Order.order_number.ilike(like),
                Order.customer_name.ilike(like),
                Order.phone.ilike(like),
                Order.city.ilike(like),
            )
        )

    total = int(
        (
            await db.execute(
                select(func.count(Order.id)).where(and_(*where_clauses))
            )
        ).scalar()
        or 0
    )

    items_count_subq = (
        select(
            OrderItem.order_id,
            func.coalesce(func.sum(OrderItem.quantity), 0).label("items_count"),
        )
        .group_by(OrderItem.order_id)
        .subquery()
    )

    stmt = (
        select(Order, func.coalesce(items_count_subq.c.items_count, 0).label("items_count"))
        .outerjoin(items_count_subq, items_count_subq.c.order_id == Order.id)
        .where(and_(*where_clauses))
        .order_by(Order.created_at.desc())
        .limit(page_size)
        .offset((page - 1) * page_size)
    )
    rows = (await db.execute(stmt)).all()

    items = [
        OrderListItem(
            id=str(o.id),
            order_number=o.order_number,
            status=o.status,
            customer_name=o.customer_name,
            phone=o.phone,
            city=o.city,
            total=o.total,
            currency=o.currency,
            items_count=int(items_count),
            upsell_accepted=o.upsell_accepted,
            utm_source=o.utm_source,
            created_at=o.created_at,
        )
        for o, items_count in rows
    ]

    pages = (total + page_size - 1) // page_size if total else 0
    return OrderListResponse(
        items=items, total=total, page=page, page_size=page_size, pages=pages
    )


async def _load_order_detail(db: AsyncSession, order_id: str) -> OrderDetail:
    try:
        uid = uuid.UUID(order_id)
    except ValueError:
        raise HTTPException(status_code=404, detail="طلب غير موجود")

    result = await db.execute(
        select(Order)
        .where(Order.id == uid)
        .options(selectinload(Order.items), selectinload(Order.tracking_events))
    )
    order = result.scalar_one_or_none()
    if not order:
        raise HTTPException(status_code=404, detail="طلب غير موجود")

    tracking_events = [
        {
            "id": str(te.id),
            "platform": te.platform,
            "eventName": te.event_name,
            "eventId": te.event_id,
            "status": te.status,
            "responseCode": te.response_code,
            "createdAt": te.created_at.isoformat() if te.created_at else None,
        }
        for te in (order.tracking_events or [])
    ]

    return OrderDetail(
        id=str(order.id),
        order_number=order.order_number,
        status=order.status,
        customer_name=order.customer_name,
        phone=order.phone,
        phone_normalized=order.phone_normalized,
        city=order.city,
        address=order.address,
        items=[
            OrderItemDetail(
                product_id=i.product_id,
                sku=i.sku,
                name_ar=i.name_ar,
                quantity=i.quantity,
                unit_price=i.unit_price,
                line_total=i.line_total,
                is_upsell=i.is_upsell,
            )
            for i in (order.items or [])
        ],
        subtotal=order.subtotal,
        delivery_fee=order.delivery_fee,
        total=order.total,
        currency=order.currency,
        upsell_shown=order.upsell_shown,
        upsell_accepted=order.upsell_accepted,
        upsell_product_id=order.upsell_product_id,
        source_page=order.source_page,
        landing_page=order.landing_page,
        referrer=order.referrer,
        utm_source=order.utm_source,
        utm_medium=order.utm_medium,
        utm_campaign=order.utm_campaign,
        utm_content=order.utm_content,
        utm_term=order.utm_term,
        fbclid=order.fbclid,
        ttclid=order.ttclid,
        client_ip=order.client_ip,
        user_agent=order.user_agent,
        sheet_status=order.sheet_status,
        sheet_sent_at=order.sheet_sent_at,
        sheet_last_error=order.sheet_last_error,
        tracking_events=tracking_events,
        created_at=order.created_at,
        updated_at=order.updated_at,
    )


@router.get("/orders/{order_id}", response_model=OrderDetail)
async def get_order(
    order_id: str,
    db: AsyncSession = Depends(get_db),
    _: dict[str, Any] = Depends(require_admin),
):
    return await _load_order_detail(db, order_id)


@router.patch("/orders/{order_id}/status", response_model=OrderDetail)
async def update_order_status(
    order_id: str,
    payload: OrderStatusUpdate,
    db: AsyncSession = Depends(get_db),
    _: dict[str, Any] = Depends(require_admin),
):
    if payload.status not in ORDER_STATUS_VALUES:
        raise HTTPException(status_code=400, detail=f"Unknown status: {payload.status}")

    try:
        uid = uuid.UUID(order_id)
    except ValueError:
        raise HTTPException(status_code=404, detail="طلب غير موجود")

    result = await db.execute(select(Order).where(Order.id == uid))
    order = result.scalar_one_or_none()
    if not order:
        raise HTTPException(status_code=404, detail="طلب غير موجود")

    order.status = payload.status
    order.updated_at = datetime.now(timezone.utc)
    await db.commit()

    return await _load_order_detail(db, order_id)


# ─────────────────────────────────────────────────────────────────────────────
# Constants endpoint — so the frontend stays in sync with the backend
# ─────────────────────────────────────────────────────────────────────────────


@router.get("/constants")
async def admin_constants(_: dict[str, Any] = Depends(require_admin)):
    return {
        "orderStatuses": list(ORDER_STATUS_VALUES),
        "successStatuses": list(DELIVERY_SUCCESS_STATUSES),
    }
