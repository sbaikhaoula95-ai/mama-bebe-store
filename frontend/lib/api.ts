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
  try {
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

    return await res.json();
  } catch (error) {
    // If it's a network error (Failed to fetch) or backend is down,
    // we can fallback to a generated order ID so the Google Sheets webhook
    // can still capture the order.
    console.error("Backend order creation failed:", error);
    
    // Generate a fallback order ID and number
    const fallbackId = "fallback_" + Math.random().toString(36).substring(2, 9);
    const fallbackNumber = "HN-" + Math.floor(1000 + Math.random() * 9000);
    
    return {
      orderId: fallbackId,
      orderNumber: fallbackNumber,
      status: "pending_fallback"
    };
  }
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
