"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "../../lib/auth/AuthContext";

export type SubscriptionStatus = "active" | "pending" | "expired" | "cancelled";
export type SubscriptionTier = "free" | "plus" | "premium";

export interface SubscriptionData {
  status: SubscriptionStatus;
  tier: SubscriptionTier;
  expiryDate: Date | null;
  daysOverdue: number;
  isGracePeriod: boolean;
  nextBillingDate: Date | null;
  amount: number;
  currency: string;
}

interface SubscriptionStatusContextType {
  subscription: SubscriptionData | null;
  loading: boolean;
  error: string | null;
  refreshSubscription: () => Promise<void>;
}

const SubscriptionStatusContext = createContext<SubscriptionStatusContextType | undefined>(
  undefined
);

export const useSubscriptionStatus = () => {
  const context = useContext(SubscriptionStatusContext);
  if (context === undefined) {
    throw new Error("useSubscriptionStatus must be used within a SubscriptionStatusProvider");
  }
  return context;
};

interface SubscriptionStatusProviderProps {
  children: React.ReactNode;
}

export const SubscriptionStatusProvider: React.FC<SubscriptionStatusProviderProps> = ({
  children,
}) => {
  const { user } = useAuth();
  const [subscription, setSubscription] = useState<SubscriptionData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const calculateDaysOverdue = (expiryDate: Date): number => {
    const now = new Date();
    const diffTime = now.getTime() - expiryDate.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return Math.max(0, diffDays);
  };

  const determineSubscriptionStatus = (
    tier: SubscriptionTier,
    expiryDate: Date | null,
    paymentStatus: string
  ): SubscriptionStatus => {
    if (tier === "free") return "active";
    if (!expiryDate) return "cancelled";

    const now = new Date();
    if (expiryDate > now) return "active";

    if (paymentStatus === "pending") return "pending";
    return "expired";
  };

  const fetchSubscriptionData = async (): Promise<void> => {
    if (!user?.id) return;

    try {
      setLoading(true);
      setError(null);

      // Mock API call - replace with your actual API endpoint
      const response = await fetch(`/api/subscription/${user.id}`);

      if (!response.ok) {
        throw new Error("Failed to fetch subscription data");
      }

      const data = await response.json();

      const expiryDate = data.expiryDate ? new Date(data.expiryDate) : null;
      const nextBillingDate = data.nextBillingDate ? new Date(data.nextBillingDate) : null;

      const status = determineSubscriptionStatus(
        data.tier || "free",
        expiryDate,
        data.paymentStatus || "active"
      );

      const daysOverdue = expiryDate ? calculateDaysOverdue(expiryDate) : 0;
      const isGracePeriod = status === "expired" && daysOverdue <= 7;

      setSubscription({
        status,
        tier: data.tier || "free",
        expiryDate,
        daysOverdue,
        isGracePeriod,
        nextBillingDate,
        amount: data.amount || 0,
        currency: data.currency || "USD",
      });
    } catch (err) {
      console.error("Error fetching subscription data:", err);
      setError(err instanceof Error ? err.message : "Unknown error occurred");

      // Fallback to free tier on error
      setSubscription({
        status: "active",
        tier: "free",
        expiryDate: null,
        daysOverdue: 0,
        isGracePeriod: false,
        nextBillingDate: null,
        amount: 0,
        currency: "USD",
      });
    } finally {
      setLoading(false);
    }
  };

  const refreshSubscription = async (): Promise<void> => {
    await fetchSubscriptionData();
  };

  useEffect(() => {
    if (user?.id) {
      fetchSubscriptionData();
    }
  }, [user?.id]);

  // Auto-refresh subscription data every 5 minutes
  useEffect(() => {
    const interval = setInterval(() => {
      if (user?.id && !loading) {
        fetchSubscriptionData();
      }
    }, 5 * 60 * 1000); // 5 minutes

    return () => clearInterval(interval);
  }, [user?.id, loading]);

  const contextValue: SubscriptionStatusContextType = {
    subscription,
    loading,
    error,
    refreshSubscription,
  };

  return (
    <SubscriptionStatusContext.Provider value={contextValue}>
      {children}
    </SubscriptionStatusContext.Provider>
  );
};

// Hook to get subscription status for components
export const useSubscriptionCheck = () => {
  const { subscription, loading } = useSubscriptionStatus();

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

export default SubscriptionStatusProvider;
