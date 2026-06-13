"use client";

import { useMemo } from "react";
import type { TimeseriesPoint } from "@/lib/admin-api";

type Series = {
  key: keyof Pick<TimeseriesPoint, "visits" | "orders" | "revenue">;
  label: string;
  color: string;
  axis: "left" | "right";
};

const SERIES: Series[] = [
  { key: "visits", label: "Valid visits", color: "#7C9A82", axis: "left" },
  { key: "orders", label: "Orders", color: "#1F4F3A", axis: "right" },
];

export function TimeseriesChart({ data }: { data: TimeseriesPoint[] }) {
  const padding = { top: 20, right: 50, bottom: 30, left: 40 };
  const width = 900;
  const height = 280;
  const innerWidth = width - padding.left - padding.right;
  const innerHeight = height - padding.top - padding.bottom;

  const { points, maxLeft, maxRight } = useMemo(() => {
    if (!data.length) return { points: [], maxLeft: 0, maxRight: 0 };
    const maxLeft = Math.max(1, ...data.map((d) => d.visits));
    const maxRight = Math.max(1, ...data.map((d) => d.orders));
    const step = data.length > 1 ? innerWidth / (data.length - 1) : 0;
    const points = data.map((d, i) => ({
      x: padding.left + i * step,
      yLeft: padding.top + innerHeight - (d.visits / maxLeft) * innerHeight,
      yRight: padding.top + innerHeight - (d.orders / maxRight) * innerHeight,
      day: d.day,
      visits: d.visits,
      orders: d.orders,
      revenue: Number(d.revenue),
    }));
    return { points, maxLeft, maxRight };
  }, [data, innerHeight, innerWidth, padding.left, padding.top]);

  if (!points.length) {
    return (
      <div className="text-sm text-slate-400 italic">
        No data in the selected range.
      </div>
    );
  }

  const visitsPath = points
    .map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.yLeft}`)
    .join(" ");
  const ordersPath = points
    .map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.yRight}`)
    .join(" ");

  const ticks = [0, 0.25, 0.5, 0.75, 1];

  return (
    <div className="w-full overflow-x-auto">
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="w-full min-w-[600px]"
        preserveAspectRatio="none"
      >
        {/* Grid + left axis labels */}
        {ticks.map((t) => {
          const y = padding.top + innerHeight - t * innerHeight;
          return (
            <g key={t}>
              <line
                x1={padding.left}
                x2={width - padding.right}
                y1={y}
                y2={y}
                stroke="#e2e8f0"
                strokeDasharray="2,2"
              />
              <text
                x={padding.left - 8}
                y={y}
                textAnchor="end"
                dominantBaseline="middle"
                fontSize="10"
                fill="#7C9A82"
              >
                {Math.round(maxLeft * t)}
              </text>
              <text
                x={width - padding.right + 8}
                y={y}
                textAnchor="start"
                dominantBaseline="middle"
                fontSize="10"
                fill="#1F4F3A"
              >
                {Math.round(maxRight * t)}
              </text>
            </g>
          );
        })}

        {/* X-axis labels */}
        {points.map((p, i) => {
          const showLabel =
            points.length <= 14 ||
            i === 0 ||
            i === points.length - 1 ||
            i % Math.ceil(points.length / 7) === 0;
          if (!showLabel) return null;
          return (
            <text
              key={p.day}
              x={p.x}
              y={height - 8}
              textAnchor="middle"
              fontSize="10"
              fill="#94a3b8"
            >
              {p.day.slice(5)}
            </text>
          );
        })}

        {/* Visits area */}
        <path
          d={`${visitsPath} L ${points[points.length - 1].x} ${
            padding.top + innerHeight
          } L ${points[0].x} ${padding.top + innerHeight} Z`}
          fill="#7C9A82"
          fillOpacity={0.12}
        />
        <path
          d={visitsPath}
          fill="none"
          stroke="#7C9A82"
          strokeWidth={2}
        />

        {/* Orders line */}
        <path
          d={ordersPath}
          fill="none"
          stroke="#1F4F3A"
          strokeWidth={2.5}
        />
        {points.map((p) => (
          <circle key={p.day} cx={p.x} cy={p.yRight} r={3} fill="#1F4F3A">
            <title>
              {p.day} · {p.visits} visits · {p.orders} orders · {p.revenue} MAD
            </title>
          </circle>
        ))}
      </svg>

      <div className="flex items-center gap-5 mt-3 text-xs">
        {SERIES.map((s) => (
          <div key={s.key} className="flex items-center gap-2">
            <span
              className="inline-block w-3 h-3 rounded-sm"
              style={{ background: s.color }}
            />
            <span className="text-slate-600 font-medium">{s.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
