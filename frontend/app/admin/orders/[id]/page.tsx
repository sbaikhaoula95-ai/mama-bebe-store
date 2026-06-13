"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import {
  adminApi,
  ORDER_STATUSES,
  ORDER_STATUS_LABELS,
  type OrderDetail,
  type OrderStatus,
} from "@/lib/admin-api";
import { OrderStatusBadge } from "@/components/admin/OrderStatusBadge";

function fmtMoney(value: number | string, currency = "MAD"): string {
  const n = typeof value === "string" ? Number(value) : value;
  if (!isFinite(n)) return "—";
  return `${n.toLocaleString("en-US", { maximumFractionDigits: 2 })} ${currency}`;
}

function fmtDate(value: string | null): string {
  if (!value) return "—";
  try {
    return new Date(value).toLocaleString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return value;
  }
}

export default function AdminOrderDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updating, setUpdating] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await adminApi.order(params.id);
      setOrder(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load order");
    } finally {
      setLoading(false);
    }
  }, [params.id]);

  useEffect(() => {
    load();
  }, [load]);

  const updateStatus = async (next: OrderStatus) => {
    if (!order || updating) return;
    setUpdating(true);
    try {
      const updated = await adminApi.updateOrderStatus(order.id, next);
      setOrder(updated);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to update status");
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return <div className="text-slate-400">Loading order…</div>;
  }
  if (error || !order) {
    return (
      <div className="px-4 py-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
        {error || "Order not found."}
      </div>
    );
  }

  const utmEntries = [
    ["utm_source", order.utmSource],
    ["utm_medium", order.utmMedium],
    ["utm_campaign", order.utmCampaign],
    ["utm_content", order.utmContent],
    ["utm_term", order.utmTerm],
    ["fbclid", order.fbclid],
    ["ttclid", order.ttclid],
  ].filter(([, v]) => !!v) as Array<[string, string]>;

  return (
    <div className="space-y-5">
      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <Link
            href="/admin/orders"
            className="text-sm text-slate-500 hover:text-pharmacy"
          >
            ← All orders
          </Link>
          <div className="flex items-center gap-3 mt-1">
            <h1 className="text-2xl md:text-3xl font-bold text-slate-900 font-mono">
              {order.orderNumber}
            </h1>
            <OrderStatusBadge status={order.status} />
            {order.upsellAccepted && (
              <span className="px-2 py-0.5 rounded-md text-xs font-semibold bg-amber-100 text-amber-800 border border-amber-200">
                ✨ Upsell accepted
              </span>
            )}
          </div>
          <p className="text-slate-500 text-sm mt-0.5">
            Created {fmtDate(order.createdAt)} · Updated {fmtDate(order.updatedAt)}
          </p>
        </div>
        <div className="flex gap-2">
          <a
            href={`tel:${order.phone}`}
            className="bg-pharmacy text-cream font-bold px-4 py-2 rounded-lg hover:opacity-90 text-sm"
          >
            📞 Call {order.phone}
          </a>
          <a
            href={`https://wa.me/${(order.phoneNormalized || order.phone).replace(/\D/g, "")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-emerald-600 text-white font-bold px-4 py-2 rounded-lg hover:opacity-90 text-sm"
          >
            💬 WhatsApp
          </a>
        </div>
      </header>

      {/* Status workflow */}
      <section className="bg-white rounded-xl border border-slate-200 p-4">
        <p className="text-xs text-slate-500 uppercase tracking-wide font-semibold mb-2">
          Update status
        </p>
        <div className="flex flex-wrap gap-1.5">
          {ORDER_STATUSES.map((s) => {
            const active = order.status === s;
            return (
              <button
                key={s}
                type="button"
                disabled={updating || active}
                onClick={() => updateStatus(s)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                  active
                    ? "bg-pharmacy text-cream cursor-default"
                    : "bg-slate-100 hover:bg-slate-200 text-slate-700"
                } ${updating ? "opacity-50 cursor-wait" : ""}`}
              >
                {ORDER_STATUS_LABELS[s]}
              </button>
            );
          })}
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Customer + Address */}
        <section className="lg:col-span-2 bg-white rounded-xl border border-slate-200 p-5">
          <h2 className="text-lg font-bold mb-3">Customer</h2>
          <dl className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
            <Field label="Name" value={order.customerName} dir="auto" />
            <Field label="Phone" value={order.phone} mono />
            <Field
              label="Phone (E.164)"
              value={order.phoneNormalized || "—"}
              mono
            />
            <Field label="City" value={order.city} dir="auto" />
            <div className="md:col-span-2">
              <Field label="Address" value={order.address} dir="auto" multiline />
            </div>
          </dl>
        </section>

        {/* Totals */}
        <section className="bg-white rounded-xl border border-slate-200 p-5">
          <h2 className="text-lg font-bold mb-3">Totals</h2>
          <dl className="space-y-2 text-sm">
            <Row label="Subtotal" value={fmtMoney(order.subtotal, order.currency)} />
            <Row
              label="Delivery"
              value={
                Number(order.deliveryFee) === 0
                  ? "Free"
                  : fmtMoney(order.deliveryFee, order.currency)
              }
            />
            <div className="border-t border-slate-200 pt-2 mt-2">
              <Row
                label="Total"
                value={fmtMoney(order.total, order.currency)}
                bold
              />
            </div>
          </dl>
        </section>
      </div>

      {/* Items */}
      <section className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <header className="px-5 py-4 border-b border-slate-200">
          <h2 className="text-lg font-bold">Items ({order.items.length})</h2>
        </header>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-xs text-slate-500 uppercase tracking-wider">
              <tr>
                <th className="text-left px-5 py-2.5 font-semibold">Product</th>
                <th className="text-left px-3 py-2.5 font-semibold">SKU</th>
                <th className="text-right px-3 py-2.5 font-semibold">Qty</th>
                <th className="text-right px-3 py-2.5 font-semibold">Unit</th>
                <th className="text-right px-5 py-2.5 font-semibold">Line total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {order.items.map((item, idx) => (
                <tr key={idx}>
                  <td className="px-5 py-3" dir="auto">
                    <div className="font-medium">
                      {item.nameAr.split(" — ")[0]}
                    </div>
                    <div className="text-xs text-slate-500">
                      {item.productId}
                      {item.isUpsell && (
                        <span className="ml-2 text-amber-600 font-bold">
                          ✨ UPSELL
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-3 py-3 font-mono text-xs">{item.sku}</td>
                  <td className="px-3 py-3 text-right tabular-nums">
                    {item.quantity}
                  </td>
                  <td className="px-3 py-3 text-right tabular-nums">
                    {fmtMoney(item.unitPrice, order.currency)}
                  </td>
                  <td className="px-5 py-3 text-right tabular-nums font-bold">
                    {fmtMoney(item.lineTotal, order.currency)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Attribution + Tech */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <section className="bg-white rounded-xl border border-slate-200 p-5">
          <h2 className="text-lg font-bold mb-3">Attribution</h2>
          {utmEntries.length === 0 ? (
            <p className="text-slate-400 italic text-sm">Direct visit.</p>
          ) : (
            <dl className="grid grid-cols-1 gap-1.5 text-sm">
              {utmEntries.map(([k, v]) => (
                <Field key={k} label={k} value={v} mono />
              ))}
            </dl>
          )}
          <div className="mt-4 pt-4 border-t border-slate-100 grid grid-cols-1 gap-1.5 text-sm">
            <Field label="Source page" value={order.sourcePage || "—"} mono small />
            <Field label="Landing page" value={order.landingPage || "—"} mono small />
            <Field label="Referrer" value={order.referrer || "—"} mono small />
          </div>
        </section>

        <section className="bg-white rounded-xl border border-slate-200 p-5">
          <h2 className="text-lg font-bold mb-3">Technical</h2>
          <dl className="grid grid-cols-1 gap-1.5 text-sm">
            <Field label="Client IP" value={order.clientIp || "—"} mono />
            <Field
              label="User-Agent"
              value={order.userAgent || "—"}
              mono
              small
            />
            <Field
              label="Sheet status"
              value={order.sheetStatus || "—"}
            />
            <Field
              label="Sheet sent at"
              value={fmtDate(order.sheetSentAt)}
            />
            {order.sheetLastError && (
              <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-3 py-2 text-xs mt-2">
                <strong>Last sheet error:</strong> {order.sheetLastError}
              </div>
            )}
          </dl>
        </section>
      </div>

      {/* Tracking events */}
      {order.trackingEvents.length > 0 && (
        <section className="bg-white rounded-xl border border-slate-200 p-5">
          <h2 className="text-lg font-bold mb-3">Tracking events (CAPI)</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-xs text-slate-500 uppercase tracking-wider">
                <tr>
                  <th className="text-left px-2 py-1.5 font-semibold">Platform</th>
                  <th className="text-left px-2 py-1.5 font-semibold">Event</th>
                  <th className="text-left px-2 py-1.5 font-semibold">Status</th>
                  <th className="text-left px-2 py-1.5 font-semibold">HTTP</th>
                  <th className="text-left px-2 py-1.5 font-semibold">At</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {order.trackingEvents.map((te) => (
                  <tr key={te.id}>
                    <td className="px-2 py-2 font-medium capitalize">
                      {te.platform}
                    </td>
                    <td className="px-2 py-2 font-mono text-xs">
                      {te.eventName}
                    </td>
                    <td className="px-2 py-2">
                      <span
                        className={`px-2 py-0.5 rounded text-xs font-semibold ${
                          te.status === "success"
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {te.status}
                      </span>
                    </td>
                    <td className="px-2 py-2 text-xs">{te.responseCode ?? "—"}</td>
                    <td className="px-2 py-2 text-xs text-slate-500">
                      {fmtDate(te.createdAt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}
    </div>
  );
}

function Field({
  label,
  value,
  dir,
  mono,
  multiline,
  small,
}: {
  label: string;
  value: string;
  dir?: "auto" | "ltr" | "rtl";
  mono?: boolean;
  multiline?: boolean;
  small?: boolean;
}) {
  return (
    <div>
      <dt className="text-xs text-slate-500 uppercase tracking-wide font-semibold">
        {label}
      </dt>
      <dd
        dir={dir}
        className={`mt-0.5 ${mono ? "font-mono" : ""} ${
          small ? "text-xs break-all" : ""
        } ${multiline ? "whitespace-pre-line" : ""}`}
      >
        {value}
      </dd>
    </div>
  );
}

function Row({
  label,
  value,
  bold,
}: {
  label: string;
  value: string;
  bold?: boolean;
}) {
  return (
    <div className="flex items-center justify-between">
      <dt className={`text-slate-500 ${bold ? "font-bold text-slate-900" : ""}`}>
        {label}
      </dt>
      <dd
        className={`tabular-nums ${
          bold ? "font-bold text-lg" : "font-medium"
        }`}
      >
        {value}
      </dd>
    </div>
  );
}
