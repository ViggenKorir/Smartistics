import { useState } from 'react';
import { IInvoice, InvoiceHistory } from '../types/invoice';

interface UseInvoiceOptions {
  onSuccess?: (data: any) => void;
  onError?: (error: Error) => void;
}

interface UsePaginationResult {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export function useInvoices(options: UseInvoiceOptions = {}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [invoices, setInvoices] = useState<IInvoice[]>([]);
  const [pagination, setPagination] = useState<UsePaginationResult>({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0
  });

  const fetchInvoices = async (page = 1, limit = 10, status?: string) => {
    try {
      setLoading(true);
      setError(null);
      
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString()
      });
      
      if (status) {
        params.append('status', status);
      }

      const response = await fetch(`/api/invoices?${params}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch invoices');
      }

      setInvoices(data.data);
      if (data.pagination) {
        setPagination(data.pagination);
      }
      options.onSuccess?.(data);
    } catch (err) {
      const error = err as Error;
      setError(error);
      options.onError?.(error);
    } finally {
      setLoading(false);
    }
  };

  const getInvoice = async (id: string) => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`/api/invoices?id=${id}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch invoice');
      }

      options.onSuccess?.(data);
      return data.data;
    } catch (err) {
      const error = err as Error;
      setError(error);
      options.onError?.(error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const createInvoice = async (invoiceData: Partial<IInvoice>) => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/invoices', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(invoiceData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to create invoice');
      }

      // Refresh the invoice list
      fetchInvoices(pagination.page, pagination.limit);
      options.onSuccess?.(data);
      return data.data;
    } catch (err) {
      const error = err as Error;
      setError(error);
      options.onError?.(error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updateInvoice = async (id: string, updates: Partial<IInvoice>) => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`/api/invoices?id=${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to update invoice');
      }

      // Refresh the invoice list
      fetchInvoices(pagination.page, pagination.limit);
      options.onSuccess?.(data);
      return data.data;
    } catch (err) {
      const error = err as Error;
      setError(error);
      options.onError?.(error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const deleteInvoice = async (id: string) => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`/api/invoices?id=${id}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to delete invoice');
      }

      // Refresh the invoice list
      fetchInvoices(pagination.page, pagination.limit);
      options.onSuccess?.(data);
      return true;
    } catch (err) {
      const error = err as Error;
      setError(error);
      options.onError?.(error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const getInvoiceHistory = async (id: string) => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`/api/invoices/${id}/history`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch invoice history');
      }

      options.onSuccess?.(data);
      return data.data as InvoiceHistory[];
    } catch (err) {
      const error = err as Error;
      setError(error);
      options.onError?.(error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    invoices,
    pagination,
    fetchInvoices,
    getInvoice,
    createInvoice,
    updateInvoice,
    deleteInvoice,
    getInvoiceHistory,
  };
}