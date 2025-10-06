"use client";
import React, { useEffect, useState } from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  BarChart,
  Bar,
} from "recharts";
import { Loader2, TrendingUp, AlertCircle } from "lucide-react";

interface TrendPoint {
  date: string;
  keyword: string;
  mentions: number;
}

const AnalyticsDashboard: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [trendData, setTrendData] = useState<TrendPoint[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<string>("");

  useEffect(() => {
    const fetchTrends = async () => {
      setLoading(true);
      setError(null);

      try {
        const res = await fetch("/api/scrape/trends");

        if (!res.ok) {
          throw new Error(
            `Server responded with ${res.status}: ${res.statusText}`,
          );
        }

        const data = await res.json();

        // Check if there's an error in the response
        if (data.error && data.trends.length === 0) {
          throw new Error(data.error);
        }

        setTrendData(data.trends || []);
        setStatus(data.status || "success");

        if (data.status === "fallback") {
          setError("Using demo data - scraper service may be down");
        }
      } catch (err: unknown) {
        let errorMessage = "Something went wrong";

        if (err instanceof Error) {
          errorMessage = err.message;
        }

        console.error("Fetch error:", errorMessage);
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchTrends();
  }, []);

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <TrendingUp className="h-8 w-8 text-blue-600" />
          <h1 className="text-3xl font-bold text-gray-900">
            SME Market Trends Analytics
          </h1>
        </div>

        {/* Status indicators */}
        <div className="mb-6 flex gap-4">
          {loading && (
            <div className="flex items-center gap-2 bg-blue-50 text-blue-700 px-4 py-2 rounded-lg border border-blue-200">
              <Loader2 className="animate-spin h-4 w-4" />
              <span>Fetching latest market insights...</span>
            </div>
          )}

          {error && (
            <div className="flex items-center gap-2 bg-yellow-50 text-yellow-700 px-4 py-2 rounded-lg border border-yellow-200">
              <AlertCircle className="h-4 w-4" />
              <span>{error}</span>
            </div>
          )}

          {status === "success" && !loading && (
            <div className="bg-green-50 text-green-700 px-4 py-2 rounded-lg border border-green-200">
              ✅ Live data from scraper
            </div>
          )}
        </div>

        {/* Charts */}
        {!loading && trendData.length > 0 && (
          <div className="space-y-8">
            {/* Bar Chart */}
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                Trending Keywords
              </h2>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={trendData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="keyword" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="mentions" fill="#3B82F6" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Line Chart */}
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                Mention Trends Over Time
              </h2>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={trendData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="keyword" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="mentions"
                    stroke="#2563EB"
                    activeDot={{ r: 6 }}
                    name="Mentions"
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Summary Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <h3 className="text-sm font-medium text-gray-500">
                  Total Keywords
                </h3>
                <p className="text-2xl font-bold text-gray-900">
                  {trendData.length}
                </p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <h3 className="text-sm font-medium text-gray-500">
                  Total Mentions
                </h3>
                <p className="text-2xl font-bold text-gray-900">
                  {trendData.reduce((sum, item) => sum + item.mentions, 0)}
                </p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <h3 className="text-sm font-medium text-gray-500">
                  Top Keyword
                </h3>
                <p className="text-2xl font-bold text-gray-900 capitalize">
                  {trendData.length > 0
                    ? trendData.sort((a, b) => b.mentions - a.mentions)[0]
                        .keyword
                    : "N/A"}
                </p>
              </div>
            </div>
          </div>
        )}

        {!loading && trendData.length === 0 && !error && (
          <div className="text-center py-12">
            <div className="text-gray-500 text-lg">
              No trend data available yet.
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AnalyticsDashboard;
