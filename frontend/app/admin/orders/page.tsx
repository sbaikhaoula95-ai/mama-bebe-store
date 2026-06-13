"use client";

import { Suspense, useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import {
  adminApi,
  ORDER_STATUS_LABELS,
  ORDER_STATUSES,
  type OrderListResponse,
} from "@/lib/admin-api";
import {
  DateRangePicker,
  defaultRange,
  type DateRange,
} from "@/components/admin/DateRangePicker";
import { OrderStatusBadge } from "@/components/admin/OrderStatusBadge";

function fmtMoney(value: number | string, currency = "MAD"): string {
  const n = typeof value === "string" ? Number(value) : value;
  if (!isFinite(n)) return "—";
  return `${n.toLocaleString("en-US", { maximumFractionDigits: 2 })} ${currency}`;
}

function fmtDate(value: string): string {
  try {
    const d = new Date(value);
    return d.toLocaleString("en-GB", {
      day: "2-digit",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return value;
  }
}

function OrdersTable() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [range, setRange] = useState<DateRange>(() => ({
    from: searchParams?.get("from") || defaultRange(30).from,
    to: searchParams?.get("to") || defaultRange(30).to,
  }));
  const [status, setStatus] = useState<string>(
    searchParams?.get("status") || "all",
  );
  const [query, setQuery] = useState(searchParams?.get("q") || "");
  const [queryInput, setQueryInput] = useState(searchParams?.get("q") || "");
  const [page, setPage] = useState(Number(searchParams?.get("page") || 1));
  const pageSize = 25;

  const [data, setData] = useState<OrderListResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await adminApi.orders({
        from: range.from,
        to: range.to,
        status,
        q: query,
        page,
        pageSize,
      });
      setData(res);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load orders");
    } finally {
      setLoading(false);
    }
  }, [range.from, range.to, status, query, page]);

  useEffect(() => {
    load();
  }, [load]);

  // Reset to page 1 when filters change.
  useEffect(() => {
    setPage(1);
  }, [range.from, range.to, status, query]);

  // Keep URL in sync so links from the dashboard preserve filters.
  useEffect(() => {
    const params = new URLSearchParams();
    params.set("from", range.from);
    params.set("to", range.to);
    if (status !== "all") params.set("status", status);
    if (query) params.set("q", query);
    if (page > 1) params.set("page", String(page));
    router.replace(`/admin/orders?${params.toString()}`, { scroll: false });
  }, [router, range.from, range.to, status, query, page]);

  return (
    <div className="space-y-4">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900">Orders</h1>
          <p className="text-slate-500 text-sm">
            All COD orders. Click a row to preview, callback, and update status.
          </p>
        </div>
        <DateRangePicker value={range} onChange={setRange} />
      </header>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-slate-200 p-3 flex flex-col md:flex-row gap-3 md:items-center">
        <div className="flex flex-wrap gap-1.5">
          <button
            type="button"
            onClick={() => setStatus("all")}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg ${
              status === "all"
                ? "bg-pharmacy text-cream"
                : "bg-slate-100 text-slate-700 hover:bg-slate-200"
            }`}
          >
            All
          </button>
          {ORDER_STATUSES.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setStatus(s)}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg ${
                status === s
                  ? "bg-pharmacy text-cream"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
            >
              {ORDER_STATUS_LABELS[s]}
            </button>
          ))}
        </div>

        <form
          className="md:ml-auto flex items-center gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            setQuery(queryInput);
          }}
        >
          <input
            type="text"
            value={queryInput}
            onChange={(e) => setQueryInput(e.target.value)}
            placeholder="Search name, phone, city, order #"
            className="border border-slate-300 rounded-lg px-3 py-1.5 text-sm w-64 focus:outline-none focus:border-pharmacy"
          />
          <button
            type="submit"
            className="bg-pharmacy text-cream px-3 py-1.5 rounded-lg text-sm font-bold"
          >
            Search
          </button>
        </form>
      </div>

      {error && (
        <div className="px-4 py-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
          {error}
        </div>
      )}

      {/* Table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr className="text-xs text-slate-500 uppercase tracking-wider">
                <th className="text-left px-3 py-2.5 font-semibold">Order #</th>
                <th className="text-left px-3 py-2.5 font-semibold">Status</th>
                <th className="text-left px-3 py-2.5 font-semibold">Customer</th>
                <th className="text-left px-3 py-2.5 font-semibold">Phone</th>
                <th className="text-left px-3 py-2.5 font-semibold">City</th>
                <th className="text-right px-3 py-2.5 font-semibold">Items</th>
                <th className="text-right px-3 py-2.5 font-semibold">Total</th>
                <th className="text-left px-3 py-2.5 font-semibold">Source</th>
                <th className="text-left px-3 py-2.5 font-semibold">Created</th>
                <th className="px-3 py-2.5 font-semibold"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading && (
                <tr>
                  <td colSpan={10} className="px-3 py-8 text-center text-slate-400">
                    Loading…
                  </td>
                </tr>
              )}
              {!loading && data && data.items.length === 0 && (
                <tr>
                  <td colSpan={10} className="px-3 py-12 text-center text-slate-400 italic">
                    No orders match the filters.
                  </td>
                </tr>
              )}
              {!loading &&
                data?.items.map((o) => (
                  <tr
                    key={o.id}
                    className="hover:bg-slate-50 cursor-pointer transition-colors"
                    onClick={() => router.push(`/admin/orders/${o.id}`)}
                  >
                    <td className="px-3 py-3 font-mono text-xs">
                      {o.orderNumber}
                    </td>
                    <td className="px-3 py-3">
                      <OrderStatusBadge status={o.status} />
                    </td>
                    <td className="px-3 py-3 font-medium" dir="auto">
                      {o.customerName}
                    </td>
                    <td className="px-3 py-3 font-mono text-xs">
                      <a
                        href={`tel:${o.phone}`}
                        onClick={(e) => e.stopPropagation()}
                        className="hover:text-pharmacy"
                      >
                        {o.phone}
                      </a>
                    </td>
                    <td className="px-3 py-3" dir="auto">
                      {o.city}
                    </td>
                    <td className="px-3 py-3 text-right tabular-nums">
                      {o.itemsCount}
                      {o.upsellAccepted && (
                        <span
                          className="ml-1 text-amber-500"
                          title="Upsell accepted"
                        >
                          ✨
                        </span>
                      )}
                    </td>
                    <td className="px-3 py-3 text-right tabular-nums font-bold">
                      {fmtMoney(o.total, o.currency)}
                    </td>
                    <td className="px-3 py-3 text-xs text-slate-500">
                      {o.utmSource || "—"}
                    </td>
                    <td className="px-3 py-3 text-xs text-slate-500">
                      {fmtDate(o.createdAt)}
                    </td>
                    <td className="px-3 py-3 text-right">
                      <Link
                        href={`/admin/orders/${o.id}`}
                        className="text-pharmacy text-xs font-bold hover:underline"
                        onClick={(e) => e.stopPropagation()}
                      >
                        View →
                      </Link>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {data && data.pages > 1 && (
          <div className="border-t border-slate-200 px-4 py-3 flex items-center justify-between">
            <p className="text-sm text-slate-500">
              Page {data.page} of {data.pages} · {data.total} orders
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-3 py-1.5 text-sm border border-slate-200 rounded-lg disabled:opacity-50 hover:bg-slate-100"
              >
                ← Prev
              </button>
              <button
                onClick={() => setPage((p) => Math.min(data.pages, p + 1))}
                disabled={page >= data.pages}
                className="px-3 py-1.5 text-sm border border-slate-200 rounded-lg disabled:opacity-50 hover:bg-slate-100"
              >
                Next →
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function AdminOrdersPage() {
  return (
    <Suspense fallback={<div className="text-slate-400">Loading…</div>}>
      <OrdersTable />
    </Suspense>
  );
}
