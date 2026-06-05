import time
import httpx
from typing import Optional
from app.core.config import settings
from app.core.logging import logger
from app.services.tracking.hashing import (
    hash_phone_meta_snap,
    hash_name_field,
    hash_city,
    hash_country,
)
from app.models.order import Order, OrderItem


async def send_meta_capi(
    order: Order,
    items: list[OrderItem],
) -> tuple[str, Optional[int], Optional[str]]:
    """
    Fire Meta Conversions API Purchase event.
    Returns (status, response_code, response_body).
    """
    if not settings.meta_pixel_id or not settings.meta_access_token:
        logger.info("Meta CAPI not configured, skipping.")
        return "skipped", None, None

    try:
        hashed_phone = hash_phone_meta_snap(order.phone)
    except ValueError as e:
        logger.warning(f"Meta CAPI: phone normalization failed: {e}")
        return "skipped", None, str(e)

    contents = [
        {
            "id": item.sku,
            "quantity": item.quantity,
            "item_price": float(item.unit_price),
        }
        for item in items
    ]

    user_data: dict = {
        "ph": [hashed_phone],
        "country": [hash_country()],
        "client_ip_address": order.client_ip or "",
        "client_user_agent": order.user_agent or "",
    }
    if order.fbp:
        user_data["fbp"] = order.fbp
    if order.fbc:
        user_data["fbc"] = order.fbc

    fn = hash_name_field(order.customer_name)
    if fn:
        user_data["fn"] = [fn]

    ct = hash_city(order.city)
    if ct:
        user_data["ct"] = [ct]

    event_payload: dict = {
        "event_name": "Purchase",
        "event_time": int(time.time()),
        "event_id": order.event_id,
        "action_source": "website",
        "event_source_url": f"https://hnina.shop/merci?orderId={order.order_number}",
        "user_data": user_data,
        "custom_data": {
            "currency": "MAD",
            "value": float(order.total),
            "order_id": order.order_number,
            "contents": contents,
            "content_type": "product",
        },
    }

    payload = {"data": [event_payload]}
    if settings.meta_test_event_code:
        payload["test_event_code"] = settings.meta_test_event_code

    url = f"https://graph.facebook.com/{settings.meta_api_version}/{settings.meta_pixel_id}/events"
    params = {"access_token": settings.meta_access_token}

    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            response = await client.post(url, params=params, json=payload)
            body = response.text[:500]
            if response.status_code in (200, 201):
                logger.info(f"Meta CAPI success for order {order.order_number}")
                return "success", response.status_code, body
            else:
                logger.error(f"Meta CAPI failed for {order.order_number}: {response.status_code} {body}")
                return "failed", response.status_code, body
    except Exception as e:
        logger.error(f"Meta CAPI error for {order.order_number}: {e}")
        return "failed", None, str(e)
