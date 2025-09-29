'use client';

import React from 'react';
import { formatCurrency } from '../../lib/utils/invoice';

interface InvoiceTotalsProps {
  subtotal: number;
  taxRate: number;
  taxAmount: number;
  total: number;
  currency: string;
}

const InvoiceTotals: React.FC<InvoiceTotalsProps> = ({
  subtotal,
  taxRate,
  taxAmount,
  total,
  currency
}) => {
  return (
    <div className="mt-8 flex justify-end">
      <div className="w-full max-w-sm">
        {/* Subtotal */}
        <div className="flex justify-between items-center py-2 border-b border-gray-200">
          <span className="text-gray-600 font-medium">SUB TOTAL</span>
          <span className="text-gray-900 font-semibold">
            {formatCurrency(subtotal, currency)}
          </span>
        </div>

        {/* Tax */}
        <div className="flex justify-between items-center py-2 border-b border-gray-200">
          <span className="text-gray-600 font-medium">Tax VAT {taxRate}%</span>
          <span className="text-gray-900 font-semibold">
            {formatCurrency(taxAmount, currency)}
          </span>
        </div>

        {/* Grand Total */}
        <div className="bg-gray-900 text-white px-4 py-3 mt-2 rounded-sm">
          <div className="flex justify-between items-center">
            <span className="font-bold text-lg uppercase tracking-wide">GRAND TOTAL</span>
            <span className="font-bold text-lg">
              {formatCurrency(total, currency)}
            </span>
          </div>
        </div>

        {/* Mobile Summary */}
        <div className="md:hidden mt-4 bg-gray-50 p-4 rounded-lg">
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Subtotal:</span>
              <span className="text-sm font-medium text-gray-900">
                {formatCurrency(subtotal, currency)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Tax ({taxRate}%):</span>
              <span className="text-sm font-medium text-gray-900">
                {formatCurrency(taxAmount, currency)}
              </span>
            </div>
            <div className="flex justify-between pt-3 border-t border-gray-200">
              <span className="font-bold text-gray-900">Total:</span>
              <span className="font-bold text-lg text-gray-900">
                {formatCurrency(total, currency)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoiceTotals;
