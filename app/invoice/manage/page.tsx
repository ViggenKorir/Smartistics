"use client";

import React, { useState } from "react";
import InvoiceList from "../../components/invoice/InvoiceList";
import InvoiceForm from "../../components/invoice/InvoiceForm";
import { IInvoice } from "../../lib/types/invoice";
import Link from "next/link";

export default function InvoiceManagementPage() {
  const [selectedInvoice, setSelectedInvoice] = useState<IInvoice | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  const handleSuccess = () => {
    setSelectedInvoice(null);
    setIsCreating(false);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Invoice Management</h1>
        <div className="space-x-4">
          {selectedInvoice && (
            <Link
              href={`/invoice/${selectedInvoice.id}`}
              className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
            >
              View Invoice
            </Link>
          )}
          <button
            onClick={() => setIsCreating(true)}
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
          >
            Create New Invoice
          </button>
        </div>
      </div>

      {isCreating || selectedInvoice ? (
        <div className="bg-white rounded-lg shadow p-6">
          <InvoiceForm
            invoice={selectedInvoice || undefined}
            onSuccess={handleSuccess}
            onCancel={() => {
              setSelectedInvoice(null);
              setIsCreating(false);
            }}
          />
        </div>
      ) : (
        <InvoiceList
          onSelect={setSelectedInvoice}
          onDelete={() => {
            // Refresh will happen automatically through the useInvoices hook
          }}
          onStatusChange={() => {
            // Refresh will happen automatically through the useInvoices hook
          }}
        />
      )}
    </div>
  );
}
