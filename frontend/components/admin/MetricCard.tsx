"use client";

import { ReactNode } from "react";

export function MetricCard({
  label,
  value,
  hint,
  tone = "default",
  icon,
}: {
  label: string;
  value: string | number;
  hint?: ReactNode;
  tone?: "default" | "success" | "warning" | "danger" | "info";
  icon?: string;
}) {
  const toneStyles: Record<string, string> = {
    default: "border-slate-200",
    success: "border-emerald-200 bg-emerald-50/40",
    warning: "border-amber-200 bg-amber-50/40",
    danger: "border-red-200 bg-red-50/40",
    info: "border-pharmacy/20 bg-pharmacy/[0.03]",
  };

  return (
    <div
      className={`bg-white rounded-xl border ${toneStyles[tone]} p-4 flex flex-col gap-1.5`}
    >
      <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 uppercase tracking-wide">
        {icon && <span>{icon}</span>}
        <span>{label}</span>
      </div>
      <div className="text-2xl md:text-3xl font-bold text-slate-900 tabular-nums">
        {value}
      </div>
      {hint && <div className="text-xs text-slate-500">{hint}</div>}
    </div>
  );
}
