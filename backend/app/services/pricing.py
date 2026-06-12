from decimal import Decimal
from typing import List
from app.schemas.order import OrderItemIn

PRODUCT_PRICE = Decimal("199")
UPSELL_PRICE = Decimal("99")
FREE_DELIVERY_THRESHOLD = Decimal("299")
DELIVERY_FEE = Decimal("35")

PRODUCTS = {
    "hnina-mama": {
        "sku": "HNM-7281",
        "name_ar": "حنينة ماما بزيت الهندية والأرغان — لتشققات الحمل وشد البشرة",
    },
    "hnina-jodour": {
        "sku": "HNJ-3469",
        "name_ar": "حنينة جذور بزيت إكليل الجبل والجرجير والنيجلة — لتساقط الشعر وتقوية الجذور",
    },
    "hnina-calm": {
        "sku": "HNC-5827",
        "name_ar": "حنينة كالم بالكاليندولا والأرغان — للبشرة الجافة والحساسة والمتهيجة",
    },
}


def ladder_total(qty: int) -> Decimal:
    """Offer ladder pricing for non-upsell total quantity."""
    if qty <= 0:
        return Decimal("0")
    if qty == 1:
        return Decimal("199")
    if qty == 2:
        return Decimal("299")
    if qty == 3:
        return Decimal("399")
    return Decimal("399") + Decimal("199") * Decimal(qty - 3)


def calculate_order_totals(items: List[OrderItemIn]):
    """
    Server-side canonical pricing.
    Returns (non_upsell_total, upsell_total, subtotal, delivery_fee, total).
    """
    non_upsell_items = [i for i in items if not i.is_upsell]
    upsell_items = [i for i in items if i.is_upsell]

    non_upsell_qty = sum(i.quantity for i in non_upsell_items)
    non_upsell_total = ladder_total(non_upsell_qty)

    for item in upsell_items:
        if item.quantity != 1:
            raise ValueError("Upsell item must have quantity 1")

    upsell_total = UPSELL_PRICE * len(upsell_items)
    subtotal = non_upsell_total + upsell_total

    delivery_fee = Decimal("0") if subtotal >= FREE_DELIVERY_THRESHOLD else DELIVERY_FEE
    total = subtotal + delivery_fee

    return {
        "non_upsell_qty": non_upsell_qty,
        "non_upsell_total": non_upsell_total,
        "upsell_total": upsell_total,
        "subtotal": subtotal,
        "delivery_fee": delivery_fee,
        "total": total,
    }


def get_item_unit_price(product_id: str, is_upsell: bool, non_upsell_qty: int, quantity: int) -> Decimal:
    """Calculate effective unit price for an order item."""
    if is_upsell:
        return UPSELL_PRICE
    if non_upsell_qty <= 0:
        return PRODUCT_PRICE
    total = ladder_total(non_upsell_qty)
    unit = total / Decimal(non_upsell_qty)
    return unit.quantize(Decimal("0.01"))


def get_product_info(product_id: str) -> dict:
    """Get product SKU and Arabic name. Raises if unknown."""
    if product_id not in PRODUCTS:
        raise ValueError(f"Unknown product: {product_id}")
    return PRODUCTS[product_id]
