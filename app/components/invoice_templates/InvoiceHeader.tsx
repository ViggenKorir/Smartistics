"use client";

import React from "react";
import Image from "next/image";
import { IVendor, IClient } from "../../lib/types/invoice";
import {
  formatCurrency,
  formatDate,
  formatInvoiceNumber,
} from "../../lib/utils/invoice";

interface InvoiceHeaderProps {
  vendor: IVendor;
  client: IClient;
  invoiceNumber: string;
  issueDate: Date | string;
  dueDate: Date | string;
  total: number;
  currency: string;
}

const InvoiceHeader: React.FC<InvoiceHeaderProps> = ({
  vendor,
  client,
  invoiceNumber,
  issueDate,
  dueDate,
  total,
  currency,
}) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
      {/* Left Section - Company & Client Info */}
      <div className="space-y-8">
        {/* Company Branding */}
        <div>
          {vendor.logo ? (
            <Image
              src={vendor.logo}
              alt={vendor.name}
              width={200}
              height={48}
              className="h-12 w-auto mb-2"
            />
          ) : (
            <div className="mb-2">
              <h1 className="text-2xl font-bold text-gray-900">
                {vendor.name}
              </h1>
            </div>
          )}
          {vendor.slogan && (
            <p className="text-sm text-gray-600">{vendor.slogan}</p>
          )}
        </div>

        {/* Invoice To Section */}
        <div>
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
            INVOICE TO
          </h2>
          <div className="space-y-1">
            <p className="font-semibold text-gray-900">{client.name}</p>
            {client.company && (
              <p className="text-gray-600">{client.company}</p>
            )}
            <p className="text-gray-600 whitespace-pre-line">
              {client.address}
            </p>
            <p className="text-gray-600">{client.phone}</p>
            {client.email && <p className="text-gray-600">{client.email}</p>}
          </div>
        </div>
      </div>

      {/* Right Section - Invoice Details */}
      <div className="space-y-6 lg:text-right">
        {/* Invoice Title */}
        <div className="inline-block lg:block">
          <div className="bg-gray-900 text-white px-8 py-4 rounded-sm">
            <h1 className="text-3xl font-bold">INVOICE</h1>
            <p className="text-sm mt-1 opacity-90">
              Invoice No: {formatInvoiceNumber(invoiceNumber)}
            </p>
          </div>
        </div>

        {/* Invoice Details */}
        <div className="space-y-4">
          {/* Total Due */}
          <div className="bg-gray-50 p-4 rounded-sm">
            <p className="text-sm text-gray-600 mb-1">Total Due</p>
            <p className="text-xl font-semibold text-gray-900">
              {currency.toUpperCase()}: {formatCurrency(total, currency)}
            </p>
          </div>

          {/* Dates */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600 mb-1">Date</p>
              <p className="font-medium text-gray-900">
                {formatDate(issueDate, "DD-MMM-YYYY")}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Due Date</p>
              <p className="font-medium text-gray-900">
                {formatDate(dueDate, "DD-MMM-YYYY")}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoiceHeader;
