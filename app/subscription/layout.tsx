"use client";

import React from "react";
import { SubscriptionStatusProvider } from "../components/subscription/SubscriptionStatus";
import { useAuth } from "../lib/auth/AuthContext";

interface SubscriptionLayoutProps {
  children: React.ReactNode;
}

const SubscriptionLayout: React.FC<SubscriptionLayoutProps> = ({ children }) => {
  return (
    <SubscriptionStatusProvider>
      <div className="min-h-screen bg-gray-50">
        {children}
      </div>
    </SubscriptionStatusProvider>
  );
};

export default SubscriptionLayout;
