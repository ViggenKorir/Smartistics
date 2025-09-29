import { IInvoiceItem } from "../types/invoice";

// Date utility for consistent handling
export const ensureDate = (date: Date | string): Date => {
  if (typeof date === "string") {
    return new Date(date);
  }
  return date;
};

// Calculation utilities
export const calculateItemAmount = (
  unitPrice: number,
  quantity: number,
): number => {
  return Math.round(unitPrice * quantity * 100) / 100;
};

export const calculateSubtotal = (items: IInvoiceItem[]): number => {
  const subtotal = items.reduce((sum, item) => sum + item.amount, 0);
  return Math.round(subtotal * 100) / 100;
};

export const calculateTax = (subtotal: number, taxRate: number): number => {
  const tax = (subtotal * taxRate) / 100;
  return Math.round(tax * 100) / 100;
};

export const calculateTotal = (subtotal: number, taxAmount: number): number => {
  return Math.round((subtotal + taxAmount) * 100) / 100;
};

// Formatting utilities
export const formatCurrency = (
  amount: number,
  currency: string = "USD",
): string => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};

export const formatDate = (
  date: Date | string,
  format: string = "DD-MM-YYYY",
): string => {
  const dateObj = ensureDate(date);

  if (isNaN(dateObj.getTime())) {
    return "Invalid Date";
  }

  const day = dateObj.getDate().toString().padStart(2, "0");
  const month = (dateObj.getMonth() + 1).toString().padStart(2, "0");
  const year = dateObj.getFullYear();

  switch (format) {
    case "DD-MM-YYYY":
      return `${day}-${month}-${year}`;
    case "MM/DD/YYYY":
      return `${month}/${day}/${year}`;
    case "YYYY-MM-DD":
      return `${year}-${month}-${day}`;
    case "DD-MMM-YYYY":
      const monthNames = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ];
      return `${day}-${monthNames[dateObj.getMonth()]}-${year}`;
    default:
      return `${day}-${month}-${year}`;
  }
};

export const formatInvoiceNumber = (number: string): string => {
  // Ensure invoice number starts with # if it doesn't already
  return number.startsWith("#") ? number : `#${number}`;
};

// Validation utilities
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePhone = (phone: string): boolean => {
  const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
  return phoneRegex.test(phone.replace(/[\s\-\(\)]/g, ""));
};

// Invoice status utilities
export const getStatusColor = (status: string): string => {
  switch (status.toLowerCase()) {
    case "paid":
      return "text-green-600 bg-green-100";
    case "sent":
      return "text-blue-600 bg-blue-100";
    case "overdue":
      return "text-red-600 bg-red-100";
    case "draft":
      return "text-gray-600 bg-gray-100";
    default:
      return "text-gray-600 bg-gray-100";
  }
};

// Generate unique invoice number
export const generateInvoiceNumber = (): string => {
  const prefix = "CRF";
  const timestamp = Date.now().toString().slice(-6);
  const random = Math.random().toString(36).substr(2, 4).toUpperCase();
  return `#${prefix}${timestamp}${random}`;
};

// Print utilities
export const preparePrintStyles = (): void => {
  const style = document.createElement("style");
  style.textContent = `
    @media print {
      body * {
        visibility: hidden;
      }
      .print-area, .print-area * {
        visibility: visible;
      }
      .print-area {
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
      }
      .no-print {
        display: none !important;
      }
      @page {
        margin: 0.5in;
        size: A4;
      }
    }
  `;
  document.head.appendChild(style);
};

export const printInvoice = (): void => {
  preparePrintStyles();
  window.print();
};

// API integration utilities for future use
export const buildInvoiceApiUrl = (
  endpoint: string,
  baseUrl?: string,
): string => {
  const base = baseUrl || "/api/invoices";
  return `${base}${endpoint.startsWith("/") ? endpoint : `/${endpoint}`}`;
};

export const handleApiError = (error: unknown): string => {
  if (error && typeof error === "object") {
    const err = error as {
      response?: { data?: { message?: string } };
      message?: string;
    };
    if (err?.response?.data?.message) {
      return err.response.data.message;
    }
    if (err?.message) {
      return err.message;
    }
  }
  return "An unexpected error occurred";
};
