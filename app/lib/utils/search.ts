import { IInvoice } from "../types/invoice";

export interface SearchOptions {
  query: string;
  fields?: string[];
  filters?: {
    status?: string;
    dateRange?: {
      start: Date;
      end: Date;
    };
    minAmount?: number;
    maxAmount?: number;
  };
}

export function searchInvoices(
  invoices: IInvoice[],
  options: SearchOptions,
): IInvoice[] {
  const {
    query,
    fields = ["invoiceNumber", "client.name", "client.company"] as string[],
    filters,
  } = options;

  let results = [...invoices];

  // Apply search query
  if (query) {
    const searchTerm = query.toLowerCase();
    results = results.filter((invoice) => {
      return fields.some((field) => {
        const value = getNestedValue(invoice, field);
        return value && value.toString().toLowerCase().includes(searchTerm);
      });
    });
  }

  // Apply filters
  if (filters) {
    // Status filter
    if (filters.status) {
      results = results.filter((invoice) => invoice.status === filters.status);
    }

    // Date range filter
    if (filters.dateRange) {
      const { start, end } = filters.dateRange;
      results = results.filter((invoice) => {
        const issueDate = new Date(invoice.issueDate);
        return issueDate >= start && issueDate <= end;
      });
    }

    // Amount range filter
    if (
      typeof filters.minAmount === "number" ||
      typeof filters.maxAmount === "number"
    ) {
      results = results.filter((invoice) => {
        const amount = invoice.total;
        if (
          typeof filters.minAmount === "number" &&
          amount < filters.minAmount
        ) {
          return false;
        }
        if (
          typeof filters.maxAmount === "number" &&
          amount > filters.maxAmount
        ) {
          return false;
        }
        return true;
      });
    }
  }

  return results;
}

function getNestedValue(obj: Record<string, any>, path: string): any {
  return path.split(".").reduce((acc, part) => acc && acc[part], obj);
}

export function buildSearchQuery(params: URLSearchParams): SearchOptions {
  return {
    query: params.get("q") || "",
    filters: {
      status: params.get("status") || undefined,
      dateRange:
        params.has("startDate") && params.has("endDate")
          ? {
              start: new Date(params.get("startDate")!),
              end: new Date(params.get("endDate")!),
            }
          : undefined,
      minAmount: params.has("minAmount")
        ? parseFloat(params.get("minAmount")!)
        : undefined,
      maxAmount: params.has("maxAmount")
        ? parseFloat(params.get("maxAmount")!)
        : undefined,
    },
  };
}
