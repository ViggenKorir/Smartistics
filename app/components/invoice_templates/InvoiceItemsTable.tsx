"use client";

import React from "react";
import { IInvoiceItem } from "../../lib/types/invoice";
import { formatCurrency } from "../../lib/utils/invoice";

interface InvoiceItemsTableProps {
  items: IInvoiceItem[];
  currency: string;
}

const InvoiceItemsTable: React.FC<InvoiceItemsTableProps> = ({
  items,
  currency,
}) => {
  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        {/* Table Header */}
        <thead>
          <tr className="bg-gray-900 text-white">
            <th className="text-left py-3 px-4 font-semibold text-sm uppercase tracking-wide w-2/5">
              ITEM DESCRIPTION
            </th>
            <th className="text-center py-3 px-4 font-semibold text-sm uppercase tracking-wide w-1/5">
              UNIT PRICE
            </th>
            <th className="text-center py-3 px-4 font-semibold text-sm uppercase tracking-wide w-1/5">
              QUANTITY
            </th>
            <th className="text-right py-3 px-4 font-semibold text-sm uppercase tracking-wide w-1/5">
              AMOUNT
            </th>
          </tr>
        </thead>

        {/* Table Body */}
        <tbody>
          {items.map((item) => (
            <tr
              key={item.id}
              className="border-b border-gray-200 hover:bg-gray-50 transition-colors duration-150 bg-white even:bg-gray-50/50"
            >
              <td className="py-4 px-4">
                <div>
                  <p className="font-medium text-gray-900">
                    {item.description}
                  </p>
                  {item.details && (
                    <p className="text-sm text-gray-600 mt-1">{item.details}</p>
                  )}
                </div>
              </td>
              <td className="py-4 px-4 text-center text-gray-700">
                {formatCurrency(item.unitPrice, currency)}
              </td>
              <td className="py-4 px-4 text-center text-gray-700">
                {item.quantity}
              </td>
              <td className="py-4 px-4 text-right font-medium text-gray-900">
                {formatCurrency(item.amount, currency)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Mobile View */}
      <div className="md:hidden mt-6">
        <div className="space-y-4">
          {items.map((item) => (
            <div
              key={item.id}
              className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm"
            >
              <div className="flex justify-between items-start mb-3">
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900">
                    {item.description}
                  </h3>
                  {item.details && (
                    <p className="text-sm text-gray-600 mt-1">{item.details}</p>
                  )}
                </div>
                <div className="ml-4 text-right">
                  <p className="font-semibold text-gray-900">
                    {formatCurrency(item.amount, currency)}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-600">Unit Price</p>
                  <p className="font-medium text-gray-900">
                    {formatCurrency(item.unitPrice, currency)}
                  </p>
                </div>
                <div>
                  <p className="text-gray-600">Quantity</p>
                  <p className="font-medium text-gray-900">{item.quantity}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Empty State */}
      {items.length === 0 && (
        <div className="text-center py-12">
          <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <svg
              className="w-8 h-8 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No items added
          </h3>
          <p className="text-gray-600">Add items to generate your invoice.</p>
        </div>
      )}
    </div>
  );
};

export default InvoiceItemsTable;
