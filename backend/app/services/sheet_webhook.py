import httpx
from datetime import datetime
from typing import Optional
from app.core.config import settings
from app.core.logging import logger
from app.models.order import Order, OrderItem


async def send_to_google_sheets(
    order: Order,
    items: list[OrderItem],
) -> tuple[bool, Optional[str]]:
    """
    Send order data to Google Sheets via Apps Script webhook.
    Returns (success, error_message).
    """
    if not settings.sheet_webhook_url or not settings.sheet_webhook_secret:
        logger.warning("Sheet webhook URL or secret not configured, skipping.")
        return False, "not_configured"

    payload = {
        "secret": settings.sheet_webhook_secret,
        "order": {
            "orderId": order.order_number,
            "createdAt": order.created_at.isoformat() if order.created_at else datetime.utcnow().isoformat(),
            "status": order.status,
            "customerName": order.customer_name,
            "phone": order.phone,
            "city": order.city,
            "address": order.address,
            "subtotal": float(order.subtotal),
            "deliveryFee": float(order.delivery_fee),
            "total": float(order.total),
            "currency": order.currency,
            "upsellShown": order.upsell_shown,
            "upsellAccepted": order.upsell_accepted,
            "upsellProductId": order.upsell_product_id or "",
            "sourcePage": order.source_page or "",
            "utmSource": order.utm_source or "",
            "utmMedium": order.utm_medium or "",
            "utmCampaign": order.utm_campaign or "",
            "eventId": order.event_id,
            "userAgent": order.user_agent or "",
        },
        "items": [
            {
                "orderId": order.order_number,
                "productId": item.product_id,
                "sku": item.sku,
                "nameAr": item.name_ar,
                "quantity": item.quantity,
                "unitPrice": float(item.unit_price),
                "lineTotal": float(item.line_total),
                "isUpsell": item.is_upsell,
            }
            for item in items
        ],
        "events": [
            {
                "orderId": order.order_number,
                "type": "order_created",
                "message": "Order created from website",
            }
        ],
    }

    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            response = await client.post(
                settings.sheet_webhook_url,
                json=payload,
                headers={"Content-Type": "application/json"},
            )
            if response.status_code == 200:
                logger.info(f"Sheet webhook success for order {order.order_number}")
                return True, None
            else:
                error = f"HTTP {response.status_code}: {response.text[:200]}"
                logger.error(f"Sheet webhook failed for order {order.order_number}: {error}")
                return False, error
    except Exception as e:
        error = str(e)
        logger.error(f"Sheet webhook error for order {order.order_number}: {error}")
        return False, error
