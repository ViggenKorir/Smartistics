export interface ISignature {
  image?: string;
  name: string;
  title: string;
}

export interface IClient {
  name: string;
  company?: string;
  address: string;
  phone: string;
  email?: string;
}

export interface IVendor {
  name: string;
  logo?: string;
  slogan?: string;
  address: string;
  phone: string[];
  email: string;
  website: string;
  accountNumber: string;
  bankName: string;
  bankBranch: string;
}

export interface IInvoiceItem {
  id: string;
  description: string;
  details?: string;
  unitPrice: number;
  quantity: number;
  amount: number;
}

export type InvoiceStatus = "draft" | "sent" | "paid" | "overdue";

export interface IInvoice {
  id: string;
  invoiceNumber: string;
  issueDate: Date | string;
  dueDate: Date | string;
  status: InvoiceStatus;
  client: IClient;
  vendor: IVendor;
  items: IInvoiceItem[];
  subtotal: number;
  taxRate: number;
  taxAmount: number;
  total: number;
  currency: string;
  termsAndConditions: string;
  signature: ISignature;
}

export interface InvoiceTemplateProps {
  invoice: IInvoice;
  onPrint?: () => void;
  onExportPDF?: () => void;
  editable?: boolean;
}

// API Response types for future integration
export interface InvoiceApiResponse {
  success: boolean;
  data: IInvoice;
  message?: string;
}

export interface InvoiceListApiResponse {
  success: boolean;
  data: IInvoice[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  message?: string;
}

export interface CreateInvoiceRequest {
  client: IClient;
  items: Omit<IInvoiceItem, "id" | "amount">[];
  dueDate: Date | string;
  taxRate?: number;
  termsAndConditions?: string;
}

export interface UpdateInvoiceRequest extends Partial<CreateInvoiceRequest> {
  id: string;
  status?: InvoiceStatus;
}

export interface InvoiceHistory {
  id: string;
  invoiceId: string;
  version: number;
  timestamp: string;
  changes: Record<string, any>;
  changedBy: string;
  previousVersion: Partial<IInvoice>;
}

export interface InvoiceHistoryResponse {
  success: boolean;
  data: InvoiceHistory[];
  message?: string;
}
