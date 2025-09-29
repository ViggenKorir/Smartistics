import { NextRequest, NextResponse } from "next/server";

interface SubscriptionData {
  userId: string;
  tier: "free" | "plus" | "premium";
  status: "active" | "pending" | "expired" | "cancelled";
  expiryDate: string | null;
  nextBillingDate: string | null;
  amount: number;
  currency: string;
  paymentStatus: string;
  paymentMethod: string | null;
  createdAt: string;
  updatedAt: string;
}

// Mock subscription data for testing different scenarios
const mockSubscriptions: Record<string, SubscriptionData> = {
  "user1": {
    userId: "user1",
    tier: "free",
    status: "active",
    expiryDate: null,
    nextBillingDate: null,
    amount: 0,
    currency: "USD",
    paymentStatus: "active",
    paymentMethod: null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  "user2": {
    userId: "user2",
    tier: "plus",
    status: "active",
    expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days from now
    nextBillingDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    amount: 12,
    currency: "USD",
    paymentStatus: "active",
    paymentMethod: "card",
    createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  "user3": {
    userId: "user3",
    tier: "plus",
    status: "expired",
    expiryDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago
    nextBillingDate: null,
    amount: 12,
    currency: "USD",
    paymentStatus: "failed",
    paymentMethod: "card",
    createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
  },
  "user4": {
    userId: "user4",
    tier: "premium",
    status: "expired",
    expiryDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(), // 10 days ago (lockout)
    nextBillingDate: null,
    amount: 16,
    currency: "USD",
    paymentStatus: "failed",
    paymentMethod: "paypal",
    createdAt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
  },
};

export async function GET(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    const { userId } = params;

    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    // In a real application, you would fetch from database
    // For now, we'll use mock data or default to free tier
    const subscription = mockSubscriptions[userId] || {
      userId,
      tier: "free",
      status: "active",
      expiryDate: null,
      nextBillingDate: null,
      amount: 0,
      currency: "USD",
      paymentStatus: "active",
      paymentMethod: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    return NextResponse.json(subscription, { status: 200 });
  } catch (error) {
    console.error("Error fetching subscription:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    const { userId } = params;
    const body = await request.json();

    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    // In a real application, you would update the database
    // For now, we'll just return the updated mock data
    const currentSubscription = mockSubscriptions[userId] || {
      userId,
      tier: "free",
      status: "active",
      expiryDate: null,
      nextBillingDate: null,
      amount: 0,
      currency: "USD",
      paymentStatus: "active",
      paymentMethod: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const updatedSubscription = {
      ...currentSubscription,
      ...body,
      updatedAt: new Date().toISOString(),
    };

    // Update mock data
    mockSubscriptions[userId] = updatedSubscription;

    return NextResponse.json(updatedSubscription, { status: 200 });
  } catch (error) {
    console.error("Error updating subscription:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
