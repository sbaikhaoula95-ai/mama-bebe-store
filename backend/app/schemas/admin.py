from __future__ import annotations
from datetime import datetime
from decimal import Decimal
from typing import Any, Literal, Optional

from pydantic import BaseModel, ConfigDict, Field


def _to_camel(s: str) -> str:
    parts = s.split("_")
    return parts[0] + "".join(p.title() for p in parts[1:])


class _Camel(BaseModel):
    model_config = ConfigDict(
        alias_generator=_to_camel,
        populate_by_name=True,
    )


# ─────── Auth ───────

class LoginIn(_Camel):
    username: str = Field(min_length=1, max_length=80)
    password: str = Field(min_length=1, max_length=200)


class LoginOut(_Camel):
    token: str
    expires_at: int
    subject: str


class MeOut(_Camel):
    subject: str
    expires_at: int


# ─────── Metrics ───────

class MetricsOverview(_Camel):
    range_from: datetime
    range_to: datetime

    visits_total: int           # all page_views in range
    visits_valid: int           # is_valid_visit=true only — Morocco, non-VPN
    visits_blocked: int
    unique_sessions: int        # distinct session_id among valid visits

    orders_total: int
    orders_confirmed: int
    orders_shipped: int
    orders_delivered: int
    orders_cancelled: int
    orders_returned: int

    revenue_total: Decimal      # subtotal sum of ALL orders (regardless of status)
    revenue_delivered: Decimal  # subtotal sum of delivered orders only

    aov: Decimal                # revenue_total / orders_total
    conversion_rate: float      # orders_total / visits_valid (×100)
    confirmation_rate: float    # confirmed+shipped+delivered+returned / total (×100)
    delivery_rate: float        # delivered / (delivered+returned) (×100)
    upsell_take_rate: float     # upsell_accepted / upsell_shown (×100)


class TimeseriesPoint(_Camel):
    day: str                # YYYY-MM-DD
    visits: int
    orders: int
    revenue: Decimal


class TopProduct(_Camel):
    product_id: str
    name_ar: str
    units_sold: int
    revenue: Decimal


class TopCity(_Camel):
    city: str
    orders: int
    revenue: Decimal


class UtmSource(_Camel):
    source: str
    visits: int
    orders: int
    conversion_rate: float


class TrafficBlockReason(_Camel):
    reason: str
    count: int


class MetricsResponse(_Camel):
    overview: MetricsOverview
    timeseries: list[TimeseriesPoint]
    top_products: list[TopProduct]
    top_cities: list[TopCity]
    utm_sources: list[UtmSource]
    blocked_reasons: list[TrafficBlockReason]
    status_breakdown: dict[str, int]


# ─────── Orders ───────

OrderStatus = Literal[
    "received",
    "pending_callback",
    "confirmed",
    "shipped",
    "delivered",
    "returned",
    "cancelled",
]

ORDER_STATUS_VALUES: tuple[str, ...] = (
    "received",
    "pending_callback",
    "confirmed",
    "shipped",
    "delivered",
    "returned",
    "cancelled",
)


class OrderListItem(_Camel):
    id: str
    order_number: str
    status: str
    customer_name: str
    phone: str
    city: str
    total: Decimal
    currency: str
    items_count: int
    upsell_accepted: bool
    utm_source: Optional[str] = None
    created_at: datetime


class OrderListResponse(_Camel):
    items: list[OrderListItem]
    total: int
    page: int
    page_size: int
    pages: int


class OrderItemDetail(_Camel):
    product_id: str
    sku: str
    name_ar: str
    quantity: int
    unit_price: Decimal
    line_total: Decimal
    is_upsell: bool


class OrderDetail(_Camel):
    id: str
    order_number: str
    status: str
    customer_name: str
    phone: str
    phone_normalized: Optional[str] = None
    city: str
    address: str

    items: list[OrderItemDetail]

    subtotal: Decimal
    delivery_fee: Decimal
    total: Decimal
    currency: str

    upsell_shown: bool
    upsell_accepted: bool
    upsell_product_id: Optional[str] = None

    source_page: Optional[str] = None
    landing_page: Optional[str] = None
    referrer: Optional[str] = None
    utm_source: Optional[str] = None
    utm_medium: Optional[str] = None
    utm_campaign: Optional[str] = None
    utm_content: Optional[str] = None
    utm_term: Optional[str] = None
    fbclid: Optional[str] = None
    ttclid: Optional[str] = None

    client_ip: Optional[str] = None
    user_agent: Optional[str] = None

    sheet_status: Optional[str] = None
    sheet_sent_at: Optional[datetime] = None
    sheet_last_error: Optional[str] = None

    tracking_events: list[dict[str, Any]] = []

    created_at: datetime
    updated_at: datetime


class OrderStatusUpdate(_Camel):
    status: OrderStatus
