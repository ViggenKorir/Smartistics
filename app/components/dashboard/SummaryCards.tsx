"use client";

import React from "react";

export interface MetricData {
  label: string;
  value: string | number;
  change?: number;
  changeType?: "increase" | "decrease" | "neutral";
  icon?: React.ReactNode;
  color?: string;
  subtitle?: string;
  loading?: boolean;
}

interface SummaryCardsProps {
  metrics: string[] | MetricData[];
  layout?: "grid" | "flex";
  columns?: 1 | 2 | 3 | 4;
  showIcons?: boolean;
  showChange?: boolean;
  onCardClick?: (metric: string | MetricData) => void;
}

const SummaryCards: React.FC<SummaryCardsProps> = ({
  metrics,
  layout = "grid",
  columns = 4,
  showIcons = true,
  showChange = true,
  onCardClick,
}) => {
  // Default metric configurations for common business metrics
  const getDefaultMetricConfig = (metricName: string): MetricData => {
    const configs: Record<string, Partial<MetricData>> = {
      "Net Income": {
        icon: (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
          </svg>
        ),
        color: "from-green-400 to-green-600",
        value: "$124,563",
        change: 12.5,
        changeType: "increase" as const,
        subtitle: "This month"
      },
      "ROI": {
        icon: (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
          </svg>
        ),
        color: "from-blue-400 to-blue-600",
        value: "324%",
        change: 18.2,
        changeType: "increase" as const,
        subtitle: "Return on Investment"
      },
      "Campaigns": {
        icon: (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        ),
        color: "from-purple-400 to-purple-600",
        value: "47",
        change: 5.7,
        changeType: "increase" as const,
        subtitle: "Active campaigns"
      },
      "Customers": {
        icon: (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
        ),
        color: "from-orange-400 to-orange-600",
        value: "2,847",
        change: -2.3,
        changeType: "decrease" as const,
        subtitle: "Total customers"
      }
    };

    return {
      label: metricName,
      value: "0",
      change: 0,
      changeType: "neutral",
      color: "from-gray-400 to-gray-600",
      ...configs[metricName]
    } as MetricData;
  };

  // Process metrics - convert strings to MetricData objects
  const processedMetrics: MetricData[] = metrics.map((metric) => {
    if (typeof metric === "string") {
      return getDefaultMetricConfig(metric);
    }
    return metric;
  });

  // Loading skeleton
  const LoadingSkeleton = () => (
    <div className="animate-pulse">
      <div className="bg-gray-200 rounded-lg h-32"></div>
    </div>
  );

  // Individual metric card
  const MetricCard: React.FC<{ metric: MetricData; index: number }> = ({ metric, index }) => {
    if (metric.loading) {
      return <LoadingSkeleton />;
    }

    return (
      <div
        className={`bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200 ${
          onCardClick ? "cursor-pointer hover:scale-105" : ""
        }`}
        onClick={() => onCardClick && onCardClick(metric)}
      >
        <div className="flex items-center justify-between mb-4">
          {/* Icon */}
          {showIcons && metric.icon && (
            <div className={`w-12 h-12 bg-gradient-to-r ${metric.color} rounded-lg flex items-center justify-center text-white`}>
              {metric.icon}
            </div>
          )}

          {/* Change indicator */}
          {showChange && metric.change !== undefined && (
            <span
              className={`text-sm font-semibold px-2 py-1 rounded-full ${
                metric.changeType === "increase"
                  ? "text-green-700 bg-green-100"
                  : metric.changeType === "decrease"
                  ? "text-red-700 bg-red-100"
                  : "text-gray-700 bg-gray-100"
              }`}
            >
              {metric.changeType === "increase" && "+"}
              {metric.change}%
            </span>
          )}
        </div>

        {/* Value and label */}
        <div>
          <p className="text-2xl font-bold text-gray-900 mb-1">
            {typeof metric.value === "number" ? metric.value.toLocaleString() : metric.value}
          </p>
          <p className="text-gray-600 text-sm font-medium">{metric.label}</p>
          {metric.subtitle && (
            <p className="text-gray-500 text-xs mt-1">{metric.subtitle}</p>
          )}
        </div>
      </div>
    );
  };

  // Grid layout classes
  const getGridClasses = () => {
    const baseClass = "grid gap-6";
    const columnClasses = {
      1: "grid-cols-1",
      2: "grid-cols-1 md:grid-cols-2",
      3: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
      4: "grid-cols-1 md:grid-cols-2 lg:grid-cols-4"
    };
    return `${baseClass} ${columnClasses[columns]}`;
  };

  // Flex layout classes
  const getFlexClasses = () => {
    return "flex flex-wrap gap-6";
  };

  return (
    <div className={layout === "grid" ? getGridClasses() : getFlexClasses()}>
      {processedMetrics.map((metric, index) => (
        <div key={`${metric.label}-${index}`} className={layout === "flex" ? "flex-1 min-w-64" : ""}>
          <MetricCard metric={metric} index={index} />
        </div>
      ))}
    </div>
  );
};

export default SummaryCards;
