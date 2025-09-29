"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useMockAuth } from "./MockAuthProvider";

export type SubscriptionStatus = "active" | "pending" | "expired" | "cancelled";
export type SubscriptionTier = "free" | "plus" | "premium";

export interface MockSubscriptionData {
  status: SubscriptionStatus;
  tier: SubscriptionTier;
  expiryDate: Date | null;
  daysOverdue: number;
  isGracePeriod: boolean;
  nextBillingDate: Date | null;
  amount: number;
  currency: string;
}

interface MockSubscriptionContextType {
  subscription: MockSubscriptionData | null;
  loading: boolean;
  error: string | null;
  refreshSubscription: () => Promise<void>;
  setScenario: (scenarioId: string) => void;
  currentScenario: string;
  availableScenarios: MockScenario[];
}

interface MockScenario {
  id: string;
  name: string;
  description: string;
  subscription: MockSubscriptionData;
}

const MockSubscriptionContext = createContext<MockSubscriptionContextType | undefined>(
  undefined
);

export const useMockSubscriptionStatus = () => {
  const context = useContext(MockSubscriptionContext);
  if (context === undefined) {
    throw new Error("useMockSubscriptionStatus must be used within a MockSubscriptionProvider");
  }
  return context;
};

// For compatibility with existing components
export const useSubscriptionStatus = useMockSubscriptionStatus;

interface MockSubscriptionProviderProps {
  children: React.ReactNode;
  defaultScenario?: string;
}

export const MockSubscriptionProvider: React.FC<MockSubscriptionProviderProps> = ({
  children,
  defaultScenario = "active-plus"
}) => {
  const { user } = useMockAuth();
  const [currentScenario, setCurrentScenario] = useState(defaultScenario);
  const [subscription, setSubscription] = useState<MockSubscriptionData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [availableScenarios, setAvailableScenarios] = useState<MockScenario[]>([]);

  const setScenario = (scenarioId: string) => {
    const scenario = availableScenarios.find(s => s.id === scenarioId);
    if (scenario) {
      setCurrentScenario(scenarioId);
      setSubscription(scenario.subscription);
    }
  };

  const fetchSubscriptionData = async (): Promise<void> => {
    if (!user?.id) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      if (availableScenarios.length === 0) {
        const res = await fetch("http://localhost:3001/subscriptionScenarios");
        const json: any[] = await res.json();
        const parsed: MockScenario[] = (json || []).map((s: any) => ({
          ...s,
          subscription: {
            ...s.subscription,
            expiryDate: s.subscription?.expiryDate ? new Date(s.subscription.expiryDate) : null,
            nextBillingDate: s.subscription?.nextBillingDate ? new Date(s.subscription.nextBillingDate) : null
          }
        }));
        setAvailableScenarios(parsed);
      }

      const scenario = (availableScenarios.length ? availableScenarios : []).find(s => s.id === currentScenario)
        || (availableScenarios.length ? availableScenarios[0] : null);
      if (scenario) {
        setSubscription(scenario.subscription);
      } else {
        // Fallback to free tier
        setSubscription(null);
      }
    } catch (err) {
      console.error("Error fetching subscription data:", err);
      setError(err instanceof Error ? err.message : "Unknown error occurred");

      // Fallback to free tier on error
      setSubscription(availableScenarios[0].subscription);
    } finally {
      setLoading(false);
    }
  };

  const refreshSubscription = async (): Promise<void> => {
    await fetchSubscriptionData();
  };

  // Initialize subscription data
  useEffect(() => {
    if (user?.id) {
      fetchSubscriptionData();
    }
  }, [user?.id, currentScenario]);

  const contextValue: MockSubscriptionContextType = {
    subscription,
    loading,
    error,
    refreshSubscription,
    setScenario,
    currentScenario,
    availableScenarios,
  };

  return (
    <MockSubscriptionContext.Provider value={contextValue}>
      {children}
    </MockSubscriptionContext.Provider>
  );
};

// Hook to get subscription status for components
export const useMockSubscriptionCheck = () => {
  const { subscription, loading } = useMockSubscriptionStatus();

  const isActive = subscription?.status === "active";
  const isExpired = subscription?.status === "expired";
  const isPending = subscription?.status === "pending";
  const isCancelled = subscription?.status === "cancelled";
  const isFreeTier = subscription?.tier === "free";
  const isPlusTier = subscription?.tier === "plus";
  const isPremiumTier = subscription?.tier === "premium";
  const needsPayment = isExpired || isPending;
  const isLocked = isExpired && (subscription?.daysOverdue || 0) > 7;

  return {
    subscription,
    loading,
    isActive,
    isExpired,
    isPending,
    isCancelled,
    isFreeTier,
    isPlusTier,
    isPremiumTier,
    needsPayment,
    isLocked,
  };
};

// For compatibility with existing components
export const useSubscriptionCheck = useMockSubscriptionCheck;

// Scenario switcher component for demos
export const MockSubscriptionSwitcher: React.FC<{
  className?: string;
}> = ({
  className = ""
}) => {
  const {
    currentScenario,
    setScenario,
    availableScenarios,
    subscription
  } = useMockSubscriptionStatus();

  const currentScenarioData = availableScenarios.find(s => s.id === currentScenario);

  return (
    <div className={`bg-blue-50 border border-blue-200 rounded-lg p-4 ${className}`}>
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-sm font-medium text-blue-800">Subscription Demo</h4>
        <span className="text-xs text-blue-600 bg-blue-100 px-2 py-1 rounded">
          Mock Data
        </span>
      </div>

      <div className="space-y-4">
        {/* Scenario Selector */}
        <div>
          <label className="block text-sm font-medium text-blue-700 mb-1">
            Subscription Scenario
          </label>
          <select
            value={currentScenario}
            onChange={(e) => setScenario(e.target.value)}
            className="w-full px-3 py-2 border border-blue-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-sm"
          >
            {availableScenarios.map((scenario) => (
              <option key={scenario.id} value={scenario.id}>
                {scenario.name}
              </option>
            ))}
          </select>
          {currentScenarioData && (
            <p className="mt-1 text-xs text-blue-600">
              {currentScenarioData.description}
            </p>
          )}
        </div>

        {/* Current Status */}
        {subscription && (
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div>
              <span className="font-medium text-blue-700">Tier:</span>
              <span className={`ml-1 px-1.5 py-0.5 rounded text-xs font-medium ${
                subscription.tier === 'free' ? 'bg-gray-100 text-gray-700' :
                subscription.tier === 'plus' ? 'bg-blue-100 text-blue-700' :
                'bg-purple-100 text-purple-700'
              }`}>
                {subscription.tier.toUpperCase()}
              </span>
            </div>
            <div>
              <span className="font-medium text-blue-700">Status:</span>
              <span className={`ml-1 px-1.5 py-0.5 rounded text-xs font-medium ${
                subscription.status === 'active' ? 'bg-green-100 text-green-700' :
                subscription.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                subscription.status === 'expired' ? 'bg-red-100 text-red-700' :
                'bg-gray-100 text-gray-700'
              }`}>
                {subscription.status.toUpperCase()}
              </span>
            </div>
            {subscription.daysOverdue > 0 && (
              <div className="col-span-2">
                <span className="font-medium text-blue-700">Days Overdue:</span>
                <span className="ml-1 text-red-600 font-medium">
                  {subscription.daysOverdue}
                </span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default MockSubscriptionProvider;
