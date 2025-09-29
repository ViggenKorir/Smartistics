"use client";

import React from 'react';
import {
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell
} from 'recharts';
import { BarChartData } from '../../lib/types/dashboard';

interface BarChartProps {
  data: any[];
  width?: number;
  height?: number;
  responsive?: boolean;
  className?: string;
  colors?: string[];
  showLegend?: boolean;
  showGrid?: boolean;
  orientation?: 'vertical' | 'horizontal';
  dataKeys?: string[];
  xAxisKey?: string;
  title?: string;
}

const defaultColors = [
  '#3B82F6', // blue-500
  '#10B981', // emerald-500
  '#F59E0B', // amber-500
  '#EF4444', // red-500
  '#8B5CF6', // violet-500
  '#06B6D4', // cyan-500
  '#84CC16', // lime-500
  '#F97316', // orange-500
];

const BarChart: React.FC<BarChartProps> = ({
  data,
  width = 400,
  height = 300,
  responsive = true,
  className = '',
  colors = defaultColors,
  showLegend = true,
  showGrid = true,
  orientation = 'vertical',
  dataKeys,
  xAxisKey = 'name',
  title
}) => {
  // Extract data keys from first data item if not provided
  const extractedDataKeys = dataKeys ||
    (data.length > 0 ? Object.keys(data[0]).filter(key => key !== xAxisKey && typeof data[0][key] === 'number') : []);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-medium text-gray-900 mb-2">{label}</p>
          {payload.map((entry: any, index: number) => (
            <div key={index} className="flex items-center space-x-2 text-sm">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: entry.color }}
              />
              <span className="text-gray-600">{entry.dataKey}:</span>
              <span className="font-medium text-gray-900">
                {typeof entry.value === 'number'
                  ? entry.value.toLocaleString()
                  : entry.value
                }
              </span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  const ChartComponent = (
    <div className={`bg-white rounded-lg p-4 ${className}`}>
      {title && (
        <h3 className="text-lg font-semibold text-gray-900 mb-4 text-center">
          {title}
        </h3>
      )}

      <RechartsBarChart
        width={responsive ? undefined : width}
        height={responsive ? undefined : height}
        data={data}
        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        layout={orientation === 'horizontal' ? 'horizontal' : 'vertical'}
      >
        {showGrid && (
          <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
        )}

        {orientation === 'horizontal' ? (
          <>
            <XAxis type="number" stroke="#6B7280" fontSize={12} />
            <YAxis
              type="category"
              dataKey={xAxisKey}
              stroke="#6B7280"
              fontSize={12}
              width={80}
            />
          </>
        ) : (
          <>
            <XAxis
              dataKey={xAxisKey}
              stroke="#6B7280"
              fontSize={12}
              angle={data.length > 5 ? -45 : 0}
              textAnchor={data.length > 5 ? 'end' : 'middle'}
              height={data.length > 5 ? 60 : 30}
            />
            <YAxis stroke="#6B7280" fontSize={12} />
          </>
        )}

        <Tooltip content={<CustomTooltip />} />

        {showLegend && extractedDataKeys.length > 1 && (
          <Legend
            wrapperStyle={{ paddingTop: '20px' }}
            iconType="rect"
          />
        )}

        {extractedDataKeys.map((key, index) => (
          <Bar
            key={key}
            dataKey={key}
            fill={colors[index % colors.length]}
            radius={[2, 2, 0, 0]}
            name={key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1')}
          >
            {/* Add different colors for single series */}
            {extractedDataKeys.length === 1 && data.map((entry, idx) => (
              <Cell key={`cell-${idx}`} fill={colors[idx % colors.length]} />
            ))}
          </Bar>
        ))}
      </RechartsBarChart>
    </div>
  );

  if (responsive) {
    return (
      <ResponsiveContainer width="100%" height={height}>
        {ChartComponent}
      </ResponsiveContainer>
    );
  }

  return ChartComponent;
};

export default BarChart;
