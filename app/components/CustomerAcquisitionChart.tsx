import React from 'react';

type FunnelStage = { stage: string; value: number };
import { AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from 'recharts';

export default function CustomerAcquisitionChart({ data }: { data: FunnelStage[] }) {
  return (
    <div className="p-4 rounded-lg bg-white dark:bg-slate-800 shadow-sm">
      <div className="font-semibold mb-2">Customer acquisition funnel</div>
      <div className="h-44">
        <ResponsiveContainer>
          <AreaChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.06} />
            <XAxis dataKey="stage" />
            <YAxis />
            <Tooltip />
            <Area type="monotone" dataKey="value" stroke="#10b981" fill="#bbf7d0" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}