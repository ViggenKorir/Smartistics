"use client";
import React from 'react';

type ROIPoint = { date: string; roi: number };
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { motion } from 'framer-motion';

export default function ROIChart({ data }: { data: ROIPoint[] }) {
  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="p-4 rounded-lg bg-white dark:bg-slate-800 shadow-sm">
      <div className="flex items-center justify-between mb-2">
        <div className="font-semibold">ROI Trend</div>
        <div className="text-xs text-slate-500">Monthly</div>
      </div>
      <div className="h-48">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.06} />
            <XAxis dataKey="date" tick={{ fontSize: 12 }} />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="roi" stroke="#06b6d4" strokeWidth={3} dot={{ r: 3 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}

