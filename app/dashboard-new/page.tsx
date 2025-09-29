"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "../lib/auth/AuthContext";
import ProtectedRoute from "../components/auth/ProtectedRoute";
import SubscriptionNotice from "../components/subscription/SubscriptionNotice";
import DashboardHeader from "../components/dashboard/DashboardHeader";
import SummaryCards from "../components/dashboard/SummaryCards";
import Chart from "../components/dashboard/Chart";

// Subscription status is handled by useSubscriptionCheck hook

interface DashboardData {
  metrics: Array<{
    label: string;
    value: string | number;
    change?: number;
    changeType?: "increase" | "decrease" | "neutral";
  }>;
  chartData: any[];
}

const SmartisticsDashboard: React.FC = () => {
  const { user } = useAuth();
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(
    null,
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Simulate API call to fetch dashboard data
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);

        // Simulate API delay
        await new Promise((resolve) => setTimeout(resolve, 1500));

        // Subscription status is now handled by useSubscriptionCheck hook

        const mockData: DashboardData = {
          metrics: [
            {
              label: "Net Income",
              value: "$124,563",
              change: 12.5,
              changeType: "increase",
            },
            {
              label: "ROI",
              value: "324%",
              change: 18.2,
              changeType: "increase",
            },
            {
              label: "Campaigns",
              value: "47",
              change: 5.7,
              changeType: "increase",
            },
            {
              label: "Customers",
              value: "2,847",
              change: -2.3,
              changeType: "decrease",
            },
          ],
          chartData: [
            { name: "Jan", value: 45000, conversions: 124, roi: 285 },
            { name: "Feb", value: 52000, conversions: 145, roi: 310 },
            { name: "Mar", value: 48000, conversions: 132, roi: 295 },
            { name: "Apr", value: 61000, conversions: 168, roi: 340 },
            { name: "May", value: 55000, conversions: 151, roi: 315 },
            { name: "Jun", value: 67000, conversions: 182, roi: 365 },
            { name: "Jul", value: 73000, conversions: 195, roi: 385 },
          ],
        };

        setDashboardData(mockData);
      } catch (err) {
        setError("Failed to load dashboard data");
        console.error("Dashboard loading error:", err);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchDashboardData();
    }
  }, [user]);

  // Handle subscription action callbacks
  const handleSubscriptionAction = (actionType: string, target?: string) => {
    console.log("Subscription action:", actionType, target);

    // You can add analytics tracking here
    if (typeof window !== "undefined" && (window as any).gtag) {
      (window as any).gtag("event", "subscription_action", {
        action_type: actionType,
        target: target,
        user_role: user?.role,
      });
    }
  };

  // Loading state
  if (loading) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Loading Dashboard
            </h3>
            <p className="text-gray-600">
              Please wait while we fetch your data...
            </p>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  // Error state
  if (error || !dashboardData) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center max-w-md mx-auto">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg
                className="w-8 h-8 text-red-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Dashboard Error
            </h3>
            <p className="text-gray-600 mb-6">
              {error || "Unable to load dashboard data"}
            </p>
            <button
              onClick={() => window.location.reload()}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  // Account locking is now handled by the SubscriptionNotice component

  // Header actions
  const headerActions = (
    <div className="flex items-center space-x-3">
      <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium">
        Export Data
      </button>
      <button className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium">
        Settings
      </button>
    </div>
  );

  // Breadcrumbs
  const breadcrumbs = [{ label: "Home", href: "/" }, { label: "Dashboard" }];

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        {/* Subscription Notice */}
        <SubscriptionNotice onAction={handleSubscriptionAction} />

        {/* Dashboard Header */}
        <DashboardHeader
          title="Smartistics Dashboard"
          subtitle={`Welcome back, ${user?.name || "User"}! Here's your analytics overview.`}
          breadcrumbs={breadcrumbs}
          actions={headerActions}
          showUserInfo={true}
        />

        {/* Main Dashboard Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="space-y-8">
            {/* Summary Cards Section */}
            <div>
              <div className="mb-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-2">
                  Key Metrics Overview
                </h2>
                <p className="text-sm text-gray-600">
                  Track your most important business metrics at a glance
                </p>
              </div>

              <SummaryCards
                metrics={["Net Income", "ROI", "Campaigns", "Customers"]}
                columns={4}
                showIcons={true}
                showChange={true}
                onCardClick={(metric) => {
                  console.log("Card clicked:", metric);
                  // Add navigation logic here
                }}
              />
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Primary Chart */}
              <Chart
                library="Recharts"
                chartType="line"
                dataSource={dashboardData.chartData}
                title="Revenue Trend"
                subtitle="Monthly revenue performance over time"
                height={400}
                yAxisKeys={["value"]}
                colors={["#3B82F6", "#10B981"]}
                showLegend={true}
                showTooltip={true}
                showGrid={true}
                responsive={true}
              />

              {/* Secondary Chart */}
              <Chart
                library="Recharts"
                chartType="bar"
                dataSource={dashboardData.chartData}
                title="Conversions & ROI"
                subtitle="Monthly conversion metrics and ROI performance"
                height={400}
                yAxisKeys={["conversions", "roi"]}
                colors={["#8B5CF6", "#F59E0B"]}
                showLegend={true}
                showTooltip={true}
                showGrid={true}
                responsive={true}
              />
            </div>

            {/* Additional Analytics Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Platform Performance */}
              <div className="lg:col-span-2">
                <Chart
                  library="Recharts"
                  chartType="area"
                  dataSource={dashboardData.chartData}
                  title="Performance Analysis"
                  subtitle="Detailed performance metrics with trend analysis"
                  height={350}
                  yAxisKeys={["value", "conversions"]}
                  colors={["#06B6D4", "#EC4899"]}
                  showLegend={true}
                  showTooltip={true}
                  showGrid={true}
                  responsive={true}
                />
              </div>

              {/* Quick Stats */}
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">
                  Quick Stats
                </h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Active Users</span>
                    <span className="text-sm font-semibold text-gray-900">
                      12,543
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">
                      Conversion Rate
                    </span>
                    <span className="text-sm font-semibold text-green-600">
                      3.24%
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Avg. Session</span>
                    <span className="text-sm font-semibold text-gray-900">
                      4m 32s
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Bounce Rate</span>
                    <span className="text-sm font-semibold text-yellow-600">
                      42.1%
                    </span>
                  </div>
                </div>

                {/* Action buttons */}
                <div className="mt-6 space-y-2">
                  <button className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium">
                    View Detailed Report
                  </button>
                  <button className="w-full border border-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium">
                    Export Analytics
                  </button>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">
                  Recent Activity
                </h3>
                <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                  View All
                </button>
              </div>

              <div className="space-y-4">
                {[
                  {
                    type: "campaign",
                    title: "Summer Campaign 2024",
                    time: "2 hours ago",
                    status: "active",
                  },
                  {
                    type: "conversion",
                    title: "Goal Achievement",
                    time: "4 hours ago",
                    status: "completed",
                  },
                  {
                    type: "alert",
                    title: "Budget Alert",
                    time: "6 hours ago",
                    status: "warning",
                  },
                  {
                    type: "report",
                    title: "Monthly Report Generated",
                    time: "1 day ago",
                    status: "completed",
                  },
                ].map((activity, index) => (
                  <div
                    key={index}
                    className="flex items-center space-x-3 p-3 hover:bg-gray-50 rounded-lg transition-colors"
                  >
                    <div
                      className={`w-2 h-2 rounded-full ${
                        activity.status === "active"
                          ? "bg-blue-500"
                          : activity.status === "completed"
                            ? "bg-green-500"
                            : activity.status === "warning"
                              ? "bg-yellow-500"
                              : "bg-gray-500"
                      }`}
                    ></div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {activity.title}
                      </p>
                      <p className="text-xs text-gray-500">{activity.time}</p>
                    </div>
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${
                        activity.status === "active"
                          ? "bg-blue-100 text-blue-800"
                          : activity.status === "completed"
                            ? "bg-green-100 text-green-800"
                            : activity.status === "warning"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {activity.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default SmartisticsDashboard;
