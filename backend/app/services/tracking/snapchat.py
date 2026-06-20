import time
import httpx
from typing import Optional
from app.core.config import settings
from app.core.logging import logger
from app.services.tracking.hashing import hash_phone_meta_snap
from app.models.order import Order, OrderItem


async def send_snap_capi(
    order: Order,
    items: list[OrderItem],
) -> tuple[str, Optional[int], Optional[str]]:
    """
    Fire Snapchat Conversions API PURCHASE event.
    Returns (status, response_code, response_body).
    """
    if not settings.snap_pixel_id or not settings.snap_access_token:
        logger.info("Snapchat CAPI not configured, skipping.")
        return "skipped", None, None

    try:
        hashed_phone = hash_phone_meta_snap(order.phone)
    except ValueError as e:
        logger.warning(f"Snap CAPI: phone normalization failed: {e}")
        return "skipped", None, str(e)

    user_data: dict = {
        "ph": hashed_phone,
        "client_ip_address": order.client_ip or "",
        "client_user_agent": order.user_agent or "",
    }
    if order.scid:
        user_data["sc_cookie1"] = order.scid
    if order.sc_click_id:
        user_data["sc_click_id"] = order.sc_click_id

    custom_data: dict = {
        "currency": "MAD",
        "value": float(order.total),
        "order_id": order.order_number,
        "item_ids": [item.sku for item in items],
        "number_items": sum(item.quantity for item in items),
    }

    event = {
        "event_name": "PURCHASE",
        "action_source": "WEB",
        "event_time": int(time.time() * 1000),
        "event_source_url": f"https://hnina.shop/merci?orderId={order.order_number}",
        "event_id": order.event_id,
        "user_data": user_data,
        "custom_data": custom_data,
    }

    payload = {
        "data": [event],
    }

    url = f"https://tr.snapchat.com/v3/{settings.snap_pixel_id}/events"
    headers = {
        "Authorization": f"Bearer {settings.snap_access_token}",
        "Content-Type": "application/json",
    }

    logger.info(f"Sending Snap CAPI for order {order.order_number} with client_dedup_id: {order.event_id}")
    logger.debug(f"Snap CAPI payload: {payload}")

    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            response = await client.post(url, json=payload, headers=headers)
            body = response.text[:500]
            if response.status_code in (200, 201):
                logger.info(f"Snap CAPI success for order {order.order_number}. Response: {body}")
                return "success", response.status_code, body
            else:
                logger.error(f"Snap CAPI failed for {order.order_number}: {response.status_code} {body}")
                return "failed", response.status_code, body
    except Exception as e:
        logger.error(f"Snap CAPI error for {order.order_number}: {e}")
        return "failed", None, str(e)
