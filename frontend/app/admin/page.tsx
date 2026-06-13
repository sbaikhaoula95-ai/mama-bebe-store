"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import {
  adminApi,
  ORDER_STATUS_LABELS,
  type MetricsResponse,
  type OrderStatus,
} from "@/lib/admin-api";
import { DateRangePicker, defaultRange, type DateRange } from "@/components/admin/DateRangePicker";
import { MetricCard } from "@/components/admin/MetricCard";
import { TimeseriesChart } from "@/components/admin/TimeseriesChart";

const ALL_ORDER_STATUSES = Object.keys(ORDER_STATUS_LABELS) as OrderStatus[];

function fmtMoney(value: number | string, currency = "MAD"): string {
  const n = typeof value === "string" ? Number(value) : value;
  if (!isFinite(n)) return "—";
  return `${n.toLocaleString("en-US", { maximumFractionDigits: 2 })} ${currency}`;
}

function fmtPct(value: number): string {
  if (!isFinite(value)) return "0%";
  return `${value.toFixed(1)}%`;
}

const REASON_LABELS: Record<string, string> = {
  country_not_morocco: "Not Morocco",
  vpn: "VPN",
  proxy: "Proxy",
  tor: "Tor",
  hosting_datacenter: "Datacenter/Hosting",
  anonymous: "Anonymous",
  risk_score_too_high: "High risk score",
  maxmind_disabled: "MaxMind disabled",
  maxmind_lookup_failed: "MaxMind lookup failed",
  non_public_ip: "Private/local IP",
  missing_ip: "Missing IP",
  unknown: "Unknown",
};

export default function AdminDashboardPage() {
  const [range, setRange] = useState<DateRange>(() => defaultRange(7));
  const [data, setData] = useState<MetricsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await adminApi.metrics(range.from, range.to);
      setData(res);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load metrics");
    } finally {
      setLoading(false);
    }
  }, [range.from, range.to]);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <div className="space-y-6">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900">
            Dashboard
          </h1>
          <p className="text-slate-500 text-sm">
            Real-time view of Hnina · valid Moroccan, non-VPN traffic only.
          </p>
        </div>
        <DateRangePicker value={range} onChange={setRange} />
      </header>

      {error && (
        <div className="px-4 py-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
          {error}
        </div>
      )}

      {/* Top metric cards */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
        <MetricCard
          label="Valid clicks"
          value={loading || !data ? "…" : data.overview.visitsValid.toLocaleString()}
          hint={
            data ? (
              <>
                <span className="text-slate-400 line-through">
                  {data.overview.visitsTotal} raw
                </span>{" "}
                · {data.overview.visitsBlocked} blocked
              </>
            ) : undefined
          }
          icon="👁️"
          tone="info"
        />
        <MetricCard
          label="Orders"
          value={loading || !data ? "…" : data.overview.ordersTotal}
          hint={
            data
              ? `${data.overview.uniqueSessions} unique sessions`
              : undefined
          }
          icon="📦"
        />
        <MetricCard
          label="Conversion"
          value={loading || !data ? "…" : fmtPct(data.overview.conversionRate)}
          hint={
            data
              ? `orders / valid visits`
              : undefined
          }
          icon="📈"
          tone="success"
        />
        <MetricCard
          label="Revenue"
          value={loading || !data ? "…" : fmtMoney(data.overview.revenueTotal)}
          hint={
            data
              ? `AOV ${fmtMoney(data.overview.aov)}`
              : undefined
          }
          icon="💰"
          tone="info"
        />
        <MetricCard
          label="Confirmed orders"
          value={loading || !data ? "…" : data.overview.ordersConfirmed}
          hint={
            data
              ? `${fmtPct(data.overview.confirmationRate)} confirmation rate`
              : undefined
          }
          icon="📞"
        />
        <MetricCard
          label="Delivered"
          value={loading || !data ? "…" : data.overview.ordersDelivered}
          hint={
            data
              ? `${fmtPct(data.overview.deliveryRate)} delivery rate · ${data.overview.ordersReturned} RTO`
              : undefined
          }
          icon="🚚"
          tone="success"
        />
        <MetricCard
          label="Cancelled"
          value={loading || !data ? "…" : data.overview.ordersCancelled}
          icon="✖️"
          tone={data && data.overview.ordersCancelled > 0 ? "danger" : "default"}
        />
        <MetricCard
          label="Upsell take rate"
          value={loading || !data ? "…" : fmtPct(data.overview.upsellTakeRate)}
          hint="post-form 99 MAD upsell"
          icon="✨"
          tone="info"
        />
      </section>

      {/* Timeseries */}
      <section className="bg-white rounded-2xl border border-slate-200 p-5">
        <header className="flex items-end justify-between mb-2">
          <div>
            <h2 className="text-lg font-bold">Daily activity</h2>
            <p className="text-xs text-slate-500">
              Valid Moroccan clicks + orders per day
            </p>
          </div>
        </header>
        {loading || !data ? (
          <div className="text-slate-400 text-sm">Loading…</div>
        ) : (
          <TimeseriesChart data={data.timeseries} />
        )}
      </section>

      {/* Two-column lists */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Top products */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5">
          <h2 className="text-lg font-bold mb-3">Top products</h2>
          {loading || !data ? (
            <div className="text-slate-400 text-sm">Loading…</div>
          ) : data.topProducts.length === 0 ? (
            <div className="text-slate-400 italic text-sm">No orders yet.</div>
          ) : (
            <div className="divide-y divide-slate-100">
              {data.topProducts.map((p) => (
                <div
                  key={p.productId}
                  className="py-2.5 flex items-center justify-between gap-3"
                >
                  <div className="min-w-0">
                    <div className="font-medium truncate text-sm">
                      {p.nameAr.split(" — ")[0]}
                    </div>
                    <div className="text-xs text-slate-500">{p.productId}</div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <div className="font-bold tabular-nums">{p.unitsSold}</div>
                    <div className="text-xs text-slate-500">{fmtMoney(p.revenue)}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Top cities */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5">
          <h2 className="text-lg font-bold mb-3">Top cities</h2>
          {loading || !data ? (
            <div className="text-slate-400 text-sm">Loading…</div>
          ) : data.topCities.length === 0 ? (
            <div className="text-slate-400 italic text-sm">No orders yet.</div>
          ) : (
            <div className="divide-y divide-slate-100">
              {data.topCities.map((c) => (
                <div
                  key={c.city}
                  className="py-2.5 flex items-center justify-between gap-3"
                >
                  <div className="font-medium text-sm truncate">{c.city}</div>
                  <div className="text-right flex-shrink-0">
                    <div className="font-bold tabular-nums">{c.orders}</div>
                    <div className="text-xs text-slate-500">{fmtMoney(c.revenue)}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* UTM sources */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5">
          <h2 className="text-lg font-bold mb-3">Traffic sources (UTM)</h2>
          {loading || !data ? (
            <div className="text-slate-400 text-sm">Loading…</div>
          ) : data.utmSources.length === 0 ? (
            <div className="text-slate-400 italic text-sm">No valid traffic.</div>
          ) : (
            <div className="overflow-x-auto -mx-2">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-xs text-slate-500 uppercase tracking-wider">
                    <th className="text-left px-2 py-1.5">Source</th>
                    <th className="text-right px-2 py-1.5">Visits</th>
                    <th className="text-right px-2 py-1.5">Orders</th>
                    <th className="text-right px-2 py-1.5">CR</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {data.utmSources.map((u) => (
                    <tr key={u.source}>
                      <td className="px-2 py-2 font-medium">{u.source}</td>
                      <td className="px-2 py-2 text-right tabular-nums">{u.visits}</td>
                      <td className="px-2 py-2 text-right tabular-nums">{u.orders}</td>
                      <td className="px-2 py-2 text-right tabular-nums font-bold">
                        {fmtPct(u.conversionRate)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Blocked reasons */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5">
          <h2 className="text-lg font-bold mb-1">Blocked traffic</h2>
          <p className="text-xs text-slate-500 mb-3">
            Visits filtered out (not Morocco, VPN, proxy, datacenter…). These are
            NOT counted in conversion.
          </p>
          {loading || !data ? (
            <div className="text-slate-400 text-sm">Loading…</div>
          ) : data.blockedReasons.length === 0 ? (
            <div className="text-emerald-600 text-sm">
              ✓ No traffic was blocked in this range.
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {data.blockedReasons.map((r) => (
                <div
                  key={r.reason}
                  className="py-2 flex items-center justify-between"
                >
                  <span className="text-sm text-slate-700">
                    {REASON_LABELS[r.reason] || r.reason}
                  </span>
                  <span className="font-bold tabular-nums">{r.count}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Status breakdown */}
      <section className="bg-white rounded-2xl border border-slate-200 p-5">
        <header className="flex items-end justify-between mb-3">
          <div>
            <h2 className="text-lg font-bold">Orders by status</h2>
            <p className="text-xs text-slate-500">
              Drill into the orders tab to update them.
            </p>
          </div>
          <Link
            href="/admin/orders"
            className="text-sm text-pharmacy font-bold hover:underline"
          >
            View all orders →
          </Link>
        </header>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
          {ALL_ORDER_STATUSES.map((s) => (
            <Link
              key={s}
              href={`/admin/orders?status=${s}&from=${range.from}&to=${range.to}`}
              className="rounded-xl border border-slate-200 p-3 hover:border-pharmacy/30 hover:bg-pharmacy/[0.02] transition-colors"
            >
              <div className="text-xs text-slate-500 uppercase tracking-wide">
                {ORDER_STATUS_LABELS[s]}
              </div>
              <div className="text-2xl font-bold tabular-nums">
                {data?.statusBreakdown?.[s] ?? 0}
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
