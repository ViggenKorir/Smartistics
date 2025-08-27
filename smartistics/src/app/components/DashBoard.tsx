"use client";
import React, { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts";
import {
  DollarSign,
  TrendingUp,
  Target,
  Users,
  PlusCircle,
  Settings,
  Bell,
  Menu,
  X,
  Play,
  Smartphone,
  Globe,
  ArrowUpRight,
} from "lucide-react";

// ---- Types ----
interface Campaign {
  platform: string;
  spend: number;
  revenue: number;
  roas: number;
  impressions: number;
  clicks: number;
  conversions: number;
}

interface TimelinePoint {
  date: string;
  facebook: number;
  google: number;
  instagram: number;
  overall: number;
}

interface BudgetOptimization {
  platform: string;
  current: number;
  recommended: number;
  impact: string; // e.g. "+R890"
}

type Tab = "dashboard" | "campaigns" | "optimization" | "insights" | "pricing";

// ---- Component ----
const AdOptimaAfrica: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>("dashboard");
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([
    "facebook",
    "google",
    "instagram",
  ]);
  const [optimizationRunning, setOptimizationRunning] =
    useState<boolean>(false);
  const [form, setForm] = useState({
    platform: "",
    spend: 0,
    revenue: 0,
    roas: 0,
    impressions: 0,
    clicks: 0,
    conversions: 0,
  });
  const [apiResponse, setApiResponse] = useState<string | null>(null);

  // ---- Sample data ----
  const campaignData: Campaign[] = [
    {
      platform: "Facebook",
      spend: 1250,
      revenue: 3750,
      roas: 3.0,
      impressions: 45000,
      clicks: 890,
      conversions: 67,
    },
    {
      platform: "Google Ads",
      spend: 2100,
      revenue: 7350,
      roas: 3.5,
      impressions: 67000,
      clicks: 1340,
      conversions: 94,
    },
    {
      platform: "Instagram",
      spend: 850,
      revenue: 2125,
      roas: 2.5,
      impressions: 32000,
      clicks: 640,
      conversions: 43,
    },
    {
      platform: "LinkedIn",
      spend: 650,
      revenue: 1950,
      roas: 3.0,
      impressions: 18000,
      clicks: 270,
      conversions: 28,
    },
    {
      platform: "TikTok",
      spend: 400,
      revenue: 800,
      roas: 2.0,
      impressions: 28000,
      clicks: 560,
      conversions: 18,
    },
  ];

  const timelineData: TimelinePoint[] = [
    { date: "Jan", facebook: 2.8, google: 3.2, instagram: 2.3, overall: 2.8 },
    { date: "Feb", facebook: 3.1, google: 3.4, instagram: 2.6, overall: 3.0 },
    { date: "Mar", facebook: 2.9, google: 3.6, instagram: 2.4, overall: 3.1 },
    { date: "Apr", facebook: 3.2, google: 3.8, instagram: 2.7, overall: 3.3 },
    { date: "May", facebook: 3.0, google: 3.5, instagram: 2.5, overall: 3.2 },
    { date: "Jun", facebook: 3.4, google: 3.9, instagram: 2.8, overall: 3.5 },
  ];

  const budgetOptimization: BudgetOptimization[] = [
    { platform: "Google Ads", current: 35, recommended: 42, impact: "+R890" },
    { platform: "Facebook", current: 30, recommended: 28, impact: "-R320" },
    { platform: "Instagram", current: 20, recommended: 18, impact: "-R180" },
    { platform: "LinkedIn", current: 10, recommended: 8, impact: "-R150" },
    { platform: "TikTok", current: 5, recommended: 4, impact: "-R80" },
  ];

  const COLORS: string[] = [
    "#3B82F6",
    "#10B981",
    "#F59E0B",
    "#EF4444",
    "#8B5CF6",
  ];

  // ---- Derived values ----
  const totalSpend = campaignData.reduce((sum, p) => sum + p.spend, 0);
  const totalRevenue = campaignData.reduce((sum, p) => sum + p.revenue, 0);
  const overallROAS = totalRevenue / totalSpend;
  const totalConversions = campaignData.reduce(
    (sum, p) => sum + p.conversions,
    0
  );

  // ---- Side Effects ----
  useEffect(() => {
    if (optimizationRunning) {
      const timer = setTimeout(() => setOptimizationRunning(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [optimizationRunning]);

  // ---- Insights Section ----
  const Insights: React.FC = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">
        Market Insights & Analytics
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            African Market Trends
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <div className="font-medium text-gray-900">
                  Mobile-First Shopping Trend
                </div>
                <div className="text-sm text-gray-600">
                  87% of African consumers prefer mobile ads
                </div>
              </div>
              <Smartphone className="h-6 w-6 text-blue-600" />
            </div>

            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <div className="font-medium text-gray-900">
                  Cross-Border Commerce Growth
                </div>
                <div className="text-sm text-gray-600">
                  E-commerce expected to grow 15% YoY across Africa
                </div>
              </div>
              <Globe className="h-6 w-6 text-green-600" />
            </div>

            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <div className="font-medium text-gray-900">
                  Rising Social Media Influence
                </div>
                <div className="text-sm text-gray-600">
                  65% of ad engagement now comes from social channels
                </div>
              </div>
              <TrendingUp className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Conversion Funnel Snapshot
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={campaignData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="platform" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="impressions" fill="#3B82F6" name="Impressions" />
              <Bar dataKey="clicks" fill="#10B981" name="Clicks" />
              <Bar dataKey="conversions" fill="#F59E0B" name="Conversions" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );

  // ---- API Submit Handler ----
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setApiResponse(null);
    try {
      const res = await fetch("/api/campaign", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      setApiResponse(data.message);
    } catch (err) {
      setApiResponse("Error sending data");
    }
  };

  // ---- Render Main Layout ----
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navigation */}
      {/* TODO: integrate Navigation component here */}

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {/* --- Add API Test Form --- */}
        <form
          onSubmit={handleSubmit}
          className="bg-white p-4 rounded shadow mb-6 max-w-xl"
        >
          <h2 className="font-bold mb-2">Test Campaign API</h2>
          <div className="grid grid-cols-2 gap-2">
            <input
              className="border p-2 rounded"
              placeholder="Platform"
              value={form.platform}
              onChange={(e) =>
                setForm((f) => ({ ...f, platform: e.target.value }))
              }
              required
            />
            <input
              className="border p-2 rounded"
              placeholder="Spend"
              type="number"
              value={form.spend}
              onChange={(e) =>
                setForm((f) => ({ ...f, spend: Number(e.target.value) }))
              }
              required
            />
            <input
              className="border p-2 rounded"
              placeholder="Revenue"
              type="number"
              value={form.revenue}
              onChange={(e) =>
                setForm((f) => ({ ...f, revenue: Number(e.target.value) }))
              }
              required
            />
            <input
              className="border p-2 rounded"
              placeholder="ROAS"
              type="number"
              value={form.roas}
              onChange={(e) =>
                setForm((f) => ({ ...f, roas: Number(e.target.value) }))
              }
              required
            />
            <input
              className="border p-2 rounded"
              placeholder="Impressions"
              type="number"
              value={form.impressions}
              onChange={(e) =>
                setForm((f) => ({ ...f, impressions: Number(e.target.value) }))
              }
              required
            />
            <input
              className="border p-2 rounded"
              placeholder="Clicks"
              type="number"
              value={form.clicks}
              onChange={(e) =>
                setForm((f) => ({ ...f, clicks: Number(e.target.value) }))
              }
              required
            />
            <input
              className="border p-2 rounded"
              placeholder="Conversions"
              type="number"
              value={form.conversions}
              onChange={(e) =>
                setForm((f) => ({ ...f, conversions: Number(e.target.value) }))
              }
              required
            />
          </div>
          <button
            type="submit"
            className="mt-3 px-4 py-2 bg-blue-600 text-white rounded"
          >
            Send to API
          </button>
          {apiResponse && (
            <div className="mt-2 text-green-700">{apiResponse}</div>
          )}
        </form>

        {activeTab === "dashboard" && <div> {/* Dashboard Component */} </div>}
        {activeTab === "campaigns" && <div> {/* Campaigns Component */} </div>}
        {activeTab === "optimization" && (
          <div>{/* Optimization Component */}</div>
        )}
        {activeTab === "insights" && <Insights />}
        {activeTab === "pricing" && (
          <div className="text-gray-700">Pricing coming soon...</div>
        )}
      </main>
    </div>
  );
};

export default AdOptimaAfrica;
