import React from 'react';

type KPIStatCardProps = { title: string; value: React.ReactNode; delta?: number; subtitle?: string };

export default function KPIStatCard({ title, value, delta, subtitle }: KPIStatCardProps) {
  return (
    <div className="p-4 rounded-lg bg-white dark:bg-slate-800 shadow-sm">
      <div className="text-sm text-slate-500">{title}</div>
      <div className="flex items-baseline gap-3">
        <div className="text-2xl font-bold">{value}</div>
        {delta !== undefined && <div className={`text-sm font-medium ${delta >= 0 ? 'text-green-600' : 'text-red-500'}`}>{delta >= 0 ? `+${delta}%` : `${delta}%`}</div>}
      </div>
      {subtitle && <div className="text-xs text-slate-400">{subtitle}</div>}
    </div>
  );
}