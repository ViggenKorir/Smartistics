import React from 'react';

type RevenuePoint = { month: string; revenue: number };
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

export default function RevenueProjection({ data }: { data: RevenuePoint[] }) {
  return (
    <div className="p-4 rounded-lg bg-white dark:bg-slate-800 shadow-sm">
      <div className="flex items-center justify-between mb-2">
        <div className="font-semibold">Revenue Projection</div>
        <div className="text-xs text-slate-500">Next 4 months</div>
      </div>
      <div className="h-40">
        <ResponsiveContainer>
          <LineChart data={data}>
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Line dataKey="revenue" stroke="#7c3aed" strokeWidth={3} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
