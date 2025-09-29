import { NextRequest, NextResponse } from "next/server";

interface UpgradeRequest {
  userId: string;
  planId: "free" | "plus" | "premium";
  billingCycle: "monthly" | "annually";
  paymentMethod: "card" | "mpesa" | "paypal";
  amount: number;
  currency?: string;
}

interface PaymentResult {
  success: boolean;
  transactionId?: string;
  error?: string;
}

// Mock payment processing functions
const processCardPayment = async (amount: number, currency: string): Promise<PaymentResult> => {
  // Simulate payment processing delay
  await new Promise(resolve => setTimeout(resolve, 1000));

  // Mock 95% success rate
  const success = Math.random() > 0.05;

  if (success) {
    return {
      success: true,
      transactionId: `card_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    };
  } else {
    return {
      success: false,
      error: "Card payment declined. Please check your card details.",
    };
  }
};

const processMpesaPayment = async (amount: number, currency: string): Promise<PaymentResult> => {
  await new Promise(resolve => setTimeout(resolve, 1500));

  const success = Math.random() > 0.03;

  if (success) {
    return {
      success: true,
      transactionId: `mpesa_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    };
  } else {
    return {
      success: false,
      error: "M-Pesa payment failed. Please ensure you have sufficient balance.",
    };
  }
};

const processPaypalPayment = async (amount: number, currency: string): Promise<PaymentResult> => {
  await new Promise(resolve => setTimeout(resolve, 800));

  const success = Math.random() > 0.04;

  if (success) {
    return {
      success: true,
      transactionId: `paypal_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    };
  } else {
    return {
      success: false,
      error: "PayPal payment failed. Please check your PayPal account.",
    };
  }
};

const processPayment = async (
  paymentMethod: string,
  amount: number,
  currency: string
): Promise<PaymentResult> => {
  switch (paymentMethod) {
    case "card":
      return processCardPayment(amount, currency);
    case "mpesa":
      return processMpesaPayment(amount, currency);
    case "paypal":
      return processPaypalPayment(amount, currency);
    default:
      return {
        success: false,
        error: "Unsupported payment method",
      };
  }
};

const updateSubscription = async (
  userId: string,
  planId: string,
  billingCycle: string,
  amount: number,
  paymentMethod: string,
  transactionId: string
) => {
  // In a real application, this would update the database
  // For now, we'll simulate the database update

  const expiryDate = billingCycle === "monthly"
    ? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days
    : new Date(Date.now() + 365 * 24 * 60 * 60 * 1000); // 365 days

  const nextBillingDate = new Date(expiryDate);

  const subscriptionUpdate = {
    userId,
    tier: planId,
    status: "active",
    expiryDate: expiryDate.toISOString(),
    nextBillingDate: nextBillingDate.toISOString(),
    amount,
    currency: "USD",
    paymentStatus: "active",
    paymentMethod,
    billingCycle,
    transactionId,
    updatedAt: new Date().toISOString(),
  };

  // Mock database update
  console.log("Subscription updated:", subscriptionUpdate);

  return subscriptionUpdate;
};

export async function POST(request: NextRequest) {
  try {
    const body: UpgradeRequest = await request.json();

    // Validate required fields
    const { userId, planId, billingCycle, paymentMethod, amount } = body;

    if (!userId || !planId || !billingCycle || !paymentMethod || amount === undefined) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Validate plan ID
    if (!["free", "plus", "premium"].includes(planId)) {
      return NextResponse.json(
        { error: "Invalid plan ID" },
        { status: 400 }
      );
    }

    // Validate payment method
    if (!["card", "mpesa", "paypal"].includes(paymentMethod)) {
      return NextResponse.json(
        { error: "Invalid payment method" },
        { status: 400 }
      );
    }

    // Free plan doesn't require payment
    if (planId === "free") {
      const subscription = await updateSubscription(
        userId,
        planId,
        billingCycle,
        0,
        "none",
        `free_${Date.now()}`
      );

      return NextResponse.json({
        success: true,
        message: "Successfully downgraded to free plan",
        subscription,
      });
    }

    // Validate amount for paid plans
    const expectedAmounts = {
      plus: { monthly: 12, annually: 120 },
      premium: { monthly: 16, annually: 160 },
    };

    const expectedAmount = expectedAmounts[planId as keyof typeof expectedAmounts]?.[billingCycle as keyof typeof expectedAmounts.plus];

    if (amount !== expectedAmount) {
      return NextResponse.json(
        { error: "Invalid amount for selected plan" },
        { status: 400 }
      );
    }

    // Process payment
    console.log(`Processing ${paymentMethod} payment for $${amount}`);
    const paymentResult = await processPayment(paymentMethod, amount, body.currency || "USD");

    if (!paymentResult.success) {
      return NextResponse.json(
        {
          success: false,
          error: paymentResult.error || "Payment processing failed"
        },
        { status: 400 }
      );
    }

    // Update subscription after successful payment
    const subscription = await updateSubscription(
      userId,
      planId,
      billingCycle,
      amount,
      paymentMethod,
      paymentResult.transactionId!
    );

    // Send confirmation email (mock)
    console.log(`Sending confirmation email to user ${userId}`);

    return NextResponse.json({
      success: true,
      message: `Successfully upgraded to ${planId} plan`,
      subscription,
      transactionId: paymentResult.transactionId,
    });

  } catch (error) {
    console.error("Subscription upgrade error:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Internal server error. Please try again later."
      },
      { status: 500 }
    );
  }
}

// Handle OPTIONS for CORS
export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    },
  });
}
