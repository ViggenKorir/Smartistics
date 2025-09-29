"use client";

import React from "react";
import { formatCurrency, formatDate } from "../lib/utils/invoice";

export default function InvoiceTestPage() {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow p-6">
        <h1 className="text-2xl font-bold mb-6">Invoice Hydration Test</h1>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Invoice Number:
            </label>
            <p className="text-lg">—</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Issue Date:
            </label>
            <p className="text-lg">—</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Due Date:
            </label>
            <p className="text-lg">—</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Total:
            </label>
            <p className="text-lg font-bold">{formatCurrency(0, "USD")}</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Client:
            </label>
            <p className="text-lg">—</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Status:
            </label>
            <p className="text-lg capitalize">—</p>
          </div>
        </div>

        <div className="mt-8 p-4 bg-green-50 rounded-md">
          <p className="text-sm text-green-800">
            ⚠️ No sample data present. This page is ready for real data
            integration.
          </p>
        </div>
      </div>
    </div>
  );
}
