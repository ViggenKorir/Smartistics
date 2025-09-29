import { z } from "zod";
import { type InvoiceStatus } from "./invoice";

const clientSchema = z.object({
  name: z.string().min(1, "Client name is required"),
  company: z.string().optional(),
  address: z.string().min(1, "Client address is required"),
  phone: z.string().min(1, "Client phone is required"),
  email: z.string().email("Invalid email address").optional(),
});

const vendorSchema = z.object({
  name: z.string().min(1, "Vendor name is required"),
  logo: z.string().optional(),
  slogan: z.string().optional(),
  address: z.string().min(1, "Vendor address is required"),
  phone: z.array(z.string()).min(1, "At least one phone number is required"),
  email: z.string().email("Invalid email address"),
  website: z.string().url("Invalid website URL"),
  accountNumber: z.string().min(1, "Account number is required"),
  bankName: z.string().min(1, "Bank name is required"),
  bankBranch: z.string().min(1, "Bank branch is required"),
});

const invoiceItemSchema = z.object({
  description: z.string().min(1, "Item description is required"),
  details: z.string().optional(),
  unitPrice: z.number().positive("Unit price must be positive"),
  quantity: z.number().positive("Quantity must be positive"),
});

const signatureSchema = z.object({
  name: z.string().min(1, "Signature name is required"),
  title: z.string().min(1, "Signature title is required"),
  image: z.string().optional(),
});

export const createInvoiceSchema = z.object({
  client: clientSchema,
  items: z.array(invoiceItemSchema).min(1, "At least one item is required"),
  dueDate: z.string().or(z.date()),
  taxRate: z.number().min(0).max(100).optional(),
  termsAndConditions: z.string().optional(),
  signature: signatureSchema.optional(),
});

export const updateInvoiceSchema = z.object({
  id: z.string().uuid(),
  client: clientSchema.partial().optional(),
  items: z.array(invoiceItemSchema).min(1).optional(),
  dueDate: z.string().or(z.date()).optional(),
  taxRate: z.number().min(0).max(100).optional(),
  status: z.enum(["draft", "sent", "paid", "overdue"] as const).optional(),
  termsAndConditions: z.string().optional(),
  signature: signatureSchema.optional(),
});

export const invoiceHistorySchema = z.object({
  id: z.string().uuid(),
  invoiceId: z.string().uuid(),
  version: z.number().int().positive(),
  timestamp: z.string().datetime(),
  changes: z.record(z.string(), z.any()),
  changedBy: z.string(),
  previousVersion: z.record(z.string(), z.any()),
});

export type CreateInvoiceSchema = z.infer<typeof createInvoiceSchema>;
export type UpdateInvoiceSchema = z.infer<typeof updateInvoiceSchema>;
export type InvoiceHistorySchema = z.infer<typeof invoiceHistorySchema>;
