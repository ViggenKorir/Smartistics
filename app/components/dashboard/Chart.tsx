"use client";

import React, { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ScatterChart,
  Scatter,
  ComposedChart,
} from "recharts";

export type ChartType =
  | "line"
  | "bar"
  | "pie"
  | "area"
  | "scatter"
  | "composed";

export type ChartLibrary = "Recharts";

interface ChartData {
  [key: string]: any;
}

interface ChartProps {
  library?: ChartLibrary;
  chartType: ChartType;
  dataSource?: string | ChartData[];
  width?: number;
  height?: number;
  colors?: string[];
  title?: string;
  subtitle?: string;
  showLegend?: boolean;
  showTooltip?: boolean;
  showGrid?: boolean;
  xAxisKey?: string;
  yAxisKeys?: string[];
  loading?: boolean;
  error?: string;
  onDataLoad?: (data: ChartData[]) => void;
  customTooltip?: React.ComponentType<any>;
  responsive?: boolean;
}

const Chart: React.FC<ChartProps> = ({
  library = "Recharts",
  chartType,
  dataSource = [],
  width,
  height = 400,
  colors = ['#3B82F6', '#10B981', '#F59E0B', '#8B5CF6', '#EF4444', '#06B6D4'],
  title,
  subtitle,
  showLegend = true,
  showTooltip = true,
  showGrid = true,
  xAxisKey = "name",
  yAxisKeys = ["value"],
  loading: externalLoading,
  error: externalError,
  onDataLoad,
  customTooltip,
  responsive = true,
}) => {
  const [data, setData] = useState<ChartData[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Default data now pulled from mock API in db.json when dataSource is a string
  const getDefaultData = (type: ChartType): ChartData[] => [];

  // Fetch data from API or use provided data
  useEffect(() => {
    const loadData = async () => {
      if (typeof dataSource === "string") {
        try {
          setLoading(true);
          setError(null);

          // Expect dataSource to be a key matching a charts entry id
          const res = await fetch(`http://localhost:3001/charts?id=${encodeURIComponent(dataSource)}`);
          const json = await res.json();
          const series = Array.isArray(json) && json.length > 0 ? json[0].data : [];
          setData(series);
          if (onDataLoad) onDataLoad(series);
        } catch (err) {
          setError("Failed to load chart data");
          console.error("Chart data loading error:", err);
        } finally {
          setLoading(false);
        }
      } else if (Array.isArray(dataSource)) {
        setData(dataSource);
        if (onDataLoad) onDataLoad(dataSource);
      } else {
        // Try to load by chart type id from db.json as a fallback
        try {
          setLoading(true);
          const res = await fetch(`http://localhost:3001/charts?id=${encodeURIComponent(chartType)}`);
          const json = await res.json();
          const series = Array.isArray(json) && json.length > 0 ? json[0].data : [];
          setData(series);
          if (onDataLoad) onDataLoad(series);
        } catch (e) {
          setData([]);
        } finally {
          setLoading(false);
        }
      }
    };

    loadData();
  }, [dataSource, chartType, onDataLoad]);

  // Custom tooltip component
  const DefaultTooltip = ({ active, payload, label }: any) => {
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
              <span className="text-gray-600 capitalize">{entry.dataKey}:</span>
              <span className="font-medium text-gray-900">
                {typeof entry.value === "number"
                  ? entry.value.toLocaleString()
                  : entry.value}
              </span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  // Loading skeleton
  const LoadingSkeleton = () => (
    <div className="animate-pulse bg-gray-200 rounded-lg" style={{ height }}>
      <div className="flex items-center justify-center h-full">
        <div className="text-gray-400 text-center">
          <div className="w-8 h-8 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin mx-auto mb-2"></div>
          <p className="text-sm">Loading chart...</p>
        </div>
      </div>
    </div>
  );

  // Error state
  const ErrorState = ({ message }: { message: string }) => (
    <div
      className="bg-red-50 border border-red-200 rounded-lg flex items-center justify-center"
      style={{ height }}
    >
      <div className="text-center text-red-600">
        <svg className="w-12 h-12 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <p className="font-medium">Chart Error</p>
        <p className="text-sm">{message}</p>
      </div>
    </div>
  );

  // Render appropriate chart type
  const renderChart = () => {
    const commonProps = {
      data,
      width: responsive ? undefined : width,
      height: responsive ? undefined : height,
    };

    const TooltipComponent = customTooltip || DefaultTooltip;

    switch (chartType) {
      case "line":
        return (
          <LineChart {...commonProps}>
            {showGrid && <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />}
            <XAxis dataKey={xAxisKey} stroke="#6B7280" fontSize={12} />
            <YAxis stroke="#6B7280" fontSize={12} />
            {showTooltip && <Tooltip content={<TooltipComponent />} />}
            {showLegend && <Legend />}
            {yAxisKeys.map((key, index) => (
              <Line
                key={key}
                type="monotone"
                dataKey={key}
                stroke={colors[index % colors.length]}
                strokeWidth={2}
                dot={{ fill: colors[index % colors.length], r: 4 }}
                activeDot={{ r: 6 }}
              />
            ))}
          </LineChart>
        );

      case "bar":
        return (
          <BarChart {...commonProps}>
            {showGrid && <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />}
            <XAxis dataKey={xAxisKey} stroke="#6B7280" fontSize={12} />
            <YAxis stroke="#6B7280" fontSize={12} />
            {showTooltip && <Tooltip content={<TooltipComponent />} />}
            {showLegend && <Legend />}
            {yAxisKeys.map((key, index) => (
              <Bar
                key={key}
                dataKey={key}
                fill={colors[index % colors.length]}
                radius={[4, 4, 0, 0]}
              />
            ))}
          </BarChart>
        );

      case "pie":
        return (
          <PieChart {...commonProps}>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={120}
              paddingAngle={5}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={entry.color || colors[index % colors.length]}
                />
              ))}
            </Pie>
            {showTooltip && <Tooltip content={<TooltipComponent />} />}
            {showLegend && <Legend />}
          </PieChart>
        );

      case "area":
        return (
          <AreaChart {...commonProps}>
            <defs>
              {yAxisKeys.map((key, index) => (
                <linearGradient key={key} id={`color${key}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={colors[index % colors.length]} stopOpacity={0.3} />
                  <stop offset="95%" stopColor={colors[index % colors.length]} stopOpacity={0} />
                </linearGradient>
              ))}
            </defs>
            {showGrid && <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />}
            <XAxis dataKey={xAxisKey} stroke="#6B7280" fontSize={12} />
            <YAxis stroke="#6B7280" fontSize={12} />
            {showTooltip && <Tooltip content={<TooltipComponent />} />}
            {showLegend && <Legend />}
            {yAxisKeys.map((key, index) => (
              <Area
                key={key}
                type="monotone"
                dataKey={key}
                stroke={colors[index % colors.length]}
                fillOpacity={1}
                fill={`url(#color${key})`}
                strokeWidth={2}
              />
            ))}
          </AreaChart>
        );

      case "scatter":
        return (
          <ScatterChart {...commonProps}>
            {showGrid && <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />}
            <XAxis dataKey="x" stroke="#6B7280" fontSize={12} />
            <YAxis dataKey="y" stroke="#6B7280" fontSize={12} />
            {showTooltip && <Tooltip content={<TooltipComponent />} />}
            {showLegend && <Legend />}
            <Scatter dataKey="z" fill={colors[0]} />
          </ScatterChart>
        );

      case "composed":
        return (
          <ComposedChart {...commonProps}>
            {showGrid && <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />}
            <XAxis dataKey={xAxisKey} stroke="#6B7280" fontSize={12} />
            <YAxis stroke="#6B7280" fontSize={12} />
            {showTooltip && <Tooltip content={<TooltipComponent />} />}
            {showLegend && <Legend />}
            <Bar dataKey="revenue" fill={colors[0]} radius={[4, 4, 0, 0]} />
            <Line type="monotone" dataKey="conversions" stroke={colors[1]} strokeWidth={2} />
            <Area
              type="monotone"
              dataKey="roi"
              fill={colors[2]}
              fillOpacity={0.3}
              stroke={colors[2]}
            />
          </ComposedChart>
        );

      default:
        return <div>Unsupported chart type: {chartType}</div>;
    }
  };

  // Show loading or error states
  if (externalLoading || loading) return <LoadingSkeleton />;
  if (externalError || error) return <ErrorState message={externalError || error || "Unknown error"} />;

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
      {/* Chart header */}
      {(title || subtitle) && (
        <div className="mb-6">
          {title && (
            <h3 className="text-lg font-semibold text-gray-900 mb-1">
              {title}
            </h3>
          )}
          {subtitle && (
            <p className="text-sm text-gray-600">{subtitle}</p>
          )}
        </div>
      )}

      {/* Chart container */}
      <div style={{ height: responsive ? height : undefined }}>
        {responsive ? (
          <ResponsiveContainer width="100%" height="100%">
            {renderChart()}
          </ResponsiveContainer>
        ) : (
          renderChart()
        )}
      </div>
    </div>
  );
};

export default Chart;
