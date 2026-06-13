"use client";

import { useEffect, useState } from "react";

export type DateRange = { from: string; to: string };

const PRESETS: Array<{ id: string; label: string; days: number }> = [
  { id: "today", label: "Today", days: 0 },
  { id: "7d", label: "Last 7 days", days: 7 },
  { id: "30d", label: "Last 30 days", days: 30 },
  { id: "90d", label: "Last 90 days", days: 90 },
];

function todayISO(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
    d.getDate(),
  ).padStart(2, "0")}`;
}

function offsetISO(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() - days);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
    d.getDate(),
  ).padStart(2, "0")}`;
}

export function DateRangePicker({
  value,
  onChange,
}: {
  value: DateRange;
  onChange: (next: DateRange) => void;
}) {
  const [from, setFrom] = useState(value.from);
  const [to, setTo] = useState(value.to);

  useEffect(() => {
    setFrom(value.from);
    setTo(value.to);
  }, [value.from, value.to]);

  const applyPreset = (days: number) => {
    const next = { from: offsetISO(days), to: todayISO() };
    setFrom(next.from);
    setTo(next.to);
    onChange(next);
  };

  const apply = () => onChange({ from, to });

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-3 flex flex-col md:flex-row md:items-center gap-3">
      <div className="flex flex-wrap gap-1.5">
        {PRESETS.map((p) => (
          <button
            key={p.id}
            type="button"
            onClick={() => applyPreset(p.days)}
            className="px-3 py-1.5 text-xs font-semibold bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
          >
            {p.label}
          </button>
        ))}
      </div>
      <div className="flex items-center gap-2 md:ml-auto">
        <input
          type="date"
          value={from}
          onChange={(e) => setFrom(e.target.value)}
          className="border border-slate-300 rounded-lg px-2.5 py-1.5 text-sm focus:outline-none focus:border-pharmacy"
        />
        <span className="text-slate-400">→</span>
        <input
          type="date"
          value={to}
          onChange={(e) => setTo(e.target.value)}
          className="border border-slate-300 rounded-lg px-2.5 py-1.5 text-sm focus:outline-none focus:border-pharmacy"
        />
        <button
          type="button"
          onClick={apply}
          className="bg-pharmacy text-cream px-3 py-1.5 rounded-lg text-sm font-bold hover:opacity-90"
        >
          Apply
        </button>
      </div>
    </div>
  );
}

export function defaultRange(days = 7): DateRange {
  return { from: offsetISO(days), to: todayISO() };
}
