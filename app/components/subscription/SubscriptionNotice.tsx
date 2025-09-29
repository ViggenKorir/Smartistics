"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../lib/auth/AuthContext";
import { useSubscriptionCheck } from "./SubscriptionStatus";

export type UserRole =
  | "Admin"
  | "Manager"
  | "Analyst"
  | "Marketer"
  | "Employee"
  | "Founder";
export type NoticeType = "warning" | "error" | "lockout";
export type ActionType = "redirect" | "modal" | "dismiss";

interface SubscriptionState {
  daysRange: string;
  visibleTo: (UserRole | "All")[];
  message: string;
  type: NoticeType;
}

interface SubscriptionAction {
  label: string;
  actionType: ActionType;
  target?: string;
}

interface SubscriptionNoticeProps {
  onAction?: (actionType: ActionType, target?: string) => void;
}

const SubscriptionNotice: React.FC<SubscriptionNoticeProps> = ({
  onAction,
}) => {
  const { user } = useAuth();
  const { subscription, isExpired, needsPayment, isLocked } =
    useSubscriptionCheck();
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  const daysOverdue = subscription?.daysOverdue || 0;

  // Subscription states configuration
  const subscriptionStates: SubscriptionState[] = [
    {
      daysRange: "1-3",
      visibleTo: ["Admin", "Manager", "Founder"],
      message: "Payment Due Soon",
      type: "warning",
    },
    {
      daysRange: "4-5",
      visibleTo: ["Admin", "Manager", "Founder"],
      message: "Payment Due / Update your subscription",
      type: "error",
    },
    {
      daysRange: "6-7",
      visibleTo: ["Admin", "Manager", "Employee", "Founder"],
      message: "Payment Due / Update your subscription",
      type: "error",
    },
    {
      daysRange: "8+",
      visibleTo: ["All"],
      message: "Update your subscription to get back into your account",
      type: "lockout",
    },
  ];

  // Actions configuration
  const actions: SubscriptionAction[] = [
    {
      label: "Update Subscription",
      actionType: "redirect",
      target: "/subscription/upgrade",
    },
  ];

  const parseRange = (range: string): [number, number] => {
    if (range.includes("+")) {
      const min = parseInt(range.replace("+", ""));
      return [min, Infinity];
    }

    if (range.includes("-")) {
      const [min, max] = range.split("-").map((n) => parseInt(n));
      return [min, max];
    }

    const num = parseInt(range);
    return [num, num];
  };

  // Determine current state based on days overdue
  const getCurrentState = (): SubscriptionState | null => {
    if (!needsPayment && !isExpired) return null;

    for (const state of subscriptionStates) {
      const [min, max] = parseRange(state.daysRange);
      if (daysOverdue >= min && (max === Infinity || daysOverdue <= max)) {
        return state;
      }
    }
    return null;
  };

  // Check if current user should see the notice
  const shouldShowNotice = (state: SubscriptionState): boolean => {
    if (!user?.role) return false;

    if (state.visibleTo.includes("All")) return true;

    return state.visibleTo.includes(user.role as UserRole);
  };

  // Handle action execution
  const handleAction = (action: SubscriptionAction) => {
    switch (action.actionType) {
      case "redirect":
        if (action.target) {
          router.push(action.target);
        }
        break;
      case "modal":
        setShowModal(true);
        break;
      case "dismiss":
        setIsDismissed(true);
        break;
      default:
        break;
    }

    if (onAction) {
      onAction(action.actionType, action.target);
    }
  };

  const currentState = getCurrentState();

  // Don't render if no state or user shouldn't see it or dismissed
  if (!currentState || !shouldShowNotice(currentState) || isDismissed) {
    return null;
  }

  // Lockout state - full screen overlay
  if (currentState.type === "lockout") {
    return (
      <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-8 max-w-md mx-4 text-center">
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
                d="M12 15v2m-6 2h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Account Locked
          </h3>
          <p className="text-gray-600 mb-6">{currentState.message}</p>
          <div className="space-y-3">
            {actions.map((action, index) => (
              <button
                key={index}
                onClick={() => handleAction(action)}
                className="w-full bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors font-semibold"
              >
                {action.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Warning/Error state - banner
  return (
    <>
      <div
        className={`rounded-lg p-4 mb-6 ${
          currentState.type === "warning"
            ? "bg-yellow-50 border border-yellow-200"
            : "bg-red-50 border border-red-200"
        }`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${
                currentState.type === "warning" ? "bg-yellow-100" : "bg-red-100"
              }`}
            >
              {currentState.type === "warning" ? (
                <svg
                  className="w-5 h-5 text-yellow-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                  />
                </svg>
              ) : (
                <svg
                  className="w-5 h-5 text-red-600"
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
              )}
            </div>
            <div>
              <p
                className={`font-semibold ${
                  currentState.type === "warning"
                    ? "text-yellow-800"
                    : "text-red-800"
                }`}
              >
                Subscription Notice
              </p>
              <p
                className={`text-sm ${
                  currentState.type === "warning"
                    ? "text-yellow-700"
                    : "text-red-700"
                }`}
              >
                {currentState.message}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            {actions.map((action, index) => (
              <button
                key={index}
                onClick={() => handleAction(action)}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  currentState.type === "warning"
                    ? "bg-yellow-600 text-white hover:bg-yellow-700"
                    : "bg-red-600 text-white hover:bg-red-700"
                }`}
              >
                {action.label}
              </button>
            ))}

            <button
              onClick={() => setIsDismissed(true)}
              className={`p-1 rounded-md hover:bg-opacity-20 ${
                currentState.type === "warning"
                  ? "hover:bg-yellow-600"
                  : "hover:bg-red-600"
              }`}
            >
              <svg
                className="w-5 h-5 text-gray-500"
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
            </button>
          </div>
        </div>
      </div>

      {/* Modal for additional actions */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Subscription Update
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg
                  className="w-6 h-6"
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
              </button>
            </div>

            <p className="text-gray-600 mb-6">
              Your subscription needs attention. Please update your payment
              information to continue using Smartistics.
            </p>

            <div className="flex space-x-3">
              <button
                onClick={() => {
                  setShowModal(false);
                  router.push("/subscription/upgrade");
                }}
                className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Update Subscription
              </button>
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Later
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default SubscriptionNotice;
