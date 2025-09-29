"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../lib/auth/AuthContext";
import {
  useSubscriptionStatus,
  useSubscriptionCheck,
} from "../../components/subscription/SubscriptionStatus";

type PaymentMethod = "card" | "mpesa" | "paypal";
type SubscriptionPlan = "free" | "plus" | "premium";

interface PlanFeature {
  name: string;
  included: boolean;
  description?: string;
}

interface PlanDetails {
  id: SubscriptionPlan;
  name: string;
  price: number;
  currency: string;
  billing: "monthly" | "annually";
  popular?: boolean;
  features: PlanFeature[];
  description: string;
}

const SubscriptionUpgradePage: React.FC = () => {
  const router = useRouter();
  const { user } = useAuth();
  const {
    subscription,
    refreshSubscription,
    loading: subscriptionLoading,
  } = useSubscriptionStatus();
  const { isFreeTier, isPlusTier, isPremiumTier } = useSubscriptionCheck();
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan>("plus");
  const [billingCycle, setBillingCycle] = useState<"monthly" | "annually">(
    "monthly",
  );
  const [selectedPayment, setSelectedPayment] = useState<PaymentMethod>("card");
  const [isProcessing, setIsProcessing] = useState(false);

  const plans: PlanDetails[] = [
    {
      id: "free",
      name: "Free",
      price: 0,
      currency: "USD",
      billing: "monthly",
      description: "Everything you need to get started",
      features: [
        { name: "Free plan features", included: true },
        { name: "1 GB storage", included: true },
        { name: "One workspace", included: true },
        { name: "1+ audio and video meetings", included: true },
        { name: "Time tracking", included: true },
        { name: "AI copilots", included: true },
        { name: "Two-factor authentication", included: true },
        { name: "Data exports for all managers", included: true },
        { name: "SMS 2-factor authentication", included: true },
      ],
    },
    {
      id: "plus",
      name: "Plus",
      price: billingCycle === "monthly" ? 12 : 120,
      currency: "USD",
      billing: billingCycle,
      popular: true,
      description: "Everything in free plan",
      features: [
        { name: "Everything in free plan", included: true },
        { name: "Unlimited timeline views", included: true },
        { name: "Unlimited teams", included: true },
        { name: "Private docs", included: true },
        { name: "Google single sign-on (SSO)", included: true },
        { name: "Custom workflow steps", included: true },
        { name: "Custom user groups", included: true },
        { name: "Premium workflows", included: true },
        { name: "Custom templates", included: true },
      ],
    },
    {
      id: "premium",
      name: "Premium",
      price: billingCycle === "monthly" ? 16 : 160,
      currency: "USD",
      billing: billingCycle,
      description: "Most advanced features and priority support",
      features: [
        { name: "Everything in plus plan", included: true },
        { name: "Priority support", included: true },
        { name: "Custom terms of service", included: true },
        { name: "Data loss prevention", included: true },
        { name: "Workflow builder", included: true },
        { name: "Custom analytics data set", included: true },
        { name: "Conditional logic in forms", included: true },
        { name: "Custom permissions (ACL)", included: true },
        { name: "Advanced capacity planning", included: true },
      ],
    },
  ];

  const paymentMethods = [
    {
      id: "card" as PaymentMethod,
      name: "Credit/Debit Card",
      icon: (
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
            d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
          />
        </svg>
      ),
      description: "Visa, Mastercard, American Express",
    },
    {
      id: "mpesa" as PaymentMethod,
      name: "M-Pesa",
      icon: (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
        </svg>
      ),
      description: "Pay with your mobile money",
    },
    {
      id: "paypal" as PaymentMethod,
      name: "PayPal",
      icon: (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944.901C5.026.382 5.474 0 5.998 0h7.46c2.57 0 4.578.543 5.69 1.81 1.01 1.15 1.304 2.42 1.012 4.287-.023.143-.047.288-.077.437-.983 5.05-4.349 6.797-8.647 6.797h-2.19c-.524 0-.968.382-1.05.9l-1.12 7.106zm14.146-14.42a3.35 3.35 0 0 0-.607-.421c-.962-.6-2.393-.84-4.04-.84h-2.19c-.524 0-.968.382-1.05.9L11.25 11.7c-.082.518.24.9.762.9h2.19c3.24 0 5.755-1.31 6.565-5.685.12-.64.156-1.18.079-1.698z" />
        </svg>
      ),
      description: "Pay with your PayPal account",
    },
  ];

  const handlePlanSelect = (planId: SubscriptionPlan) => {
    setSelectedPlan(planId);
  };

  const handlePaymentSelect = (method: PaymentMethod) => {
    setSelectedPayment(method);
  };

  const handleSubscribe = async () => {
    if (!user?.id) {
      router.push("/auth/login");
      return;
    }

    const plan = plans.find((p) => p.id === selectedPlan);
    if (!plan) return;

    setIsProcessing(true);

    try {
      // Mock payment processing - replace with actual payment integration
      const response = await fetch("/api/subscription/upgrade", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: user.id,
          planId: selectedPlan,
          billingCycle,
          paymentMethod: selectedPayment,
          amount: plan.price,
        }),
      });

      if (!response.ok) {
        throw new Error("Payment processing failed");
      }

      const result = await response.json();

      // Refresh subscription status
      await refreshSubscription();

      // Redirect to success page or dashboard
      router.push("/dashboard?upgrade=success");
    } catch (error) {
      console.error("Subscription upgrade failed:", error);
      // Handle error (show notification, etc.)
    } finally {
      setIsProcessing(false);
    }
  };

  const selectedPlanDetails = plans.find((p) => p.id === selectedPlan);

  // Show loading state while subscription data is loading
  if (subscriptionLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading subscription information...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Choose Your Plan
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Upgrade to unlock advanced features and get priority support for
            your business needs.
          </p>

          {/* Billing Toggle */}
          <div className="flex items-center justify-center mt-8 space-x-4">
            <span
              className={`text-sm ${billingCycle === "monthly" ? "text-gray-900 font-medium" : "text-gray-500"}`}
            >
              Monthly
            </span>
            <button
              onClick={() =>
                setBillingCycle(
                  billingCycle === "monthly" ? "annually" : "monthly",
                )
              }
              className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                billingCycle === "annually" ? "bg-blue-600" : "bg-gray-200"
              }`}
            >
              <span
                className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform ${
                  billingCycle === "annually"
                    ? "translate-x-6"
                    : "translate-x-1"
                }`}
              />
            </button>
            <span
              className={`text-sm ${billingCycle === "annually" ? "text-gray-900 font-medium" : "text-gray-500"}`}
            >
              Annually
              <span className="ml-1 text-green-600 font-semibold">
                Save 17%
              </span>
            </span>
          </div>
        </div>

        {/* Plans Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`relative rounded-2xl border-2 bg-white p-8 shadow-sm transition-all hover:shadow-lg ${
                selectedPlan === plan.id
                  ? "border-blue-600 ring-2 ring-blue-600 ring-opacity-20"
                  : "border-gray-200"
              } ${plan.popular ? "ring-2 ring-blue-600 ring-opacity-20" : ""}`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-blue-600 text-white px-4 py-1 rounded-full text-sm font-medium">
                    Most Popular
                  </span>
                </div>
              )}

              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  {plan.name}
                </h3>
                <div className="mb-4">
                  <span className="text-4xl font-bold text-gray-900">
                    ${plan.price}
                  </span>
                  {plan.price > 0 && (
                    <span className="text-gray-600 ml-2">
                      / {plan.billing === "monthly" ? "month" : "year"}
                    </span>
                  )}
                </div>
                <p className="text-gray-600">{plan.description}</p>
              </div>

              <div className="space-y-4 mb-8">
                {plan.features.map((feature, index) => (
                  <div key={index} className="flex items-start">
                    <div className="flex-shrink-0 mr-3 mt-0.5">
                      {feature.included ? (
                        <svg
                          className="w-5 h-5 text-green-500"
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
                      ) : (
                        <svg
                          className="w-5 h-5 text-gray-300"
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
                      )}
                    </div>
                    <span
                      className={`text-sm ${feature.included ? "text-gray-900" : "text-gray-400"}`}
                    >
                      {feature.name}
                    </span>
                  </div>
                ))}
              </div>

              <button
                onClick={() => handlePlanSelect(plan.id)}
                className={`w-full py-3 px-4 rounded-lg font-semibold text-sm transition-colors ${
                  selectedPlan === plan.id
                    ? "bg-blue-600 text-white hover:bg-blue-700"
                    : plan.id === subscription?.tier
                      ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                      : "bg-gray-100 text-gray-900 hover:bg-gray-200"
                }`}
                disabled={plan.id === subscription?.tier}
              >
                {plan.id === subscription?.tier
                  ? "Current Plan"
                  : selectedPlan === plan.id
                    ? "Selected"
                    : plan.price === 0
                      ? "Get Started"
                      : "Choose Plan"}
              </button>
            </div>
          ))}
        </div>

        {/* Payment Methods */}
        {selectedPlan !== "free" && (
          <div className="max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
              Choose Payment Method
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              {paymentMethods.map((method) => (
                <button
                  key={method.id}
                  onClick={() => handlePaymentSelect(method.id)}
                  className={`p-6 rounded-lg border-2 transition-all text-left ${
                    selectedPayment === method.id
                      ? "border-blue-600 bg-blue-50"
                      : "border-gray-200 bg-white hover:border-gray-300"
                  }`}
                >
                  <div className="flex items-center mb-3">
                    <div
                      className={`mr-3 ${selectedPayment === method.id ? "text-blue-600" : "text-gray-400"}`}
                    >
                      {method.icon}
                    </div>
                    <h3 className="font-semibold text-gray-900">
                      {method.name}
                    </h3>
                  </div>
                  <p className="text-sm text-gray-600">{method.description}</p>
                </button>
              ))}
            </div>

            {/* Checkout Summary */}
            <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Order Summary
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">
                    {selectedPlanDetails?.name} Plan
                  </span>
                  <span className="font-semibold">
                    ${selectedPlanDetails?.price}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Billing</span>
                  <span className="capitalize">{billingCycle}</span>
                </div>
                <div className="border-t pt-3">
                  <div className="flex justify-between">
                    <span className="font-semibold text-gray-900">Total</span>
                    <span className="font-bold text-gray-900">
                      ${selectedPlanDetails?.price}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Subscribe Button */}
            <button
              onClick={handleSubscribe}
              disabled={isProcessing}
              className="w-full bg-blue-600 text-white py-4 px-6 rounded-lg font-semibold text-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isProcessing ? (
                <span className="flex items-center justify-center">
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Processing...
                </span>
              ) : (
                `Subscribe to ${selectedPlanDetails?.name}`
              )}
            </button>

            <p className="text-center text-sm text-gray-500 mt-4">
              By subscribing, you agree to our terms of service and privacy
              policy. You can cancel anytime.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SubscriptionUpgradePage;
