"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import PaymentMethods, {
  PaymentMethod,
  PaymentData,
} from "../components/payment/PaymentMethods";

interface PaymentPlan {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  description: string;
  features: string[];
  popular?: boolean;
  billingPeriod: "monthly" | "yearly";
}

interface MockTransaction {
  id: string;
  amount: number;
  currency: string;
  method: PaymentMethod;
  status: "pending" | "success" | "failed";
  createdAt: Date;
  planId: string;
}

const PaymentPage: React.FC = () => {
  const router = useRouter();
  const [selectedPlan, setSelectedPlan] = useState<PaymentPlan | null>(null);
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">(
    "monthly",
  );
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>("card");
  const [paymentData, setPaymentData] = useState<PaymentData | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [transaction, setTransaction] = useState<MockTransaction | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [step, setStep] = useState<"plan" | "payment" | "confirmation">("plan");

  // Payment plans configuration
  const paymentPlans: PaymentPlan[] = [
    {
      id: "starter",
      name: "Starter",
      price: billingCycle === "monthly" ? 9.99 : 99.99,
      originalPrice: billingCycle === "yearly" ? 119.88 : undefined,
      description: "Perfect for small businesses getting started",
      features: [
        "Up to 5 team members",
        "10GB storage",
        "Basic analytics",
        "Email support",
        "Standard integrations",
      ],
      billingPeriod: billingCycle,
    },
    {
      id: "professional",
      name: "Professional",
      price: billingCycle === "monthly" ? 29.99 : 299.99,
      originalPrice: billingCycle === "yearly" ? 359.88 : undefined,
      description: "Ideal for growing teams and businesses",
      features: [
        "Up to 25 team members",
        "100GB storage",
        "Advanced analytics",
        "Priority support",
        "All integrations",
        "Custom workflows",
        "API access",
      ],
      popular: true,
      billingPeriod: billingCycle,
    },
    {
      id: "enterprise",
      name: "Enterprise",
      price: billingCycle === "monthly" ? 59.99 : 599.99,
      originalPrice: billingCycle === "yearly" ? 719.88 : undefined,
      description: "For large organizations with advanced needs",
      features: [
        "Unlimited team members",
        "Unlimited storage",
        "Enterprise analytics",
        "24/7 phone support",
        "Custom integrations",
        "Advanced security",
        "Dedicated account manager",
        "SLA guarantee",
      ],
      billingPeriod: billingCycle,
    },
  ];

  // Mock payment processor
  const mockPaymentProcessor = async (
    method: PaymentMethod,
    amount: number,
    data: PaymentData,
    planId: string,
  ): Promise<MockTransaction> => {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 3000));

    // Simulate 92% success rate
    const success = Math.random() > 0.08;

    if (!success) {
      const errorMessages = {
        card: "Your card was declined. Please check your card details or try a different card.",
        mpesa:
          "M-Pesa transaction failed. Please ensure you have sufficient balance and try again.",
        paypal:
          "PayPal payment could not be processed. Please check your PayPal account.",
      };
      throw new Error(errorMessages[method]);
    }

    return {
      id: `smartistics_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      amount,
      currency: "USD",
      method,
      status: "success",
      createdAt: new Date(),
      planId,
    };
  };

  const handlePlanSelect = (plan: PaymentPlan) => {
    setSelectedPlan(plan);
    setStep("payment");
    setError(null);
    setTransaction(null);
  };

  const handlePaymentProcess = async () => {
    if (!selectedPlan || !paymentData || !paymentData.isValid) {
      setError("Please complete all required payment information.");
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      const result = await mockPaymentProcessor(
        selectedMethod,
        selectedPlan.price,
        paymentData,
        selectedPlan.id,
      );
      setTransaction(result);
      setStep("confirmation");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Payment processing failed",
      );
    } finally {
      setIsProcessing(false);
    }
  };

  const resetFlow = () => {
    setStep("plan");
    setSelectedPlan(null);
    setTransaction(null);
    setError(null);
    setPaymentData(null);
  };

  const handleBackToPlan = () => {
    setStep("plan");
    setError(null);
  };

  // Calculate savings for yearly billing
  const calculateSavings = (plan: PaymentPlan) => {
    if (plan.originalPrice && plan.billingPeriod === "yearly") {
      const savings = plan.originalPrice - plan.price;
      const percentage = Math.round((savings / plan.originalPrice) * 100);
      return { amount: savings, percentage };
    }
    return null;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Choose Your Smartistics Plan
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Unlock powerful analytics and insights for your business with our
            flexible pricing plans
          </p>

          {/* Billing Toggle */}
          <div className="flex items-center justify-center mt-8 space-x-4">
            <span
              className={`text-sm font-medium ${billingCycle === "monthly" ? "text-gray-900" : "text-gray-500"}`}
            >
              Monthly
            </span>
            <button
              onClick={() =>
                setBillingCycle(
                  billingCycle === "monthly" ? "yearly" : "monthly",
                )
              }
              className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                billingCycle === "yearly" ? "bg-blue-600" : "bg-gray-200"
              }`}
            >
              <span
                className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform ${
                  billingCycle === "yearly" ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
            <span
              className={`text-sm font-medium ${billingCycle === "yearly" ? "text-gray-900" : "text-gray-500"}`}
            >
              Yearly
              <span className="ml-1 text-green-600 font-semibold text-xs">
                Save up to 17%
              </span>
            </span>
          </div>
        </div>

        {/* Step Indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-center">
            <div className="flex items-center space-x-4">
              {["plan", "payment", "confirmation"].map((stepName, index) => (
                <React.Fragment key={stepName}>
                  <div
                    className={`flex items-center ${
                      step === stepName ||
                      (stepName === "confirmation" && transaction)
                        ? "text-blue-600"
                        : step === "payment" && stepName === "plan"
                          ? "text-green-600"
                          : "text-gray-400"
                    }`}
                  >
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${
                        step === stepName ||
                        (stepName === "confirmation" && transaction)
                          ? "border-blue-600 bg-blue-50"
                          : step === "payment" && stepName === "plan"
                            ? "border-green-600 bg-green-50"
                            : "border-gray-300"
                      }`}
                    >
                      {step === "payment" && stepName === "plan" ? (
                        <svg
                          className="w-5 h-5 text-green-600"
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
                      ) : stepName === "confirmation" && transaction ? (
                        <svg
                          className="w-5 h-5 text-blue-600"
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
                        <span className="text-sm font-medium">{index + 1}</span>
                      )}
                    </div>
                    <span className="ml-2 text-sm font-medium capitalize hidden sm:inline">
                      {stepName === "plan"
                        ? "Choose Plan"
                        : stepName === "payment"
                          ? "Payment"
                          : "Confirmation"}
                    </span>
                  </div>
                  {index < 2 && (
                    <div
                      className={`w-8 h-0.5 ${
                        (step === "payment" && index === 0) ||
                        (step === "confirmation" && index <= 1)
                          ? "bg-green-600"
                          : "bg-gray-300"
                      }`}
                    />
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>

        {/* Step 1: Plan Selection */}
        {step === "plan" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {paymentPlans.map((plan) => {
              const savings = calculateSavings(plan);
              return (
                <div
                  key={plan.id}
                  className={`relative bg-white rounded-2xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl ${
                    plan.popular
                      ? "ring-2 ring-blue-500 transform scale-105"
                      : ""
                  }`}
                >
                  {plan.popular && (
                    <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                      <span className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-full text-sm font-semibold">
                        Most Popular
                      </span>
                    </div>
                  )}

                  <div className="p-8">
                    <div className="text-center mb-8">
                      <h3 className="text-2xl font-bold text-gray-900 mb-2">
                        {plan.name}
                      </h3>
                      <p className="text-gray-600 mb-4">{plan.description}</p>

                      <div className="mb-4">
                        <div className="flex items-baseline justify-center">
                          <span className="text-4xl font-bold text-gray-900">
                            ${plan.price}
                          </span>
                          <span className="text-gray-500 ml-2">
                            /{plan.billingPeriod}
                          </span>
                        </div>

                        {savings && (
                          <div className="mt-2">
                            <span className="text-sm text-gray-500 line-through">
                              ${plan.originalPrice}
                            </span>
                            <span className="ml-2 text-sm font-semibold text-green-600">
                              Save ${savings.amount} ({savings.percentage}%)
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    <ul className="space-y-4 mb-8">
                      {plan.features.map((feature, index) => (
                        <li key={index} className="flex items-start">
                          <div className="flex-shrink-0 w-5 h-5 bg-green-100 rounded-full flex items-center justify-center mr-3 mt-0.5">
                            <svg
                              className="w-3 h-3 text-green-600"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={3}
                                d="M5 13l4 4L19 7"
                              />
                            </svg>
                          </div>
                          <span className="text-gray-700">{feature}</span>
                        </li>
                      ))}
                    </ul>

                    <button
                      onClick={() => handlePlanSelect(plan)}
                      className={`w-full py-4 px-6 rounded-xl font-semibold text-lg transition-all duration-300 ${
                        plan.popular
                          ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl"
                          : "bg-gray-100 text-gray-900 hover:bg-gray-200 border-2 border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      Get Started
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Step 2: Payment */}
        {step === "payment" && selectedPlan && (
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Payment Form */}
              <div className="lg:col-span-2">
                <div className="bg-white rounded-2xl shadow-lg p-8">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-gray-900">
                      Payment Details
                    </h2>
                    <button
                      onClick={handleBackToPlan}
                      className="text-blue-600 hover:text-blue-700 font-medium flex items-center"
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
                          d="M15 19l-7-7 7-7"
                        />
                      </svg>
                      Change Plan
                    </button>
                  </div>

                  <PaymentMethods
                    selectedMethod={selectedMethod}
                    onMethodChange={setSelectedMethod}
                    onPaymentDataChange={setPaymentData}
                    amount={selectedPlan.price}
                    currency="USD"
                  />

                  {/* Error Display */}
                  {error && (
                    <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                      <div className="flex">
                        <svg
                          className="w-5 h-5 text-red-400 mt-0.5 mr-3"
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
                        <div>
                          <h3 className="text-sm font-medium text-red-800">
                            Payment Error
                          </h3>
                          <p className="text-sm text-red-700 mt-1">{error}</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Process Payment Button */}
                  <div className="mt-8 pt-6 border-t border-gray-200">
                    <button
                      onClick={handlePaymentProcess}
                      disabled={isProcessing || !paymentData?.isValid}
                      className={`w-full py-4 px-6 rounded-xl font-semibold text-lg transition-all duration-300 ${
                        isProcessing || !paymentData?.isValid
                          ? "bg-gray-400 cursor-not-allowed text-white"
                          : "bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl"
                      }`}
                    >
                      {isProcessing ? (
                        <div className="flex items-center justify-center">
                          <svg
                            className="animate-spin -ml-1 mr-3 h-5 w-5"
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
                            />
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            />
                          </svg>
                          Processing Payment...
                        </div>
                      ) : (
                        `Complete Payment - $${selectedPlan.price}`
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {/* Order Summary */}
              <div className="lg:col-span-1">
                <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-6 sticky top-8">
                  <h3 className="text-xl font-bold text-gray-900 mb-6">
                    Order Summary
                  </h3>

                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-gray-900">
                        {selectedPlan.name} Plan
                      </span>
                      <span className="font-bold text-gray-900">
                        ${selectedPlan.price}
                      </span>
                    </div>

                    <div className="flex justify-between items-center text-sm text-gray-600">
                      <span>Billing Period</span>
                      <span className="capitalize">
                        {selectedPlan.billingPeriod}
                      </span>
                    </div>

                    {calculateSavings(selectedPlan) && (
                      <div className="flex justify-between items-center text-sm text-green-600">
                        <span>Yearly Savings</span>
                        <span>-${calculateSavings(selectedPlan)?.amount}</span>
                      </div>
                    )}

                    <hr className="border-gray-200" />

                    <div className="flex justify-between items-center text-lg font-bold text-gray-900">
                      <span>Total</span>
                      <span>${selectedPlan.price}</span>
                    </div>
                  </div>

                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <div className="flex items-center text-sm text-gray-600">
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
                          d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                        />
                      </svg>
                      <span>Secure 256-bit SSL encryption</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600 mt-2">
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
                          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      <span>Cancel anytime</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Confirmation */}
        {step === "confirmation" && transaction && selectedPlan && (
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg
                  className="w-8 h-8 text-green-600"
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
              </div>

              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Payment Successful!
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                Welcome to Smartistics {selectedPlan.name}! Your account has
                been upgraded successfully.
              </p>

              <div className="bg-gray-50 rounded-xl p-6 mb-8">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="text-left">
                    <span className="font-medium text-gray-700">
                      Transaction ID:
                    </span>
                    <p className="text-gray-900 font-mono">{transaction.id}</p>
                  </div>
                  <div className="text-left">
                    <span className="font-medium text-gray-700">Amount:</span>
                    <p className="text-gray-900">${transaction.amount} USD</p>
                  </div>
                  <div className="text-left">
                    <span className="font-medium text-gray-700">Plan:</span>
                    <p className="text-gray-900">{selectedPlan.name}</p>
                  </div>
                  <div className="text-left">
                    <span className="font-medium text-gray-700">
                      Payment Method:
                    </span>
                    <p className="text-gray-900 capitalize">
                      {transaction.method}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={() => router.push("/dashboard")}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300"
                >
                  Go to Dashboard
                </button>
                <button
                  onClick={resetFlow}
                  className="flex-1 bg-gray-200 text-gray-800 px-6 py-3 rounded-xl font-semibold hover:bg-gray-300 transition-colors"
                >
                  Start New Purchase
                </button>
              </div>

              <p className="text-sm text-gray-500 mt-6">
                A confirmation email has been sent to your registered email
                address.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentPage;
