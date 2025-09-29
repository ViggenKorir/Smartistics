"use client";

import React, { useState, useEffect } from "react";
import { SubscriptionNotice } from "./index";
import {
  useMockSubscriptionStatus,
  MockSubscriptionSwitcher,
  useMockSubscriptionCheck,
} from "../MockSubscriptionProvider";
import { useMockAuth, MockUserSwitcher } from "../MockAuthProvider";

interface MockSubscriptionData {
  userId: string;
  tier: "free" | "plus" | "premium";
  status: "active" | "pending" | "expired" | "cancelled";
  expiryDate: string | null;
  daysOverdue: number;
  amount: number;
  currency: string;
}

interface MockUser {
  id: string;
  name: string;
  email: string;
  role: "Admin" | "Manager" | "Analyst" | "Marketer" | "Employee" | "Founder";
}

const SubscriptionDemoPage: React.FC = () => {
  const { user, switchUser, switchRole } = useMockAuth();
  const { currentScenario, setScenario, availableScenarios, subscription } =
    useMockSubscriptionStatus();
  const subscriptionCheck = useMockSubscriptionCheck();

  const [noticeActions, setNoticeActions] = useState<string[]>([]);
  const [showNotice, setShowNotice] = useState(true);

  const currentScenarioData = availableScenarios.find(
    (s) => s.id === currentScenario,
  );

  const handleNoticeAction = (actionType: string, target?: string) => {
    const action = `${actionType}${target ? ` -> ${target}` : ""}`;
    setNoticeActions((prev) => [
      ...prev,
      `${new Date().toLocaleTimeString()}: ${action}`,
    ]);
  };

  const resetDemo = () => {
    setNoticeActions([]);
    setShowNotice(true);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Subscription Components Demo
          </h1>
          <p className="text-lg text-gray-600">
            Interactive demo of the SubscriptionNotice component with different
            subscription scenarios
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Controls */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow p-6 mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Demo Controls
              </h3>

              {/* Mock User Switcher */}
              <div className="mb-6">
                <MockUserSwitcher showRole={true} className="mb-4" />
              </div>

              {/* Mock Subscription Switcher */}
              <div className="mb-6">
                <MockSubscriptionSwitcher />
              </div>

              {/* Reset Button */}
              <button
                onClick={resetDemo}
                className="w-full bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
              >
                Reset Demo
              </button>
            </div>

            {/* Action Log */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Action Log
              </h3>

              {noticeActions.length > 0 ? (
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {noticeActions.map((action, index) => (
                    <div
                      key={index}
                      className="text-sm text-gray-600 bg-gray-50 p-2 rounded"
                    >
                      {action}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500 italic">
                  No actions logged yet. Interact with the subscription notice
                  to see actions.
                </p>
              )}
            </div>
          </div>

          {/* Demo Area */}
          <div className="lg:col-span-2">
            <div
              className="bg-white rounded-lg shadow p-6 mb-6"
              style={{ minHeight: "400px" }}
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Subscription Notice Demo
              </h3>

              {/* Mock User Info */}
              <div className="mb-6 p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-800">
                  <strong>Logged in as:</strong> {user?.name} ({user?.role})
                </p>
                <p className="text-sm text-blue-700">
                  <strong>Current Scenario:</strong> {currentScenarioData?.name}
                </p>
              </div>

              {/* Subscription Notice Component */}
              {showNotice && (
                <div className="mb-6">
                  {/* Mock the subscription context */}
                  <div className="subscription-demo">
                    <SubscriptionNotice onAction={handleNoticeAction} />
                  </div>
                </div>
              )}

              {/* Main Content Area */}
              <div className="border-2 border-dashed border-gray-200 rounded-lg p-8 text-center">
                <h4 className="text-lg font-medium text-gray-900 mb-2">
                  Your App Content Goes Here
                </h4>
                <p className="text-gray-600">
                  This represents the main content of your application. The
                  subscription notice appears above this content when triggered.
                </p>

                {subscriptionCheck.isLocked && (
                  <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-red-800 font-medium">
                      ⚠️ In lockout mode, this content would be blocked
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Scenario Details */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Current Scenario Details
              </h3>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium text-gray-700">Tier:</span>
                  <span
                    className={`ml-2 px-2 py-1 rounded text-xs font-medium ${
                      subscription?.tier === "free"
                        ? "bg-gray-100 text-gray-800"
                        : subscription?.tier === "plus"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-purple-100 text-purple-800"
                    }`}
                  >
                    {subscription?.tier.toUpperCase()}
                  </span>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Status:</span>
                  <span
                    className={`ml-2 px-2 py-1 rounded text-xs font-medium ${
                      subscription?.status === "active"
                        ? "bg-green-100 text-green-800"
                        : subscription?.status === "pending"
                          ? "bg-yellow-100 text-yellow-800"
                          : subscription?.status === "expired"
                            ? "bg-red-100 text-red-800"
                            : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {subscription?.status.toUpperCase()}
                  </span>
                </div>
                <div>
                  <span className="font-medium text-gray-700">
                    Days Overdue:
                  </span>
                  <span className="ml-2 text-gray-900">
                    {subscription?.daysOverdue}
                  </span>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Amount:</span>
                  <span className="ml-2 text-gray-900">
                    ${subscription?.amount} {subscription?.currency}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Debug Panel */}
          <div className="lg:col-span-1">
            <div className="space-y-6">
              {/* Notice Visibility */}
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Notice Visibility
                </h3>

                <div className="space-y-3 text-sm">
                  {[
                    "Admin",
                    "Manager",
                    "Analyst",
                    "Marketer",
                    "Employee",
                    "Founder",
                  ].map((role) => {
                    const shouldShow = () => {
                      if (subscription?.status === "active") return false;

                      const daysOverdue = subscription?.daysOverdue || 0;
                      if (daysOverdue >= 8) return true; // All users see lockout
                      if (daysOverdue >= 6)
                        return [
                          "Admin",
                          "Manager",
                          "Employee",
                          "Founder",
                        ].includes(role);
                      if (daysOverdue >= 1)
                        return ["Admin", "Manager", "Founder"].includes(role);
                      return false;
                    };

                    const visible = shouldShow();

                    return (
                      <div
                        key={role}
                        className="flex justify-between items-center"
                      >
                        <span
                          className={role === user?.role ? "font-bold" : ""}
                        >
                          {role} {role === user?.role && "(Current)"}
                        </span>
                        <span
                          className={`px-2 py-1 rounded text-xs ${
                            visible
                              ? "bg-green-100 text-green-800"
                              : "bg-gray-100 text-gray-500"
                          }`}
                        >
                          {visible ? "Visible" : "Hidden"}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Usage Instructions */}
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  How to Use
                </h3>

                <div className="text-sm text-gray-600 space-y-2">
                  <p>
                    1. Select different subscription scenarios to see various
                    notice states
                  </p>
                  <p>2. Change user roles to test role-based visibility</p>
                  <p>3. Interact with notice buttons to see actions</p>
                  <p>4. Check the action log to see callback events</p>
                </div>
              </div>

              {/* Component Info */}
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Component Features
                </h3>

                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Role-based visibility</li>
                  <li>• Progressive warning stages</li>
                  <li>• Account lockout overlay</li>
                  <li>• Dismissible notices</li>
                  <li>• Action callbacks</li>
                  <li>• Modal dialogs</li>
                  <li>• Responsive design</li>
                  <li>• TypeScript support</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Implementation Example */}
        <div className="mt-12 bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Implementation Example
          </h3>

          <pre className="text-sm bg-gray-50 p-4 rounded-lg overflow-x-auto">
            {`// 1. Wrap your app with the subscription provider
import { SubscriptionStatusProvider } from './components/subscription';

function App() {
  return (
    <SubscriptionStatusProvider>
      <YourApp />
    </SubscriptionStatusProvider>
  );
}

// 2. Use the subscription notice in your components
import { SubscriptionNotice } from './components/subscription';

function Dashboard() {
  const handleAction = (actionType, target) => {
    console.log('User action:', actionType, target);
  };

  return (
    <div>
      <SubscriptionNotice onAction={handleAction} />
      <YourDashboardContent />
    </div>
  );
}

// 3. Check subscription status anywhere in your app
import { useSubscriptionCheck } from './components/subscription';

function FeatureComponent() {
  const { isLocked, isPremiumTier, subscription } = useSubscriptionCheck();

  if (isLocked) {
    return <div>This feature is locked</div>;
  }

  return <YourFeatureContent />;
}`}
          </pre>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionDemoPage;
