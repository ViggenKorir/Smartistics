"use client";

import React, { useEffect, useRef } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  ChartOptions,
  ChartData,
} from "chart.js";
import { Line } from "react-chartjs-2";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
);

interface LineChartProps {
  data: ChartData<"line">;
  width?: number;
  height?: number;
  responsive?: boolean;
  className?: string;
  title?: string;
  showLegend?: boolean;
  showGrid?: boolean;
  smooth?: boolean;
  fill?: boolean;
  options?: Partial<ChartOptions<"line">>;
}

const defaultColors = [
  "#3B82F6", // blue-500
  "#10B981", // emerald-500
  "#F59E0B", // amber-500
  "#EF4444", // red-500
  "#8B5CF6", // violet-500
  "#06B6D4", // cyan-500
  "#84CC16", // lime-500
  "#F97316", // orange-500
];

const LineChart: React.FC<LineChartProps> = ({
  data,
  width = 400,
  height = 300,
  responsive = true,
  className = "",
  title,
  showLegend = true,
  showGrid = true,
  smooth = true,
  fill = false,
  options = {},
}) => {
  const chartRef = useRef<ChartJS<"line">>(null);

  // Enhanced data with default styling
  const enhancedData: ChartData<"line"> = {
    ...data,
    datasets: data.datasets.map((dataset: any, index: number) => ({
      ...dataset,
      borderColor:
        dataset.borderColor || defaultColors[index % defaultColors.length],
      backgroundColor:
        dataset.backgroundColor ||
        (fill
          ? `${defaultColors[index % defaultColors.length]}20`
          : defaultColors[index % defaultColors.length]),
      tension: smooth ? 0.4 : 0,
      fill: fill,
      pointRadius: 4,
      pointHoverRadius: 6,
      pointBackgroundColor:
        dataset.borderColor || defaultColors[index % defaultColors.length],
      pointBorderColor: "#fff",
      pointBorderWidth: 2,
      borderWidth: 2,
    })),
  };

  const defaultOptions: ChartOptions<"line"> = {
    responsive: responsive,
    maintainAspectRatio: !responsive,
    interaction: {
      intersect: false,
      mode: "index",
    },
    plugins: {
      title: {
        display: !!title,
        text: title,
        font: {
          size: 16,
          weight: "bold",
        },
        color: "#111827",
        padding: {
          bottom: 20,
        },
      },
      legend: {
        display: showLegend,
        position: "top",
        align: "end",
        labels: {
          usePointStyle: true,
          pointStyle: "circle",
          padding: 20,
          font: {
            size: 12,
          },
          color: "#6B7280",
        },
      },
      tooltip: {
        enabled: true,
        backgroundColor: "rgba(255, 255, 255, 0.95)",
        titleColor: "#111827",
        bodyColor: "#374151",
        borderColor: "#E5E7EB",
        borderWidth: 1,
        cornerRadius: 8,
        displayColors: true,
        padding: 12,
        titleFont: {
          weight: "bold",
        },
        callbacks: {
          title: (context: any) => {
            return context[0].label || "";
          },
          label: (context: any) => {
            const label = context.dataset.label || "";
            const value =
              typeof context.parsed.y === "number"
                ? context.parsed.y.toLocaleString()
                : context.parsed.y;
            return `${label}: ${value}`;
          },
        },
      },
    },
    scales: {
      x: {
        display: true,
        grid: {
          display: showGrid,
          color: "#F3F4F6",
        },
        ticks: {
          color: "#6B7280",
          font: {
            size: 11,
          },
          maxRotation: 45,
          minRotation: 0,
        },
      },
      y: {
        display: true,
        grid: {
          display: showGrid,
          color: "#F3F4F6",
        },
        ticks: {
          color: "#6B7280",
          font: {
            size: 11,
          },
          callback: function (value: any) {
            if (typeof value === "number") {
              return value.toLocaleString();
            }
            return value;
          },
        },
      },
    },
    elements: {
      line: {
        borderJoinStyle: "round",
        borderCapStyle: "round",
      },
      point: {
        hoverBorderWidth: 3,
      },
    },

    animation: {
      duration: 1000,
      easing: "easeInOutQuart",
    },
  };

  // Merge default options with custom options
  const finalOptions: ChartOptions<"line"> = {
    ...defaultOptions,
    ...options,
    plugins: {
      ...defaultOptions.plugins,
      ...options.plugins,
    },
    scales: {
      ...defaultOptions.scales,
      ...options.scales,
    },
  };

  useEffect(() => {
    const chart = chartRef.current;
    if (chart) {
      // Add any custom chart interactions or event listeners here
    }
  }, []);

  return (
    <div
      className={`bg-white rounded-lg p-4 shadow-sm border border-gray-200 ${className}`}
    >
      <div
        style={{
          position: "relative",
          height: responsive ? `${height}px` : "auto",
        }}
      >
        <Line
          ref={chartRef}
          data={enhancedData}
          options={finalOptions}
          width={responsive ? undefined : width}
          height={responsive ? undefined : height}
        />
      </div>
    </div>
  );
};

export default LineChart;
