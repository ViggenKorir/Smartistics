"use client";

import React, { useState, useEffect } from "react";
import ProtectedRoute from "../components/auth/ProtectedRoute";
import { useAuth } from "../lib/auth/AuthContext";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

interface PaymentTransaction {
  id: string;
  date: string;
  amount: number;
  currency: string;
  status: "completed" | "pending" | "failed" | "refunded";
  type: "payment" | "refund" | "subscription";
  description: string;
  customerId?: string;
  paymentMethod: string;
  customerName?: string;
}

interface RevenueData {
  month: string;
  revenue: number;
  transactions: number;
  avgTransaction: number;
}

interface PaymentMethodData {
  method: string;
  amount: number;
  percentage: number;
  color: string;
}

// Simple DateRangePicker Component
const DateRangePicker: React.FC<{
  value: { start: string; end: string };
  onChange: (value: { start: string; end: string }) => void;
}> = ({ value, onChange }) => {
  return (
    <div className="flex items-center space-x-2">
      <input
        type="date"
        value={value.start}
        onChange={(e) => onChange({ ...value, start: e.target.value })}
        className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
      />
      <span className="text-gray-500">to</span>
      <input
        type="date"
        value={value.end}
        onChange={(e) => onChange({ ...value, end: e.target.value })}
        className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
      />
    </div>
  );
};

// Simple DownloadButton Component
const DownloadButton: React.FC<{
  onDownload: (format: "pdf" | "csv") => void;
  formats: ("pdf" | "csv")[];
}> = ({ onDownload, formats }) => {
  const [showDropdown, setShowDropdown] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
      >
        <svg
          className="w-4 h-4 mr-2"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 10v6m0 0l-3-3m3 3l3-3M3 17V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2z"
          />
        </svg>
        Export
        <svg
          className="w-4 h-4 ml-2"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {showDropdown && (
        <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-10">
          {formats.map((format) => (
            <button
              key={format}
              onClick={() => {
                onDownload(format);
                setShowDropdown(false);
              }}
              className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 capitalize"
            >
              Export as {format.toUpperCase()}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

const PaymentsReportsPage: React.FC = () => {
  const { user } = useAuth();
  const [dateRange, setDateRange] = useState({
    start: "2024-01-01",
    end: "2024-12-31",
  });
  const [selectedTab, setSelectedTab] = useState<
    "overview" | "transactions" | "reports"
  >("overview");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  // Mock data for payments and reports
  const [transactions, setTransactions] = useState<PaymentTransaction[]>([
    {
      id: "TXN-001",
      date: "2024-01-15",
      amount: 2500.0,
      currency: "USD",
      status: "completed",
      type: "payment",
      description: "Q4 Marketing Campaign",
      customerId: "CUST-001",
      customerName: "Acme Corp",
      paymentMethod: "Credit Card",
    },
    {
      id: "TXN-002",
      date: "2024-01-14",
      amount: 1800.5,
      currency: "USD",
      status: "completed",
      type: "payment",
      description: "Social Media Advertising",
      customerId: "CUST-002",
      customerName: "TechStart Inc",
      paymentMethod: "Bank Transfer",
    },
    {
      id: "TXN-003",
      date: "2024-01-13",
      amount: 500.0,
      currency: "USD",
      status: "pending",
      type: "payment",
      description: "Monthly Analytics Subscription",
      customerId: "CUST-003",
      customerName: "Digital Agency",
      paymentMethod: "PayPal",
    },
    {
      id: "TXN-004",
      date: "2024-01-12",
      amount: 750.25,
      currency: "USD",
      status: "failed",
      type: "payment",
      description: "Campaign Optimization",
      customerId: "CUST-004",
      customerName: "Retail Plus",
      paymentMethod: "Credit Card",
    },
    {
      id: "TXN-005",
      date: "2024-01-11",
      amount: 300.0,
      currency: "USD",
      status: "refunded",
      type: "refund",
      description: "Service Cancellation",
      customerId: "CUST-005",
      customerName: "StartupXYZ",
      paymentMethod: "Credit Card",
    },
    {
      id: "TXN-006",
      date: "2024-01-10",
      amount: 5000.0,
      currency: "USD",
      status: "completed",
      type: "payment",
      description: "Enterprise Package",
      customerId: "CUST-006",
      customerName: "MegaCorp Ltd",
      paymentMethod: "Bank Transfer",
    },
  ]);

  const revenueData: RevenueData[] = [
    { month: "Jan", revenue: 45000, transactions: 124, avgTransaction: 362.9 },
    { month: "Feb", revenue: 52000, transactions: 145, avgTransaction: 358.62 },
    { month: "Mar", revenue: 48000, transactions: 132, avgTransaction: 363.64 },
    { month: "Apr", revenue: 61000, transactions: 168, avgTransaction: 363.1 },
    { month: "May", revenue: 55000, transactions: 151, avgTransaction: 364.24 },
    { month: "Jun", revenue: 67000, transactions: 182, avgTransaction: 368.13 },
    { month: "Jul", revenue: 73000, transactions: 195, avgTransaction: 374.36 },
    { month: "Aug", revenue: 68000, transactions: 187, avgTransaction: 363.64 },
    { month: "Sep", revenue: 71000, transactions: 193, avgTransaction: 367.88 },
    { month: "Oct", revenue: 69000, transactions: 189, avgTransaction: 365.08 },
    { month: "Nov", revenue: 75000, transactions: 201, avgTransaction: 373.13 },
    { month: "Dec", revenue: 82000, transactions: 218, avgTransaction: 376.15 },
  ];

  const paymentMethodData: PaymentMethodData[] = [
    {
      method: "Credit Card",
      amount: 350000,
      percentage: 58.3,
      color: "#3B82F6",
    },
    {
      method: "Bank Transfer",
      amount: 180000,
      percentage: 30.0,
      color: "#10B981",
    },
    { method: "PayPal", amount: 45000, percentage: 7.5, color: "#F59E0B" },
    { method: "Other", amount: 25000, percentage: 4.2, color: "#8B5CF6" },
  ];

  // Filter transactions based on selected filters
  const filteredTransactions = transactions.filter((transaction) => {
    const matchesStatus =
      statusFilter === "all" || transaction.status === statusFilter;
    const matchesType = typeFilter === "all" || transaction.type === typeFilter;
    const matchesSearch =
      transaction.description
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      transaction.customerName
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      transaction.id.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesType && matchesSearch;
  });

  // Pagination
  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedTransactions = filteredTransactions.slice(
    startIndex,
    startIndex + itemsPerPage,
  );

  // Calculate summary metrics
  const totalRevenue = transactions
    .filter((t) => t.status === "completed" && t.type === "payment")
    .reduce((sum, t) => sum + t.amount, 0);

  const pendingAmount = transactions
    .filter((t) => t.status === "pending")
    .reduce((sum, t) => sum + t.amount, 0);

  const refundedAmount = transactions
    .filter((t) => t.type === "refund" || t.status === "refunded")
    .reduce((sum, t) => sum + t.amount, 0);

  const failedAmount = transactions
    .filter((t) => t.status === "failed")
    .reduce((sum, t) => sum + t.amount, 0);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "text-green-600 bg-green-100";
      case "pending":
        return "text-yellow-600 bg-yellow-100";
      case "failed":
        return "text-red-600 bg-red-100";
      case "refunded":
        return "text-gray-600 bg-gray-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "payment":
        return (
          <svg
            className="w-4 h-4 text-green-600"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.293l-3-3a1 1 0 00-1.414 1.414L10.586 9.5 9.293 10.793a1 1 0 101.414 1.414l3-3a1 1 0 000-1.414z"
              clipRule="evenodd"
            />
          </svg>
        );
      case "refund":
        return (
          <svg
            className="w-4 h-4 text-orange-600"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm.707-10.293a1 1 0 00-1.414-1.414l-3 3a1 1 0 000 1.414l3 3a1 1 0 001.414-1.414L9.414 11H13a1 1 0 100-2H9.414l1.293-1.293z"
              clipRule="evenodd"
            />
          </svg>
        );
      default:
        return (
          <svg
            className="w-4 h-4 text-blue-600"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M4 4a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2H4zm0 2h12v8H4V6z"
              clipRule="evenodd"
            />
          </svg>
        );
    }
  };

  const handleExport = (format: "pdf" | "csv") => {
    if (format === "csv") {
      const csvData = [
        [
          "Transaction ID",
          "Date",
          "Amount",
          "Status",
          "Type",
          "Description",
          "Customer",
          "Payment Method",
        ],
        ...filteredTransactions.map((t) => [
          t.id,
          t.date,
          t.amount.toString(),
          t.status,
          t.type,
          t.description,
          t.customerName || "",
          t.paymentMethod,
        ]),
      ];

      const csvContent = csvData.map((row) => row.join(",")).join("\n");
      const blob = new Blob([csvContent], { type: "text/csv" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `payments-report-${new Date().toISOString().split("T")[0]}.csv`;
      a.click();
      window.URL.revokeObjectURL(url);
    } else {
      alert(
        "PDF export functionality would be implemented with a library like jsPDF",
      );
    }
  };

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
                {entry.dataKey === "revenue"
                  ? `$${entry.value.toLocaleString()}`
                  : entry.value.toLocaleString()}
              </span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <ProtectedRoute requiredDashboard="Payments & Reports">
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Payments & Reports
                </h1>
                <p className="text-sm text-gray-500 mt-1">
                  Financial overview and transaction management
                </p>
              </div>

              <div className="flex items-center space-x-4">
                <DateRangePicker value={dateRange} onChange={setDateRange} />
                <DownloadButton
                  onDownload={handleExport}
                  formats={["pdf", "csv"]}
                />
              </div>
            </div>
          </div>
        </header>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Tab Navigation */}
          <div className="mb-8">
            <nav className="flex space-x-8">
              {[
                { key: "overview", label: "Overview" },
                { key: "transactions", label: "Transactions" },
                { key: "reports", label: "Reports" },
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setSelectedTab(tab.key as any)}
                  className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                    selectedTab === tab.key
                      ? "border-blue-500 text-blue-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          {/* Overview Tab */}
          {selectedTab === "overview" && (
            <div className="space-y-8">
              {/* Summary Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <div className="flex items-center">
                    <div className="p-3 rounded-full bg-green-100 mr-4">
                      <svg
                        className="w-6 h-6 text-green-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                        />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600">
                        Total Revenue
                      </p>
                      <p className="text-2xl font-semibold text-gray-900">
                        ${totalRevenue.toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <div className="flex items-center">
                    <div className="p-3 rounded-full bg-yellow-100 mr-4">
                      <svg
                        className="w-6 h-6 text-yellow-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600">
                        Pending
                      </p>
                      <p className="text-2xl font-semibold text-gray-900">
                        ${pendingAmount.toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <div className="flex items-center">
                    <div className="p-3 rounded-full bg-red-100 mr-4">
                      <svg
                        className="w-6 h-6 text-red-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600">
                        Failed
                      </p>
                      <p className="text-2xl font-semibold text-gray-900">
                        ${failedAmount.toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <div className="flex items-center">
                    <div className="p-3 rounded-full bg-gray-100 mr-4">
                      <svg
                        className="w-6 h-6 text-gray-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M16 15v-1a4 4 0 00-4-4H8m0 0l3 3m-3-3l3-3m9 14V5a2 2 0 00-2-2H6a2 2 0 00-2 2v16l4-2 4 2 4-2 4 2z"
                        />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600">
                        Refunded
                      </p>
                      <p className="text-2xl font-semibold text-gray-900">
                        ${refundedAmount.toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Charts */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Revenue Trend */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Revenue Trend
                  </h3>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={revenueData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                        <XAxis dataKey="month" stroke="#6B7280" fontSize={12} />
                        <YAxis stroke="#6B7280" fontSize={12} />
                        <Tooltip content={<CustomTooltip />} />
                        <Legend />
                        <Line
                          type="monotone"
                          dataKey="revenue"
                          stroke="#3B82F6"
                          strokeWidth={3}
                          dot={{ fill: "#3B82F6", r: 5 }}
                          activeDot={{ r: 7 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Payment Methods */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Payment Methods
                  </h3>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={paymentMethodData}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={120}
                          paddingAngle={5}
                          dataKey="amount"
                        >
                          {paymentMethodData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip
                          formatter={(value: number) => [
                            `$${value.toLocaleString()}`,
                            "Amount",
                          ]}
                        />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Transactions Tab */}
          {selectedTab === "transactions" && (
            <div className="space-y-6">
              {/* Filters */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Search
                    </label>
                    <input
                      type="text"
                      placeholder="Search transactions..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Status
                    </label>
                    <select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="all">All Status</option>
                      <option value="completed">Completed</option>
                      <option value="pending">Pending</option>
                      <option value="failed">Failed</option>
                      <option value="refunded">Refunded</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Type
                    </label>
                    <select
                      value={typeFilter}
                      onChange={(e) => setTypeFilter(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="all">All Types</option>
                      <option value="payment">Payment</option>
                      <option value="refund">Refund</option>
                      <option value="subscription">Subscription</option>
                    </select>
                  </div>

                  <div className="flex items-end">
                    <button
                      onClick={() => {
                        setSearchTerm("");
                        setStatusFilter("all");
                        setTypeFilter("all");
                      }}
                      className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
                    >
                      Clear Filters
                    </button>
                  </div>
                </div>
              </div>

              {/* Transactions Table */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="text-left py-3 px-6 font-medium text-gray-900">
                          Transaction
                        </th>
                        <th className="text-left py-3 px-6 font-medium text-gray-900">
                          Customer
                        </th>
                        <th className="text-left py-3 px-6 font-medium text-gray-900">
                          Amount
                        </th>
                        <th className="text-left py-3 px-6 font-medium text-gray-900">
                          Status
                        </th>
                        <th className="text-left py-3 px-6 font-medium text-gray-900">
                          Method
                        </th>
                        <th className="text-left py-3 px-6 font-medium text-gray-900">
                          Date
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {paginatedTransactions.map((transaction) => (
                        <tr
                          key={transaction.id}
                          className="border-b border-gray-100 hover:bg-gray-50"
                        >
                          <td className="py-4 px-6">
                            <div className="flex items-center space-x-3">
                              {getTypeIcon(transaction.type)}
                              <div>
                                <p className="font-medium text-gray-900">
                                  {transaction.id}
                                </p>
                                <p className="text-sm text-gray-500">
                                  {transaction.description}
                                </p>
                              </div>
                            </div>
                          </td>
                          <td className="py-4 px-6">
                            <div>
                              <p className="font-medium text-gray-900">
                                {transaction.customerName}
                              </p>
                              <p className="text-sm text-gray-500">
                                {transaction.customerId}
                              </p>
                            </div>
                          </td>
                          <td className="py-4 px-6">
                            <p className="font-medium text-gray-900">
                              ${transaction.amount.toLocaleString()}
                            </p>
                            <p className="text-sm text-gray-500">
                              {transaction.currency}
                            </p>
                          </td>
                          <td className="py-4 px-6">
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(transaction.status)}`}
                            >
                              {transaction.status.charAt(0).toUpperCase() +
                                transaction.status.slice(1)}
                            </span>
                          </td>
                          <td className="py-4 px-6">
                            <p className="text-sm text-gray-900">
                              {transaction.paymentMethod}
                            </p>
                          </td>
                          <td className="py-4 px-6">
                            <p className="text-sm text-gray-900">
                              {new Date(transaction.date).toLocaleDateString()}
                            </p>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
                    <div className="text-sm text-gray-500">
                      Showing {startIndex + 1} to{" "}
                      {Math.min(
                        startIndex + itemsPerPage,
                        filteredTransactions.length,
                      )}{" "}
                      of {filteredTransactions.length} transactions
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() =>
                          setCurrentPage(Math.max(1, currentPage - 1))
                        }
                        disabled={currentPage === 1}
                        className="px-3 py-1 border border-gray-300 rounded-md text-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Previous
                      </button>
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                        (page) => (
                          <button
                            key={page}
                            onClick={() => setCurrentPage(page)}
                            className={`px-3 py-1 border rounded-md text-sm ${
                              page === currentPage
                                ? "bg-blue-600 text-white border-blue-600"
                                : "border-gray-300 hover:bg-gray-50"
                            }`}
                          >
                            {page}
                          </button>
                        ),
                      )}
                      <button
                        onClick={() =>
                          setCurrentPage(Math.min(totalPages, currentPage + 1))
                        }
                        disabled={currentPage === totalPages}
                        className="px-3 py-1 border border-gray-300 rounded-md text-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Next
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Reports Tab */}
          {selectedTab === "reports" && (
            <div className="space-y-8">
              {/* Monthly Performance */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">
                  Monthly Performance Report
                </h3>
                <div className="h-96">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={revenueData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                      <XAxis dataKey="month" stroke="#6B7280" fontSize={12} />
                      <YAxis stroke="#6B7280" fontSize={12} />
                      <Tooltip content={<CustomTooltip />} />
                      <Legend />
                      <Bar
                        dataKey="revenue"
                        fill="#3B82F6"
                        radius={[4, 4, 0, 0]}
                      />
                      <Bar
                        dataKey="transactions"
                        fill="#10B981"
                        radius={[4, 4, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Payment Method Breakdown */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-6">
                    Payment Method Statistics
                  </h3>
                  <div className="space-y-4">
                    {paymentMethodData.map((method, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between"
                      >
                        <div className="flex items-center space-x-3">
                          <div
                            className="w-4 h-4 rounded-full"
                            style={{ backgroundColor: method.color }}
                          />
                          <span className="text-sm font-medium text-gray-900">
                            {method.method}
                          </span>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-semibold text-gray-900">
                            ${method.amount.toLocaleString()}
                          </p>
                          <p className="text-xs text-gray-500">
                            {method.percentage}%
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-6">
                    Transaction Summary
                  </h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">
                        Total Transactions
                      </span>
                      <span className="text-sm font-semibold text-gray-900">
                        {transactions.length}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">
                        Success Rate
                      </span>
                      <span className="text-sm font-semibold text-green-600">
                        {(
                          (transactions.filter((t) => t.status === "completed")
                            .length /
                            transactions.length) *
                          100
                        ).toFixed(1)}
                        %
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">
                        Average Transaction
                      </span>
                      <span className="text-sm font-semibold text-gray-900">
                        $
                        {(
                          totalRevenue /
                          transactions.filter((t) => t.status === "completed")
                            .length
                        ).toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Refund Rate</span>
                      <span className="text-sm font-semibold text-yellow-600">
                        {(
                          (transactions.filter(
                            (t) =>
                              t.status === "refunded" || t.type === "refund",
                          ).length /
                            transactions.length) *
                          100
                        ).toFixed(1)}
                        %
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Financial Summary */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">
                  Financial Summary
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-600 mb-2">
                      ${totalRevenue.toLocaleString()}
                    </div>
                    <div className="text-sm text-gray-600">Total Revenue</div>
                    <div className="text-xs text-green-600 mt-1">
                      +{(((totalRevenue - 480000) / 480000) * 100).toFixed(1)}%
                      vs last period
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-600 mb-2">
                      {
                        transactions.filter((t) => t.status === "completed")
                          .length
                      }
                    </div>
                    <div className="text-sm text-gray-600">
                      Successful Payments
                    </div>
                    <div className="text-xs text-blue-600 mt-1">
                      +12.5% vs last period
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-purple-600 mb-2">
                      ${(refundedAmount + failedAmount).toLocaleString()}
                    </div>
                    <div className="text-sm text-gray-600">
                      Issues & Refunds
                    </div>
                    <div className="text-xs text-red-600 mt-1">
                      -8.2% vs last period
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default PaymentsReportsPage;
