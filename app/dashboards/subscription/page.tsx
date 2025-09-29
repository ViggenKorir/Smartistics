"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../lib/auth/AuthContext";

interface SubscriptionDetails {
  planName: string;
  planType: "free" | "starter" | "professional" | "enterprise";
  status: "active" | "pending" | "expired" | "cancelled";
  nextBillingDate: string;
  billingCycle: "monthly" | "yearly";
  amount: number;
  currency: string;
  autoRenew: boolean;
  trialEndsAt?: string;
  usageMetrics: {
    teamMembers: {
      current: number;
      limit: number;
      unit?: string;
      period?: string;
    };
    storage: { current: number; limit: number; unit?: string; period?: string };
    apiCalls: {
      current: number;
      limit: number;
      unit?: string;
      period?: string;
    };
    projects: {
      current: number;
      limit: number;
      unit?: string;
      period?: string;
    };
  };
}

interface BillingHistory {
  id: string;
  date: string;
  amount: number;
  status: "paid" | "pending" | "failed";
  description: string;
  invoiceUrl?: string;
  paymentMethod: string;
}

interface PaymentMethod {
  id: string;
  type: "card" | "bank" | "paypal" | "mpesa";
  last4?: string;
  brand?: string;
  expiryDate?: string;
  isDefault: boolean;
}

const SubscriptionDashboard: React.FC = () => {
  const { user } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<
    "overview" | "billing" | "payment-methods" | "plans"
  >("overview");

  // Mock data - in real app, this would come from API
  const [subscription, setSubscription] = useState<SubscriptionDetails>({
    planName: "Professional",
    planType: "professional",
    status: "active",
    nextBillingDate: "2024-10-15",
    billingCycle: "monthly",
    amount: 29.99,
    currency: "USD",
    autoRenew: true,
    usageMetrics: {
      teamMembers: { current: 8, limit: 25 },
      storage: { current: 45.2, limit: 100, unit: "GB" },
      apiCalls: { current: 12500, limit: 100000, period: "month" },
      projects: { current: 3, limit: 10 },
    },
  });

  const [billingHistory, setBillingHistory] = useState<BillingHistory[]>([
    {
      id: "inv_001",
      date: "2024-09-15",
      amount: 29.99,
      status: "paid",
      description: "Professional Plan - Monthly",
      invoiceUrl: "/invoices/001",
      paymentMethod: "•••• 4242",
    },
    {
      id: "inv_002",
      date: "2024-08-15",
      amount: 29.99,
      status: "paid",
      description: "Professional Plan - Monthly",
      invoiceUrl: "/invoices/002",
      paymentMethod: "•••• 4242",
    },
    {
      id: "inv_003",
      date: "2024-07-15",
      amount: 29.99,
      status: "paid",
      description: "Professional Plan - Monthly",
      invoiceUrl: "/invoices/003",
      paymentMethod: "•••• 4242",
    },
  ]);

  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([
    {
      id: "pm_001",
      type: "card",
      last4: "4242",
      brand: "Visa",
      expiryDate: "12/25",
      isDefault: true,
    },
    {
      id: "pm_002",
      type: "paypal",
      isDefault: false,
    },
  ]);

  const plans = [
    {
      name: "Free",
      type: "free" as const,
      price: 0,
      description: "Perfect for getting started",
      features: [
        "5 team members",
        "10GB storage",
        "Basic support",
        "Core analytics",
      ],
      limits: { teamMembers: 5, storage: 10, apiCalls: 1000, projects: 2 },
    },
    {
      name: "Starter",
      type: "starter" as const,
      price: 9.99,
      description: "Great for small teams",
      features: [
        "10 team members",
        "50GB storage",
        "Email support",
        "Advanced analytics",
      ],
      limits: { teamMembers: 10, storage: 50, apiCalls: 10000, projects: 5 },
    },
    {
      name: "Professional",
      type: "professional" as const,
      price: 29.99,
      description: "Perfect for growing businesses",
      features: [
        "25 team members",
        "100GB storage",
        "Priority support",
        "Full analytics",
        "API access",
      ],
      limits: { teamMembers: 25, storage: 100, apiCalls: 100000, projects: 10 },
      popular: true,
    },
    {
      name: "Enterprise",
      type: "enterprise" as const,
      price: 99.99,
      description: "For large organizations",
      features: [
        "Unlimited members",
        "Unlimited storage",
        "24/7 support",
        "Custom integrations",
        "SLA",
      ],
      limits: { teamMembers: -1, storage: -1, apiCalls: -1, projects: -1 },
    },
  ];

  useEffect(() => {
    // Simulate loading subscription data
    setTimeout(() => setLoading(false), 1000);
  }, []);

  const getStatusBadge = (status: string) => {
    const variants = {
      active: "bg-green-100 text-green-800",
      pending: "bg-yellow-100 text-yellow-800",
      expired: "bg-red-100 text-red-800",
      cancelled: "bg-gray-100 text-gray-800",
    };
    return variants[status as keyof typeof variants] || variants.active;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const calculateUsagePercentage = (current: number, limit: number) => {
    if (limit === -1) return 0; // Unlimited
    return Math.min((current / limit) * 100, 100);
  };

  const getUsageColor = (percentage: number) => {
    if (percentage >= 90) return "bg-red-500";
    if (percentage >= 75) return "bg-yellow-500";
    return "bg-green-500";
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Subscription Management
          </h1>
          <p className="text-gray-600 mt-2">
            Manage your Smartistics subscription and billing
          </p>
        </div>

        {/* Current Subscription Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900">
                Current Subscription
              </h2>
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusBadge(subscription.status)}`}
              >
                {subscription.status.charAt(0).toUpperCase() +
                  subscription.status.slice(1)}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  {subscription.planName} Plan
                </h3>
                <p className="text-gray-600 mb-4">
                  ${subscription.amount} / {subscription.billingCycle}
                </p>

                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Next billing date:</span>
                    <span className="font-medium">
                      {formatDate(subscription.nextBillingDate)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Auto-renewal:</span>
                    <span className="font-medium">
                      {subscription.autoRenew ? "Enabled" : "Disabled"}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Billing cycle:</span>
                    <span className="font-medium capitalize">
                      {subscription.billingCycle}
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-gray-900 mb-3">
                  Quick Actions
                </h4>
                <div className="space-y-2">
                  <button
                    onClick={() => router.push("/payment")}
                    className="w-full text-left px-4 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors"
                  >
                    Upgrade Plan
                  </button>
                  <button className="w-full text-left px-4 py-2 bg-gray-50 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors">
                    Update Billing Info
                  </button>
                  <button className="w-full text-left px-4 py-2 bg-gray-50 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors">
                    Download Invoice
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Usage Summary */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Usage Overview
            </h3>
            <div className="space-y-4">
              {Object.entries(subscription.usageMetrics).map(
                ([key, metric]) => {
                  const percentage = calculateUsagePercentage(
                    metric.current,
                    metric.limit,
                  );
                  const isUnlimited = metric.limit === -1;

                  return (
                    <div key={key} className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600 capitalize">
                          {key.replace(/([A-Z])/g, " $1").trim()}
                        </span>
                        <span className="font-medium">
                          {metric.current}
                          {metric.unit || ""}
                          {!isUnlimited &&
                            ` / ${metric.limit}${metric.unit || ""}`}
                          {metric.period && ` per ${metric.period}`}
                        </span>
                      </div>
                      {!isUnlimited && (
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full transition-all duration-300 ${getUsageColor(percentage)}`}
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      )}
                    </div>
                  );
                },
              )}
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="border-b border-gray-200 mb-6">
          <nav className="-mb-px flex space-x-8">
            {[
              { id: "overview", label: "Overview" },
              { id: "billing", label: "Billing History" },
              { id: "payment-methods", label: "Payment Methods" },
              { id: "plans", label: "Plans & Pricing" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        {activeTab === "overview" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Detailed Usage Metrics */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">
                Detailed Usage
              </h3>
              <div className="space-y-6">
                {Object.entries(subscription.usageMetrics).map(
                  ([key, metric]) => {
                    const percentage = calculateUsagePercentage(
                      metric.current,
                      metric.limit,
                    );
                    const isUnlimited = metric.limit === -1;

                    return (
                      <div
                        key={key}
                        className="border-b border-gray-100 pb-4 last:border-b-0"
                      >
                        <div className="flex justify-between items-center mb-2">
                          <h4 className="font-medium text-gray-900 capitalize">
                            {key.replace(/([A-Z])/g, " $1").trim()}
                          </h4>
                          <span className="text-2xl font-bold text-gray-900">
                            {metric.current}
                            {metric.unit || ""}
                          </span>
                        </div>
                        <div className="text-sm text-gray-600 mb-2">
                          {isUnlimited
                            ? "Unlimited usage"
                            : `${metric.limit}${metric.unit || ""} ${metric.period ? `per ${metric.period}` : ""} limit`}
                        </div>
                        {!isUnlimited && (
                          <div className="w-full bg-gray-200 rounded-full h-3">
                            <div
                              className={`h-3 rounded-full transition-all duration-300 ${getUsageColor(percentage)}`}
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                        )}
                      </div>
                    );
                  },
                )}
              </div>
            </div>

            {/* Account Settings */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">
                Account Settings
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div>
                    <h4 className="font-medium text-gray-900">Auto-renewal</h4>
                    <p className="text-sm text-gray-600">
                      Automatically renew your subscription
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={subscription.autoRenew}
                      onChange={() =>
                        setSubscription((prev) => ({
                          ...prev,
                          autoRenew: !prev.autoRenew,
                        }))
                      }
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>

                <button className="w-full p-4 text-left border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                  <h4 className="font-medium text-gray-900">Billing Address</h4>
                  <p className="text-sm text-gray-600">
                    Update your billing information
                  </p>
                </button>

                <button className="w-full p-4 text-left border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                  <h4 className="font-medium text-gray-900">Tax Information</h4>
                  <p className="text-sm text-gray-600">
                    Manage tax IDs and exemptions
                  </p>
                </button>

                <button className="w-full p-4 text-left border border-red-200 rounded-lg hover:bg-red-50 transition-colors text-red-700">
                  <h4 className="font-medium">Cancel Subscription</h4>
                  <p className="text-sm text-red-600">
                    End your subscription permanently
                  </p>
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === "billing" && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">
                Billing History
              </h3>
              <p className="text-gray-600">
                View and download your past invoices
              </p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Description
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Payment Method
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Invoice
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {billingHistory.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatDate(item.date)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {item.description}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        ${item.amount}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadge(item.status)}`}
                        >
                          {item.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {item.paymentMethod}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        {item.invoiceUrl && (
                          <button className="text-blue-600 hover:text-blue-700 font-medium">
                            Download
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === "payment-methods" && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold text-gray-900">
                  Payment Methods
                </h3>
                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                  Add Payment Method
                </button>
              </div>

              <div className="space-y-4">
                {paymentMethods.map((method) => (
                  <div
                    key={method.id}
                    className="flex items-center justify-between p-4 border border-gray-200 rounded-lg"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                        {method.type === "card" && (
                          <svg
                            className="w-5 h-5 text-gray-600"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4zM18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" />
                          </svg>
                        )}
                        {method.type === "paypal" && (
                          <svg
                            className="w-5 h-5 text-gray-600"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path d="M6.5 15.25A.75.75 0 017.25 14.5h1.5a.75.75 0 010 1.5h-1.5a.75.75 0 01-.75-.75zM5 12.25a.75.75 0 01.75-.75h2.5a.75.75 0 010 1.5h-2.5a.75.75 0 01-.75-.75zM10 6a4 4 0 00-4 4v6h8v-6a4 4 0 00-4-4z" />
                          </svg>
                        )}
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">
                          {method.type === "card"
                            ? `${method.brand} ending in ${method.last4}`
                            : "PayPal"}
                        </div>
                        <div className="text-sm text-gray-600">
                          {method.type === "card"
                            ? `Expires ${method.expiryDate}`
                            : "PayPal account"}
                          {method.isDefault && (
                            <span className="ml-2 text-blue-600 font-medium">
                              Default
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      {!method.isDefault && (
                        <button className="text-blue-600 hover:text-blue-700 font-medium text-sm">
                          Make Default
                        </button>
                      )}
                      <button className="text-red-600 hover:text-red-700 font-medium text-sm">
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === "plans" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-6">
            {plans.map((plan) => (
              <div
                key={plan.type}
                className={`relative bg-white rounded-xl shadow-sm border-2 p-6 transition-all duration-200 hover:shadow-lg ${
                  plan.type === subscription.planType
                    ? "border-blue-500 ring-2 ring-blue-500 ring-opacity-20"
                    : plan.popular
                      ? "border-blue-200"
                      : "border-gray-200"
                }`}
              >
                {plan.popular && plan.type !== subscription.planType && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                      Popular
                    </span>
                  </div>
                )}

                {plan.type === subscription.planType && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <span className="bg-green-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                      Current Plan
                    </span>
                  </div>
                )}

                <div className="text-center mb-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {plan.name}
                  </h3>
                  <div className="text-3xl font-bold text-gray-900 mb-1">
                    ${plan.price}
                    <span className="text-lg font-normal text-gray-600">
                      /month
                    </span>
                  </div>
                  <p className="text-gray-600">{plan.description}</p>
                </div>

                <ul className="space-y-3 mb-6">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <svg
                        className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() =>
                    plan.type !== subscription.planType &&
                    router.push("/payment")
                  }
                  disabled={plan.type === subscription.planType}
                  className={`w-full py-3 px-4 rounded-lg font-semibold transition-all duration-200 ${
                    plan.type === subscription.planType
                      ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                      : plan.popular
                        ? "bg-blue-600 text-white hover:bg-blue-700 shadow-md hover:shadow-lg"
                        : "bg-gray-900 text-white hover:bg-gray-800"
                  }`}
                >
                  {plan.type === subscription.planType
                    ? "Current Plan"
                    : plan.price === 0
                      ? "Downgrade"
                      : "Upgrade"}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SubscriptionDashboard;
