"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { IInvoice } from "../../lib/types/invoice";
import {
  formatCurrency,
  formatDate,
  getStatusColor,
} from "../../lib/utils/invoice";
import InvoiceSearch from "../../components/invoice/InvoiceSearch";
import { SearchOptions, searchInvoices } from "../../lib/utils/search";

const InvoiceListPage: React.FC = () => {
  const [invoices, setInvoices] = useState<IInvoice[]>([]);
  const [filteredInvoices, setFilteredInvoices] = useState<IInvoice[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchInvoices = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch("/api/invoices");
      if (!response.ok) {
        throw new Error("Failed to fetch invoices");
      }
      const data = await response.json();
      // Convert date strings to Date objects
      const invoicesWithDates = data.map((invoice: IInvoice) => ({
        ...invoice,
        issueDate: new Date(invoice.issueDate),
        dueDate: invoice.dueDate ? new Date(invoice.dueDate) : null,
      }));
      setInvoices(invoicesWithDates);
      setFilteredInvoices(invoicesWithDates);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInvoices();
  }, []);

  const handleSearch = (options: SearchOptions) => {
    const results = searchInvoices(invoices, options);
    setFilteredInvoices(results);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="text-red-600 text-xl mb-4">Error: {error}</div>
        <button
          onClick={fetchInvoices}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Invoices</h1>
        <Link
          href="/invoice/create"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Create Invoice
        </Link>
      </div>

      <InvoiceSearch onSearch={handleSearch} />

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border rounded-lg">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Invoice Number
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Client
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Amount
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Due Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredInvoices.map((invoice) => (
              <tr key={invoice.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {invoice.invoiceNumber}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {formatDate(invoice.issueDate)}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {invoice.client.name}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {formatCurrency(invoice.total)}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(invoice.status)}`}
                  >
                    {invoice.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {invoice.dueDate ? formatDate(invoice.dueDate) : "-"}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <Link
                    href={`/invoice/${invoice.id}`}
                    className="text-indigo-600 hover:text-indigo-900 mr-4"
                  >
                    View
                  </Link>
                  <Link
                    href={`/invoice/edit/${invoice.id}`}
                    className="text-indigo-600 hover:text-indigo-900"
                  >
                    Edit
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-2">Total Outstanding</h3>
          <p className="text-2xl font-bold text-blue-600">
            {formatCurrency(
              filteredInvoices
                .filter((inv) => inv.status === "sent")
                .reduce((sum, inv) => sum + inv.total, 0),
            )}
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-2">Total Overdue</h3>
          <p className="text-2xl font-bold text-red-600">
            {formatCurrency(
              filteredInvoices
                .filter((inv) => inv.status === "overdue")
                .reduce((sum, inv) => sum + inv.total, 0),
            )}
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-2">Total Paid</h3>
          <p className="text-2xl font-bold text-green-600">
            {formatCurrency(
              filteredInvoices
                .filter((inv) => inv.status === "paid")
                .reduce((sum, inv) => sum + inv.total, 0),
            )}
          </p>
        </div>
      </div>
    </div>
  );
};

export default InvoiceListPage;
