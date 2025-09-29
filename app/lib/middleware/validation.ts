import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

// Generic validation middleware
export function validateRequest<T>(
  schema: z.Schema<T>,
  handler: (req: NextRequest, validatedData: T) => Promise<NextResponse>,
) {
  return async (req: NextRequest) => {
    try {
      let data;
      if (req.method === "GET") {
        const params = Object.fromEntries(new URL(req.url).searchParams);
        data = schema.parse(params);
      } else {
        data = schema.parse(await req.json());
      }
      return await handler(req, data);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return NextResponse.json(
          {
            success: false,
            message: "Validation failed",
            errors: error.format(),
            data: null,
          },
          { status: 400 },
        );
      }
      throw error;
    }
  };
}

// Schema for invoice items
const invoiceItemSchema = z.object({
  description: z.string().min(1, "Description is required"),
  quantity: z.number().positive("Quantity must be positive"),
  unitPrice: z.number().nonnegative("Unit price must be non-negative"),
  details: z.string().optional(),
});

// Schema for contact information
const contactSchema = z.object({
  name: z.string().min(1, "Name is required"),
  address: z.string().min(1, "Address is required"),
  phone: z.string().min(1, "Phone is required"),
  email: z.string().email("Invalid email address"),
  company: z.string().optional(),
});

// Schema for creating an invoice
export const createInvoiceSchema = z.object({
  client: contactSchema,
  vendor: contactSchema,
  items: z.array(invoiceItemSchema).min(1, "At least one item is required"),
  dueDate: z.string().refine((val) => !isNaN(Date.parse(val)), "Invalid date"),
  taxRate: z.number().min(0).max(100).optional(),
  currency: z.string().length(3, "Currency must be a 3-letter code").optional(),
  termsAndConditions: z.string().optional(),
});

// Schema for updating an invoice
export const updateInvoiceSchema = createInvoiceSchema.partial().extend({
  status: z.enum(["draft", "sent", "paid", "overdue", "cancelled"]).optional(),
});

// Schema for getting invoices with pagination
export const getInvoicesSchema = z.object({
  page: z
    .string()
    .transform((val) => parseInt(val))
    .optional(),
  limit: z
    .string()
    .transform((val) => parseInt(val))
    .optional(),
  status: z.enum(["draft", "sent", "paid", "overdue", "cancelled"]).optional(),
  search: z.string().optional(),
  sortBy: z.enum(["date", "amount", "status", "client"]).optional(),
  sortOrder: z.enum(["asc", "desc"]).optional(),
});

// Schema for deleting invoices
export const deleteInvoiceSchema = z.object({
  id: z.string().uuid("Invalid invoice ID"),
});
