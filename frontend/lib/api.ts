"use client";

import type { CartItem } from "@/store/cart-store";
import type { UTMParams } from "./utm";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "https://api.hnina.shop";

export type OrderCustomer = {
  fullName: string;
  phone: string;
  phoneConfirm: string;
  city: string;
  address: string;
};

export type OrderUpsell = {
  shown: boolean;
  accepted: boolean;
  productId?: string;
  price?: number;
};

export type OrderTotals = {
  subtotal: number;
  deliveryFee: number;
  total: number;
  currency: "MAD";
};

export type OrderAttribution = UTMParams & {
  sourcePage: string;
  landingPage: string;
  referrer: string;
};

export type OrderTracking = {
  eventId: string;
  fbp: string;
  fbc: string;
  ttp: string;
  scid: string;
  fbclid: string;
  ttclid: string;
  scClickId: string;
};

export type CreateOrderPayload = {
  customer: OrderCustomer;
  items: Array<{
    productId: string;
    sku: string;
    name: string;
    quantity: number;
    unitPrice: number;
    lineTotal: number;
    isUpsell: boolean;
    source: string;
  }>;
  upsell: OrderUpsell;
  totals: OrderTotals;
  attribution: OrderAttribution;
  tracking: OrderTracking;
};

export type CreateOrderResponse = {
  orderId: string;
  orderNumber: string;
  status: string;
};

export async function createOrder(
  payload: CreateOrderPayload
): Promise<CreateOrderResponse> {
  const res = await fetch(`${API_BASE}/api/orders`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    let errorMsg = "وقع مشكل مؤقت، عاودي حاولي بعد لحظات.";
    try {
      const data = await res.json();
      if (data?.detail) errorMsg = data.detail;
    } catch {
      // ignore parse error
    }
    throw new Error(errorMsg);
  }

  return res.json();
}

export async function getOrder(
  orderId: string
): Promise<CreateOrderResponse | null> {
  try {
    const res = await fetch(`${API_BASE}/api/orders/${orderId}`);
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

export async function submitContactForm(data: {
  name: string;
  phone: string;
  message: string;
  sourcePage?: string;
}): Promise<void> {
  const res = await fetch(`${API_BASE}/api/contact`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    throw new Error("وقع مشكل في إرسال رسالتك. حاولي مرة أخرى.");
  }
}
