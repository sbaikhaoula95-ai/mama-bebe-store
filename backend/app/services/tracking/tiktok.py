import time
import httpx
from typing import Optional
from app.core.config import settings
from app.core.logging import logger
from app.services.tracking.hashing import hash_phone_tiktok
from app.models.order import Order, OrderItem


async def send_tiktok_capi(
    order: Order,
    items: list[OrderItem],
) -> tuple[str, Optional[int], Optional[str]]:
    """
    Fire TikTok Events API CompletePayment event.
    Returns (status, response_code, response_body).
    """
    if not settings.tiktok_pixel_code or not settings.tiktok_access_token:
        logger.info("TikTok Events API not configured, skipping.")
        return "skipped", None, None

    try:
        hashed_phone = hash_phone_tiktok(order.phone)
    except ValueError as e:
        logger.warning(f"TikTok CAPI: phone normalization failed: {e}")
        return "skipped", None, str(e)

    contents = [
        {
            "content_id": item.sku,
            "content_type": "product",
            "quantity": item.quantity,
            "price": float(item.unit_price),
        }
        for item in items
    ]

    properties: dict = {
        "currency": "MAD",
        "value": float(order.total),
        "contents": contents,
    }
    if order.order_number:
        properties["order_id"] = order.order_number

    user: dict = {
        "phone_number": hashed_phone,
        "ip": order.client_ip or "",
        "user_agent": order.user_agent or "",
    }
    if order.ttp:
        user["ttclid"] = order.ttp

    event = {
        "event": "CompletePayment",
        "event_time": int(time.time()),
        "event_id": order.event_id,
        "user": user,
        "properties": properties,
    }
    if settings.tiktok_test_event_code:
        event["test_event_code"] = settings.tiktok_test_event_code

    payload = {
        "pixel_code": settings.tiktok_pixel_code,
        "events": [event],
    }

    url = "https://business-api.tiktok.com/open_api/v1.3/event/track/"
    headers = {
        "Access-Token": settings.tiktok_access_token,
        "Content-Type": "application/json",
    }

    logger.info(f"Sending TikTok CAPI for order {order.order_number} with event_id: {order.event_id}")
    logger.debug(f"TikTok CAPI payload: {payload}")

    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            response = await client.post(url, json=payload, headers=headers)
            body = response.text[:500]
            if response.status_code in (200, 201):
                logger.info(f"TikTok CAPI success for order {order.order_number}. Response: {body}")
                return "success", response.status_code, body
            else:
                logger.error(f"TikTok CAPI failed for {order.order_number}: {response.status_code} {body}")
                return "failed", response.status_code, body
    except Exception as e:
        logger.error(f"TikTok CAPI error for {order.order_number}: {e}")
        return "failed", None, str(e)
