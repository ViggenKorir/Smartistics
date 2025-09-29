"use client";

import React, { useState } from "react";
import InvoiceTemplate from "../components/invoice_templates/InvoiceTemplate";

import { printInvoice } from "../lib/utils/invoice";

const InvoicePage: React.FC = () => {
  const [currentInvoice, setCurrentInvoice] = useState<any | null>({
    id: "INV-001",
    invoiceNumber: "INV-001",
    issueDate: new Date().toISOString(),
    dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    status: "draft",
    client: {
      name: "Sample Client",
      company: "Sample Company",
      address: "123 Client Street",
      phone: "+1234567890",
      email: "client@example.com"
    },
    vendor: {
      name: "Your Company",
      logo: "/logo.png",
      slogan: "Your Business Slogan",
      address: "456 Business Avenue",
      phone: ["+1234567890"],
      email: "contact@yourcompany.com",
      website: "www.yourcompany.com",
      accountNumber: "1234567890",
      bankName: "Sample Bank",
      bankBranch: "Main Branch"
    },
    items: [
      {
        id: "1",
        description: "Sample Item",
        details: "Sample Details",
        unitPrice: 100,
        quantity: 1,
        amount: 100
      }
    ],
    subtotal: 100,
    taxRate: 10,
    taxAmount: 10,
    total: 110,
    currency: "USD",
    termsAndConditions: "Standard terms and conditions apply.",
    signature: {
      name: "John Doe",
      title: "Manager"
    }
  });

  const handlePrint = () => {
    printInvoice();
  };

  const handleExportPDF = async () => {
    try {
      window.print();
    } catch (error) {
      console.error("Error exporting PDF:", error);
    }
  };

  return (
    <div>
      {/* Invoice Template */}
      <InvoiceTemplate
        invoice={currentInvoice}
        onPrint={handlePrint}
        onExportPDF={handleExportPDF}
        editable={false}
      />

      {/* API Integration Notes */}
      <div className="no-print max-w-4xl mx-auto px-4 py-8">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-4">
            API Integration Ready
          </h3>
          <div className="space-y-4 text-sm text-blue-800">
            <p>
              This invoice template is designed for easy API integration. Key
              integration points:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>
                <strong>Data Fetching:</strong> Replace sample data with API
                calls to fetch invoice data
              </li>
              <li>
                <strong>CRUD Operations:</strong> TypeScript interfaces support
                create, read, update, delete operations
              </li>
              <li>
                <strong>Status Management:</strong> Built-in support for invoice
                status (draft, sent, paid, overdue)
              </li>
              <li>
                <strong>Real-time Updates:</strong> Component state management
                ready for live data updates
              </li>
              <li>
                <strong>PDF Export:</strong> Integrate with libraries like
                react-to-print, jsPDF, or Puppeteer
              </li>
            </ul>
            <div className="mt-4 p-4 bg-white rounded-md border border-blue-200">
              <h4 className="font-semibold text-blue-900 mb-2">
                Example API Endpoints:
              </h4>
              <div className="space-y-1 text-xs font-mono">
                <p>
                  <span className="text-green-600">GET</span> /api/invoices -
                  List all invoices
                </p>
                <p>
                  <span className="text-green-600">GET</span> /api/invoices/[id]
                  - Get specific invoice
                </p>
                <p>
                  <span className="text-blue-600">POST</span> /api/invoices -
                  Create new invoice
                </p>
                <p>
                  <span className="text-orange-600">PUT</span>{" "}
                  /api/invoices/[id] - Update invoice
                </p>
                <p>
                  <span className="text-red-600">DELETE</span>{" "}
                  /api/invoices/[id] - Delete invoice
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoicePage;
