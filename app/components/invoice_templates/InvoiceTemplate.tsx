"use client";

import React from "react";
import { InvoiceTemplateProps } from "../../lib/types/invoice";
import {
  formatCurrency,
  formatDate,
  formatInvoiceNumber,
} from "../../lib/utils/invoice";
import InvoiceHeader from "./InvoiceHeader";
import InvoiceItemsTable from "./InvoiceItemsTable";
import InvoiceTotals from "./InvoiceTotals";
import InvoiceFooter from "./InvoiceFooter";

const InvoiceTemplate: React.FC<InvoiceTemplateProps> = ({
  invoice,
  onPrint,
  onExportPDF,
  editable = false,
}) => {
  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Action Buttons */}
        {(onPrint || onExportPDF) && (
          <div className="no-print mb-6 flex justify-end space-x-4">
            {onPrint && (
              <button
                onClick={onPrint}
                className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors duration-200 flex items-center space-x-2"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"
                  />
                </svg>
                <span>Print</span>
              </button>
            )}
            {onExportPDF && (
              <button
                onClick={onExportPDF}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200 flex items-center space-x-2"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                <span>Export PDF</span>
              </button>
            )}
          </div>
        )}

        {/* Invoice Container */}
        <div className="print-area bg-white shadow-lg rounded-lg overflow-hidden">
          <div className="p-8">
            {/* Header Section */}
            <InvoiceHeader
              vendor={invoice.vendor}
              client={invoice.client}
              invoiceNumber={invoice.invoiceNumber}
              issueDate={invoice.issueDate}
              dueDate={invoice.dueDate}
              total={invoice.total}
              currency={invoice.currency}
            />

            {/* Items Table */}
            <div className="mt-8">
              <InvoiceItemsTable
                items={invoice.items}
                currency={invoice.currency}
              />
            </div>

            {/* Totals Section */}
            <InvoiceTotals
              subtotal={invoice.subtotal}
              taxRate={invoice.taxRate}
              taxAmount={invoice.taxAmount}
              total={invoice.total}
              currency={invoice.currency}
            />

            {/* Footer Section */}
            <InvoiceFooter
              vendor={invoice.vendor}
              termsAndConditions={invoice.termsAndConditions}
              signature={invoice.signature}
            />
          </div>
        </div>

        {/* Invoice Summary for Mobile */}
        <div className="mt-6 bg-white rounded-lg shadow p-6 sm:hidden">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Invoice Summary
          </h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">Invoice:</span>
              <span className="font-medium">
                {formatInvoiceNumber(invoice.invoiceNumber)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Date:</span>
              <span className="font-medium">
                {formatDate(invoice.issueDate)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Due Date:</span>
              <span className="font-medium">{formatDate(invoice.dueDate)}</span>
            </div>
            <div className="flex justify-between border-t pt-2">
              <span className="text-gray-600">Total:</span>
              <span className="font-bold text-lg">
                {formatCurrency(invoice.total, invoice.currency)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoiceTemplate;
