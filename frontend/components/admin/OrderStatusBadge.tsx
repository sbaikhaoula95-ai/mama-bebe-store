"use client";

import { ORDER_STATUS_LABELS, type OrderStatus } from "@/lib/admin-api";

const STYLES: Record<OrderStatus, string> = {
  received: "bg-slate-100 text-slate-700 border-slate-200",
  pending_callback: "bg-amber-100 text-amber-800 border-amber-200",
  confirmed: "bg-blue-100 text-blue-800 border-blue-200",
  shipped: "bg-indigo-100 text-indigo-800 border-indigo-200",
  delivered: "bg-emerald-100 text-emerald-800 border-emerald-200",
  returned: "bg-orange-100 text-orange-800 border-orange-200",
  cancelled: "bg-red-100 text-red-800 border-red-200",
};

export function OrderStatusBadge({ status }: { status: string }) {
  const s = (status in STYLES ? status : "received") as OrderStatus;
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-semibold border ${STYLES[s]}`}
    >
      {ORDER_STATUS_LABELS[s] ?? status}
    </span>
  );
}
