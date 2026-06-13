"use client";

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL || "https://api.hnina.shop";

const TOKEN_KEY = "hnina_admin_token";
const EXPIRES_KEY = "hnina_admin_expires";

export function getAdminToken(): string | null {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(TOKEN_KEY);
}

export function getAdminTokenExpiry(): number | null {
  if (typeof window === "undefined") return null;
  const raw = window.localStorage.getItem(EXPIRES_KEY);
  return raw ? Number(raw) : null;
}

export function clearAdminToken(): void {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(TOKEN_KEY);
  window.localStorage.removeItem(EXPIRES_KEY);
}

export function setAdminToken(token: string, expiresAt: number): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(TOKEN_KEY, token);
  window.localStorage.setItem(EXPIRES_KEY, String(expiresAt));
}

export function isAdminAuthenticated(): boolean {
  const token = getAdminToken();
  const exp = getAdminTokenExpiry();
  if (!token || !exp) return false;
  return exp * 1000 > Date.now() + 5000;
}

export class AdminApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

async function adminRequest<T>(
  path: string,
  options: {
    method?: "GET" | "POST" | "PATCH" | "DELETE";
    body?: unknown;
    auth?: boolean;
  } = {},
): Promise<T> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  if (options.auth !== false) {
    const token = getAdminToken();
    if (!token) throw new AdminApiError("missing_token", 401);
    headers.Authorization = `Bearer ${token}`;
  }

  const res = await fetch(`${API_BASE}${path}`, {
    method: options.method || "GET",
    headers,
    body: options.body ? JSON.stringify(options.body) : undefined,
    cache: "no-store",
  });

  if (res.status === 401) {
    clearAdminToken();
    throw new AdminApiError("unauthorized", 401);
  }

  if (!res.ok) {
    let message = `HTTP ${res.status}`;
    try {
      const data = await res.json();
      if (data?.detail) message = String(data.detail);
    } catch {
      // ignore
    }
    throw new AdminApiError(message, res.status);
  }

  if (res.status === 204) return undefined as T;
  return (await res.json()) as T;
}

// ─── Types (matched 1:1 with backend schemas) ───

export type LoginResponse = {
  token: string;
  expiresAt: number;
  subject: string;
};

export type MetricsOverview = {
  rangeFrom: string;
  rangeTo: string;
  visitsTotal: number;
  visitsValid: number;
  visitsBlocked: number;
  uniqueSessions: number;
  ordersTotal: number;
  ordersConfirmed: number;
  ordersShipped: number;
  ordersDelivered: number;
  ordersCancelled: number;
  ordersReturned: number;
  revenueTotal: string | number;
  revenueDelivered: string | number;
  aov: string | number;
  conversionRate: number;
  confirmationRate: number;
  deliveryRate: number;
  upsellTakeRate: number;
};

export type TimeseriesPoint = {
  day: string;
  visits: number;
  orders: number;
  revenue: string | number;
};

export type TopProduct = {
  productId: string;
  nameAr: string;
  unitsSold: number;
  revenue: string | number;
};

export type TopCity = {
  city: string;
  orders: number;
  revenue: string | number;
};

export type UtmSourceRow = {
  source: string;
  visits: number;
  orders: number;
  conversionRate: number;
};

export type TrafficBlockReason = {
  reason: string;
  count: number;
};

export type MetricsResponse = {
  overview: MetricsOverview;
  timeseries: TimeseriesPoint[];
  topProducts: TopProduct[];
  topCities: TopCity[];
  utmSources: UtmSourceRow[];
  blockedReasons: TrafficBlockReason[];
  statusBreakdown: Record<string, number>;
};

export type OrderListItem = {
  id: string;
  orderNumber: string;
  status: string;
  customerName: string;
  phone: string;
  city: string;
  total: string | number;
  currency: string;
  itemsCount: number;
  upsellAccepted: boolean;
  utmSource: string | null;
  createdAt: string;
};

export type OrderListResponse = {
  items: OrderListItem[];
  total: number;
  page: number;
  pageSize: number;
  pages: number;
};

export type OrderItemDetail = {
  productId: string;
  sku: string;
  nameAr: string;
  quantity: number;
  unitPrice: string | number;
  lineTotal: string | number;
  isUpsell: boolean;
};

export type OrderDetail = {
  id: string;
  orderNumber: string;
  status: string;
  customerName: string;
  phone: string;
  phoneNormalized: string | null;
  city: string;
  address: string;
  items: OrderItemDetail[];
  subtotal: string | number;
  deliveryFee: string | number;
  total: string | number;
  currency: string;
  upsellShown: boolean;
  upsellAccepted: boolean;
  upsellProductId: string | null;
  sourcePage: string | null;
  landingPage: string | null;
  referrer: string | null;
  utmSource: string | null;
  utmMedium: string | null;
  utmCampaign: string | null;
  utmContent: string | null;
  utmTerm: string | null;
  fbclid: string | null;
  ttclid: string | null;
  clientIp: string | null;
  userAgent: string | null;
  sheetStatus: string | null;
  sheetSentAt: string | null;
  sheetLastError: string | null;
  trackingEvents: Array<{
    id: string;
    platform: string;
    eventName: string;
    eventId: string;
    status: string;
    responseCode: number | null;
    createdAt: string | null;
  }>;
  createdAt: string;
  updatedAt: string;
};

export type AdminConstants = {
  orderStatuses: string[];
  successStatuses: string[];
};

// ─── API methods ───

export const ORDER_STATUSES = [
  "received",
  "pending_callback",
  "confirmed",
  "shipped",
  "delivered",
  "returned",
  "cancelled",
] as const;
export type OrderStatus = (typeof ORDER_STATUSES)[number];

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  received: "جديد",
  pending_callback: "ينتظر المعاودة",
  confirmed: "مؤكد",
  shipped: "خرج للتوصيل",
  delivered: "وصل",
  returned: "مرجوع",
  cancelled: "ملغي",
};

export const adminApi = {
  login: (username: string, password: string) =>
    adminRequest<LoginResponse>("/api/admin/login", {
      method: "POST",
      body: { username, password },
      auth: false,
    }),

  me: () => adminRequest<{ subject: string; expiresAt: number }>("/api/admin/me"),

  metrics: (from: string, to: string) =>
    adminRequest<MetricsResponse>(
      `/api/admin/metrics?from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}`,
    ),

  orders: (params: {
    from: string;
    to: string;
    status?: string;
    q?: string;
    page?: number;
    pageSize?: number;
  }) => {
    const q = new URLSearchParams({
      from: params.from,
      to: params.to,
      page: String(params.page ?? 1),
      page_size: String(params.pageSize ?? 25),
    });
    if (params.status && params.status !== "all") q.set("status", params.status);
    if (params.q) q.set("q", params.q);
    return adminRequest<OrderListResponse>(`/api/admin/orders?${q.toString()}`);
  },

  order: (id: string) => adminRequest<OrderDetail>(`/api/admin/orders/${id}`),

  updateOrderStatus: (id: string, status: OrderStatus) =>
    adminRequest<OrderDetail>(`/api/admin/orders/${id}/status`, {
      method: "PATCH",
      body: { status },
    }),
};
