from __future__ import annotations

from datetime import datetime, timezone, timedelta
from typing import Optional

import httpx

from app.core.config import settings
from app.core.logging import logger
from app.models.order import Order, OrderItem


# Morocco is UTC+1 year-round (no DST since 2018, except Ramadan adjustments).
# Apps Script expects DD/MM/YYYY for the date column.
_MOROCCO_TZ = timezone(timedelta(hours=1))


def _format_date_dmy(dt: Optional[datetime]) -> str:
    when = dt or datetime.now(timezone.utc)
    if when.tzinfo is None:
        when = when.replace(tzinfo=timezone.utc)
    return when.astimezone(_MOROCCO_TZ).strftime("%d/%m/%Y")


def _format_phone(raw: str) -> str:
    """Normalize to local Moroccan format like 0612345678."""
    if not raw:
        return ""
    digits = "".join(ch for ch in raw if ch.isdigit())
    if digits.startswith("212"):
        digits = "0" + digits[3:]
    elif digits.startswith("00212"):
        digits = "0" + digits[5:]
    if not digits.startswith("0") and len(digits) == 9:
        digits = "0" + digits
    return digits


def _join_slash(values: list[str]) -> str:
    return "/".join(v if v is not None else "" for v in values)


async def send_to_google_sheets(
    order: Order,
    items: list[OrderItem],
) -> tuple[bool, Optional[str]]:
    """
    Send the order to the Google Apps Script webhook as a flat row.

    Sheet columns (in order):
        date | orderid | country | name | phone | product | sku | quantity | total price | currency | status
    """
    if not settings.sheet_webhook_url:
        logger.warning("Sheet webhook URL not configured, skipping.")
        return False, "not_configured"

    products = [item.name_ar for item in items]
    skus = [item.sku for item in items]
    quantities = [str(item.quantity) for item in items]

    payload = {
        "date": _format_date_dmy(order.created_at),
        "orderId": order.order_number,
        "country": "MOROCCO",
        "name": order.customer_name or "",
        "phone": _format_phone(order.phone or ""),
        "city": order.city or "",
        "product": _join_slash(products),
        "sku": _join_slash(skus),
        "quantity": _join_slash(quantities),
        "totalPrice": float(order.total),
        "currency": order.currency or "MAD",
        "status": "",
    }

    try:
        async with httpx.AsyncClient(
            timeout=10.0,
            follow_redirects=True,  # Apps Script redirects to googleusercontent
        ) as client:
            response = await client.post(
                settings.sheet_webhook_url,
                json=payload,
                headers={"Content-Type": "application/json"},
            )

        if not (200 <= response.status_code < 300):
            error = f"http_{response.status_code}: {response.text[:200]}"
            logger.error(
                "Sheet webhook failed for order %s: %s",
                order.order_number,
                error,
            )
            return False, error

        # Apps Script web apps always return HTTP 200, even on internal errors.
        # The real success signal is `success: true` in the JSON body. If we
        # only trusted the status code, silent Apps Script failures (wrong
        # spreadsheet, permissions, header drift, etc.) would be recorded as
        # `sheet_status="sent"` but no row would appear in the sheet.
        try:
            body = response.json()
        except ValueError:
            snippet = response.text[:200].replace("\n", " ")
            # Login page / non-JSON HTML usually means the deployment access
            # is not set to "Anyone" or the URL points at /dev instead of /exec.
            if "<html" in snippet.lower() or "sign in" in snippet.lower():
                error = "non_json_response_likely_auth_redirect"
            else:
                error = f"non_json_response: {snippet}"
            logger.error(
                "Sheet webhook returned non-JSON for order %s: %s",
                order.order_number,
                error,
            )
            return False, error

        if isinstance(body, dict) and body.get("success") is True:
            logger.info(
                "Sheet webhook success for order %s",
                order.order_number,
            )
            return True, None

        apps_script_error = (
            (body.get("error") if isinstance(body, dict) else None)
            or "apps_script_no_success_flag"
        )
        error = f"apps_script_error: {apps_script_error}"
        logger.error(
            "Sheet webhook reported failure for order %s: %s",
            order.order_number,
            error,
        )
        return False, error
    except Exception as exc:  # noqa: BLE001
        error = str(exc)
        logger.error(
            "Sheet webhook error for order %s: %s",
            order.order_number,
            error,
        )
        return False, error
