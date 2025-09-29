"use client";

import React, { useState, useEffect } from 'react';
import ProtectedRoute from '../../components/auth/ProtectedRoute';
import KPICard from '../../components/common/KPICard';
import BarChart from '../../components/charts/BarChart';
import { KPIMetric } from '../../lib/types/dashboard';
import { useAuth } from '../../lib/auth/AuthContext';

interface ROIFormData {
  adSpend: number;
  conversions: number;
  revenue: number;
}

interface ROIMetrics {
  roi: number;
  cpa: number;
  roas: number;
}

const ROICalculatorPage: React.FC = () => {
  const { user } = useAuth();
  const [formData, setFormData] = useState<ROIFormData>({
    adSpend: 0,
    conversions: 0,
    revenue: 0
  });

  const [metrics, setMetrics] = useState<ROIMetrics>({
    roi: 0,
    cpa: 0,
    roas: 0
  });

  const [chartData, setChartData] = useState<any[]>([]);

  // Calculate ROI metrics
  const calculateMetrics = (data: ROIFormData): ROIMetrics => {
    const { adSpend, conversions, revenue } = data;

    if (adSpend === 0) {
      return { roi: 0, cpa: 0, roas: 0 };
    }

    const roi = ((revenue - adSpend) / adSpend) * 100;
    const cpa = conversions > 0 ? adSpend / conversions : 0;
    const roas = revenue / adSpend;

    return {
      roi: Math.round(roi * 100) / 100,
      cpa: Math.round(cpa * 100) / 100,
      roas: Math.round(roas * 100) / 100
    };
  };

  // Update metrics when form data changes
  useEffect(() => {
    const newMetrics = calculateMetrics(formData);
    setMetrics(newMetrics);

    // Update chart data
    setChartData([
      {
        name: 'Ad Spend',
        value: formData.adSpend,
        color: '#EF4444'
      },
      {
        name: 'Revenue',
        value: formData.revenue,
        color: '#10B981'
      },
      {
        name: 'Profit',
        value: Math.max(0, formData.revenue - formData.adSpend),
        color: '#3B82F6'
      }
    ]);
  }, [formData]);

  const handleInputChange = (field: keyof ROIFormData, value: string) => {
    const numericValue = parseFloat(value) || 0;
    setFormData(prev => ({
      ...prev,
      [field]: numericValue
    }));
  };

  const handleReset = () => {
    setFormData({
      adSpend: 0,
      conversions: 0,
      revenue: 0
    });
  };

  const exportToCSV = () => {
    const csvData = [
      ['Metric', 'Value'],
      ['Ad Spend', `$${formData.adSpend}`],
      ['Conversions', formData.conversions.toString()],
      ['Revenue', `$${formData.revenue}`],
      ['ROI %', `${metrics.roi}%`],
      ['CPA', `$${metrics.cpa}`],
      ['ROAS', metrics.roas.toString()]
    ];

    const csvContent = csvData.map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `roi-calculator-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const exportToPDF = () => {
    // Mock PDF export - in production, integrate with a PDF library
    alert('PDF export functionality would be implemented with a library like jsPDF');
  };

  const kpiMetrics: KPIMetric[] = [
    {
      label: 'ROI %',
      value: metrics.roi,
      format: 'percentage',
      status: metrics.roi > 100 ? 'good' : metrics.roi > 50 ? 'warning' : 'critical',
      target: 100
    },
    {
      label: 'CPA',
      value: metrics.cpa,
      format: 'currency',
      status: metrics.cpa < 50 ? 'good' : metrics.cpa < 100 ? 'warning' : 'critical'
    },
    {
      label: 'ROAS',
      value: metrics.roas,
      format: 'decimal',
      status: metrics.roas > 4 ? 'good' : metrics.roas > 2 ? 'warning' : 'critical',
      target: 4
    }
  ];

  return (
    <ProtectedRoute requiredDashboard="ROI Calculator">
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">ROI Calculator</h1>
                <p className="text-gray-600 mt-1">
                  Calculate return on investment for your advertising campaigns
                </p>
              </div>
              <div className="text-sm text-gray-500">
                Welcome, {user?.name}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Input Form */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-6">Input Campaign Data</h2>

                <div className="space-y-6">
                  {/* Ad Spend */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Ad Spend ($)
                    </label>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={formData.adSpend || ''}
                      onChange={(e) => handleInputChange('adSpend', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter ad spend amount"
                    />
                  </div>

                  {/* Conversions */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Conversions
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={formData.conversions || ''}
                      onChange={(e) => handleInputChange('conversions', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter number of conversions"
                    />
                  </div>

                  {/* Revenue */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Revenue ($)
                    </label>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={formData.revenue || ''}
                      onChange={(e) => handleInputChange('revenue', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter total revenue"
                    />
                  </div>

                  {/* Action Buttons */}
                  <div className="flex space-x-3 pt-4">
                    <button
                      onClick={handleReset}
                      className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
                    >
                      Reset
                    </button>
                  </div>
                </div>
              </div>

              {/* Export Buttons */}
              <div className="mt-6 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Export Results</h3>
                <div className="space-y-3">
                  <button
                    onClick={exportToCSV}
                    className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <span>Export CSV</span>
                  </button>
                  <button
                    onClick={exportToPDF}
                    className="w-full px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors flex items-center justify-center space-x-2"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    </svg>
                    <span>Export PDF</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Results Section */}
            <div className="lg:col-span-2 space-y-6">
              {/* KPI Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {kpiMetrics.map((metric, index) => (
                  <KPICard key={index} metric={metric} />
                ))}
              </div>

              {/* Chart */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Financial Overview
                  </h3>
                  <BarChart
                    data={chartData}
                    height={300}
                    title="Campaign Financial Breakdown"
                    xAxisKey="name"
                    dataKeys={['value']}
                  />
                </div>
              </div>

              {/* Summary Table */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Calculation Summary
                  </h3>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-gray-200">
                          <th className="text-left py-3 px-4 font-semibold text-gray-900">Metric</th>
                          <th className="text-right py-3 px-4 font-semibold text-gray-900">Value</th>
                          <th className="text-right py-3 px-4 font-semibold text-gray-900">Formula</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b border-gray-100">
                          <td className="py-3 px-4 text-gray-700">Ad Spend</td>
                          <td className="py-3 px-4 text-right font-medium">${formData.adSpend.toFixed(2)}</td>
                          <td className="py-3 px-4 text-right text-sm text-gray-500">Input</td>
                        </tr>
                        <tr className="border-b border-gray-100">
                          <td className="py-3 px-4 text-gray-700">Revenue</td>
                          <td className="py-3 px-4 text-right font-medium">${formData.revenue.toFixed(2)}</td>
                          <td className="py-3 px-4 text-right text-sm text-gray-500">Input</td>
                        </tr>
                        <tr className="border-b border-gray-100">
                          <td className="py-3 px-4 text-gray-700">Conversions</td>
                          <td className="py-3 px-4 text-right font-medium">{formData.conversions}</td>
                          <td className="py-3 px-4 text-right text-sm text-gray-500">Input</td>
                        </tr>
                        <tr className="border-b border-gray-100">
                          <td className="py-3 px-4 text-gray-700">ROI %</td>
                          <td className="py-3 px-4 text-right font-medium">{metrics.roi}%</td>
                          <td className="py-3 px-4 text-right text-sm text-gray-500">(Revenue - Ad Spend) / Ad Spend × 100</td>
                        </tr>
                        <tr className="border-b border-gray-100">
                          <td className="py-3 px-4 text-gray-700">CPA</td>
                          <td className="py-3 px-4 text-right font-medium">${metrics.cpa}</td>
                          <td className="py-3 px-4 text-right text-sm text-gray-500">Ad Spend / Conversions</td>
                        </tr>
                        <tr>
                          <td className="py-3 px-4 text-gray-700">ROAS</td>
                          <td className="py-3 px-4 text-right font-medium">{metrics.roas}</td>
                          <td className="py-3 px-4 text-right text-sm text-gray-500">Revenue / Ad Spend</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default ROICalculatorPage;
