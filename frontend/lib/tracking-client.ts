"use client";

import { TRACKING } from "@/config/tracking";
import type { Product } from "@/config/products";
import type { CartItem } from "@/store/cart-store";

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
    ttq?: {
      track: (event: string, data?: Record<string, unknown>, opts?: Record<string, unknown>) => void;
      identify: (data: Record<string, unknown>) => void;
      load: (pixelId: string) => void;
      page: () => void;
    };
    snaptr?: (cmd: string, event?: string, data?: Record<string, unknown>) => void;
    _fbPixelLoaded?: boolean;
    _ttqLoaded?: boolean;
    _snapLoaded?: boolean;
  }
}

type MetaPixelQueue = ((...args: unknown[]) => void) & {
  q: unknown[];
  callMethod?: (...args: unknown[]) => void;
  loaded?: boolean;
  push?: (...args: unknown[]) => void;
  version?: string;
};

let pixelsLoaded = false;

export function loadPixelsDeferred(): void {
  if (typeof window === "undefined" || pixelsLoaded) return;

  const load = () => {
    if (pixelsLoaded) return;
    pixelsLoaded = true;

    if (TRACKING.enableMeta && TRACKING.metaPixelId) {
      loadMetaPixel(TRACKING.metaPixelId);
    }
    if (TRACKING.enableTiktok && TRACKING.tiktokPixelId) {
      loadTiktokPixel(TRACKING.tiktokPixelId);
    }
    if (TRACKING.enableSnap && TRACKING.snapPixelId) {
      loadSnapPixel(TRACKING.snapPixelId);
    }
  };

  if ("requestIdleCallback" in window) {
    requestIdleCallback(load, { timeout: 3000 });
  } else {
    setTimeout(load, 1500);
  }
}

function loadMetaPixel(pixelId: string): void {
  if (window._fbPixelLoaded) return;
  window._fbPixelLoaded = true;

  const n = function (...args: unknown[]) {
    n.q.push(args);
  } as MetaPixelQueue;
  n.q = [];
  n.loaded = true;
  n.version = "2.0";
  n.push = n;
  window.fbq = n as unknown as (...args: unknown[]) => void;

  const s = document.createElement("script");
  s.async = true;
  s.src = "https://connect.facebook.net/en_US/fbevents.js";
  document.head.appendChild(s);

  window.fbq("init", pixelId);
  window.fbq("track", "PageView");
}

function loadTiktokPixel(pixelId: string): void {
  if (window._ttqLoaded) return;
  window._ttqLoaded = true;

  const s = document.createElement("script");
  s.async = true;
  s.src = "https://analytics.tiktok.com/i18n/pixel/events.js";
  document.head.appendChild(s);

  s.onload = () => {
    if (window.ttq) {
      window.ttq.load(pixelId);
      window.ttq.page();
    }
  };
}

function loadSnapPixel(pixelId: string): void {
  if (window._snapLoaded) return;
  window._snapLoaded = true;

  const s = document.createElement("script");
  s.async = true;
  s.src = "https://sc-static.net/scevent.min.js";
  document.head.appendChild(s);

  s.onload = () => {
    if (window.snaptr) {
      window.snaptr("init", pixelId);
      window.snaptr("track", "PAGE_VIEW");
    }
  };
}

export function trackPageView(): void {
  if (typeof window === "undefined") return;
  if (TRACKING.debug) console.log("[Tracking] PageView");

  if (window.fbq) window.fbq("track", "PageView");
  if (window.ttq) window.ttq.track("ViewContent");
  if (window.snaptr) window.snaptr("track", "PAGE_VIEW");
}

export function trackViewContent(product: Product, eventId: string): void {
  if (typeof window === "undefined") return;
  if (TRACKING.debug) console.log("[Tracking] ViewContent", { product: product.slug, eventId });

  if (window.fbq) {
    window.fbq(
      "track",
      "ViewContent",
      {
        content_ids: [product.sku],
        content_type: "product",
        content_name: product.arabicName,
        currency: "MAD",
        value: product.price,
      },
      { eventID: eventId }
    );
  }

  if (window.ttq) {
    window.ttq.track(
      "ViewContent",
      {
        content_id: product.sku,
        content_name: product.arabicName,
        currency: "MAD",
        value: product.price,
      },
      { event_id: eventId }
    );
  }

  if (window.snaptr) {
    window.snaptr("track", "VIEW_CONTENT", {
      item_ids: [product.sku],
      item_category: "product",
      currency: "MAD",
      price: product.price,
      client_dedup_id: eventId,
    });
  }
}

export function trackAddToCart(
  items: CartItem[],
  value: number,
  eventId: string
): void {
  if (typeof window === "undefined") return;
  if (TRACKING.debug) console.log("[Tracking] AddToCart", { value, eventId });

  const contentIds = items.map((i) => i.sku).filter(Boolean);

  if (window.fbq) {
    window.fbq(
      "track",
      "AddToCart",
      {
        content_ids: contentIds,
        content_type: "product",
        currency: "MAD",
        value,
      },
      { eventID: eventId }
    );
  }

  if (window.ttq) {
    window.ttq.track(
      "AddToCart",
      {
        content_id: contentIds[0] || "",
        currency: "MAD",
        value,
      },
      { event_id: eventId }
    );
  }

  if (window.snaptr) {
    window.snaptr("track", "ADD_CART", {
      item_ids: contentIds,
      currency: "MAD",
      price: value,
      client_dedup_id: eventId,
    });
  }
}

export function trackInitiateCheckout(
  value: number,
  numItems: number,
  eventId: string
): void {
  if (typeof window === "undefined") return;
  if (TRACKING.debug) console.log("[Tracking] InitiateCheckout", { value, numItems, eventId });

  if (window.fbq) {
    window.fbq(
      "track",
      "InitiateCheckout",
      {
        currency: "MAD",
        value,
        num_items: numItems,
      },
      { eventID: eventId }
    );
  }

  if (window.ttq) {
    window.ttq.track(
      "InitiateCheckout",
      { currency: "MAD", value },
      { event_id: eventId }
    );
  }

  if (window.snaptr) {
    window.snaptr("track", "START_CHECKOUT", {
      currency: "MAD",
      price: value,
      client_dedup_id: eventId,
    });
  }
}

export function trackPurchase(
  order: {
    orderId: string;
    orderNumber?: string;
    phone?: string;
    total: number;
    items: Array<{ sku: string; quantity: number; unitPrice: number }>;
  },
  eventId: string
): void {
  if (typeof window === "undefined") return;
  if (TRACKING.debug) console.log("[Tracking] Purchase", { order, eventId });

  const contents = order.items.map((i) => ({
    id: i.sku,
    quantity: i.quantity,
    item_price: i.unitPrice,
  }));

  if (window.fbq) {
    if (order.phone && TRACKING.metaPixelId) {
      window.fbq("init", TRACKING.metaPixelId, { ph: order.phone });
    }
    window.fbq(
      "track",
      "Purchase",
      {
        currency: "MAD",
        value: order.total,
        contents,
        content_type: "product",
      },
      { eventID: eventId }
    );
  }

  if (window.ttq) {
    if (order.phone) {
      window.ttq.identify({ phone_number: order.phone });
    }
    window.ttq.track(
      "CompletePayment",
      {
        currency: "MAD",
        value: order.total,
        contents,
      },
      { event_id: eventId }
    );
  }

  if (window.snaptr) {
    const snapPayload: Record<string, unknown> = {
      currency: "MAD",
      price: order.total,
      client_dedup_id: eventId,
    };
    if (order.orderNumber) {
      snapPayload.transaction_id = order.orderNumber;
    }
    if (order.phone) {
      snapPayload.user_phone_number = order.phone;
    }
    window.snaptr("track", "PURCHASE", snapPayload);
  }
}
