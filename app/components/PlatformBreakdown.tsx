"use client";
import React from 'react';

type PlatformDatum = { platform: string; spend: number; conversions: number };
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend, CartesianGrid } from 'recharts';

export default function PlatformBreakdown({ data }: { data: PlatformDatum[] }) {
  return (
    <div className="p-4 rounded-lg bg-white dark:bg-slate-800 shadow-sm">
      <div className="flex items-center justify-between mb-2">
        <div className="font-semibold">Platform breakdown</div>
        <div className="text-xs text-slate-500">Spend vs Conversions</div>
      </div>
      <div className="h-52">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} layout="vertical" margin={{ top: 5, right: 20, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.06} />
            <XAxis type="number" />
            <YAxis dataKey="platform" type="category" />
            <Tooltip />
            <Legend />
            <Bar dataKey="spend" name="Spend" fill="#2563eb" />
            <Bar dataKey="conversions" name="Conversions" fill="#f59e0b" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}