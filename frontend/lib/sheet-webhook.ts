"use client";

/**
 * Direct browser → Google Apps Script Sheets webhook.
 *
 * Why this exists in the frontend:
 *   The backend already posts to the same Apps Script URL, but if the
 *   backend deployment lags or its env var is missing, orders silently
 *   skip the sheet. Posting from the browser too is a belt-and-suspenders
 *   guarantee: as long as NEXT_PUBLIC_SHEET_WEBHOOK_URL is set, every
 *   confirmed order also arrives in the sheet directly from the browser.
 *
 * CORS:
 *   We intentionally do NOT set Content-Type: application/json. The
 *   browser then sends the body as text/plain, which is a CORS "simple
 *   request" and skips preflight. Apps Script's doPost reads
 *   e.postData.contents regardless of the MIME type, so JSON.parse
 *   inside Code.gs still works.
 *
 * Failure handling:
 *   This function never throws. The user's order experience must not be
 *   affected by Sheets errors. Failures are only logged to console for
 *   developer debugging.
 */

export type OrderItemForSheet = {
  sku: string;
  arabicName: string;
  quantity: number;
};

export type SheetOrderPayload = {
  orderNumber: string;
  customerName: string;
  phone: string;
  city: string;
  totalPrice: number;
  items: OrderItemForSheet[];
};

const MOROCCO_TZ_OFFSET_HOURS = 1;

function formatDateDMY(date: Date): string {
  const moroccoMs = date.getTime() + MOROCCO_TZ_OFFSET_HOURS * 60 * 60 * 1000;
  const m = new Date(moroccoMs);
  const dd = String(m.getUTCDate()).padStart(2, "0");
  const mm = String(m.getUTCMonth() + 1).padStart(2, "0");
  const yyyy = m.getUTCFullYear();
  return `${dd}/${mm}/${yyyy}`;
}

function normalizePhone(raw: string): string {
  if (!raw) return "";
  const digits = raw.replace(/\D/g, "");
  if (digits.startsWith("00212")) return "0" + digits.slice(5);
  if (digits.startsWith("212")) return "0" + digits.slice(3);
  if (!digits.startsWith("0") && digits.length === 9) return "0" + digits;
  return digits;
}

export async function sendOrderToSheet(
  payload: SheetOrderPayload
): Promise<{ success: boolean; error?: string }> {
  const url = process.env.NEXT_PUBLIC_SHEET_WEBHOOK_URL || "";
  if (!url) {
    return { success: false, error: "not_configured" };
  }

  const products = payload.items.map((i) => i.arabicName).join("/");
  const skus = payload.items.map((i) => i.sku).join("/");
  const quantities = payload.items.map((i) => String(i.quantity)).join("/");

  const body = JSON.stringify({
    date: formatDateDMY(new Date()),
    orderId: payload.orderNumber,
    country: "MOROCCO",
    name: payload.customerName,
    phone: normalizePhone(payload.phone),
    city: payload.city,
    product: products,
    sku: skus,
    quantity: quantities,
    totalPrice: payload.totalPrice,
    currency: "MAD",
    status: "",
  });

  try {
    const res = await fetch(url, {
      method: "POST",
      body,
      // No Content-Type → browser sends text/plain → no CORS preflight.
      // Apps Script reads e.postData.contents as a raw string, so
      // JSON.parse in Code.gs still works.
      mode: "cors",
      keepalive: true,
    });

    if (!res.ok) {
      return { success: false, error: `http_${res.status}` };
    }

    try {
      const data = await res.json();
      if (data && data.success === true) {
        return { success: true };
      }
      return {
        success: false,
        error: typeof data?.error === "string" ? data.error : "no_success_flag",
      };
    } catch {
      return { success: false, error: "non_json_response" };
    }
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "network_error",
    };
  }
}
