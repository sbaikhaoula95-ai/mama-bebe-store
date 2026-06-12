from __future__ import annotations
from decimal import Decimal
from typing import Literal, Optional
from pydantic import BaseModel, ConfigDict, field_validator, model_validator
import re

MOROCCO_PHONE_RE = re.compile(r"^0[67]\d{8}$")

VALID_PRODUCT_IDS = {"hnina-mama", "hnina-jodour", "hnina-calm"}


def _to_camel(s: str) -> str:
    parts = s.split("_")
    return parts[0] + "".join(p.title() for p in parts[1:])


class CamelModel(BaseModel):
    model_config = ConfigDict(
        alias_generator=_to_camel,
        populate_by_name=True,
    )


class CustomerIn(CamelModel):
    full_name: str
    phone: str
    phone_confirm: str
    city: str
    address: str

    @field_validator("phone", "phone_confirm")
    @classmethod
    def validate_phone(cls, v: str) -> str:
        v = v.strip()
        if not MOROCCO_PHONE_RE.match(v):
            raise ValueError("رقم الهاتف يجب أن يكون رقما مغربيا صحيحا (06 أو 07)")
        return v

    @model_validator(mode="after")
    def phones_match(self) -> CustomerIn:
        if self.phone != self.phone_confirm:
            raise ValueError("رقم الهاتف وتأكيد الرقم غير متطابقين")
        return self

    @field_validator("full_name")
    @classmethod
    def name_not_empty(cls, v: str) -> str:
        if len(v.strip()) < 2:
            raise ValueError("الاسم مطلوب")
        return v.strip()

    @field_validator("city")
    @classmethod
    def city_not_empty(cls, v: str) -> str:
        if len(v.strip()) < 2:
            raise ValueError("المدينة مطلوبة")
        return v.strip()

    @field_validator("address")
    @classmethod
    def address_not_empty(cls, v: str) -> str:
        if len(v.strip()) < 5:
            raise ValueError("العنوان مطلوب")
        return v.strip()


class OrderItemIn(CamelModel):
    product_id: str
    quantity: int
    is_upsell: bool = False
    unit_price: Optional[Decimal] = None

    @field_validator("product_id")
    @classmethod
    def valid_product(cls, v: str) -> str:
        if v not in VALID_PRODUCT_IDS:
            raise ValueError(f"منتج غير معروف: {v}")
        return v

    @field_validator("quantity")
    @classmethod
    def valid_quantity(cls, v: int) -> int:
        if v < 1 or v > 20:
            raise ValueError("الكمية غير صالحة")
        return v


class UpsellIn(CamelModel):
    shown: bool
    accepted: bool
    product_id: Optional[str] = None
    price: Optional[Decimal] = None


class AttributionIn(CamelModel):
    source_page: Optional[str] = None
    landing_page: Optional[str] = None
    referrer: Optional[str] = None
    utm_source: Optional[str] = None
    utm_medium: Optional[str] = None
    utm_campaign: Optional[str] = None
    utm_content: Optional[str] = None
    utm_term: Optional[str] = None


class TrackingIn(CamelModel):
    event_id: str
    fbp: Optional[str] = None
    fbc: Optional[str] = None
    ttp: Optional[str] = None
    scid: Optional[str] = None
    fbclid: Optional[str] = None
    ttclid: Optional[str] = None
    sc_click_id: Optional[str] = None


class CreateOrderIn(CamelModel):
    customer: CustomerIn
    items: list[OrderItemIn]
    upsell: UpsellIn
    attribution: AttributionIn
    tracking: TrackingIn

    @field_validator("items")
    @classmethod
    def items_not_empty(cls, v: list) -> list:
        if not v:
            raise ValueError("الطلب يجب أن يحتوي على منتج واحد على الأقل")
        return v


class OrderItemOut(CamelModel):
    product_id: str
    sku: str
    name_ar: str
    quantity: int
    unit_price: Decimal
    line_total: Decimal
    is_upsell: bool

    model_config = ConfigDict(
        alias_generator=_to_camel,
        populate_by_name=True,
        from_attributes=True,
    )


class CreateOrderOut(CamelModel):
    order_id: str
    order_number: str
    status: str
    customer_first_name: str
    city: str
    total: Decimal
    currency: str
