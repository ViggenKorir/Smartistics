import { NextRequest, NextResponse } from "next/server";
import { getAuth } from "@clerk/nextjs/server";
import fs from "fs/promises";
import path from "path";
import { z } from "zod";
import { validateRequest } from "../../lib/middleware/validation";
import { createInvoiceSchema } from "../../lib/middleware/validation";
import {
  IInvoice,
  IVendor,
  CreateInvoiceRequest,
  InvoiceListApiResponse,
  InvoiceApiResponse,
  InvoiceHistory,
} from "../../lib/types/invoice";
import {
  calculateItemAmount,
  calculateSubtotal,
  calculateTax,
  calculateTotal,
  generateInvoiceNumber,
} from "../../lib/utils/invoice";

const DB_PATH = path.join(process.cwd(), "db.json");

interface Database {
  invoices: {
    current: IInvoice[];
    history: InvoiceHistory[];
  };
}

let invoiceDatabase: IInvoice[] = [];

async function readDB() {
  const data = await fs.readFile(DB_PATH, "utf-8");
  return JSON.parse(data);
}

async function writeDB(data: any) {
  await fs.writeFile(DB_PATH, JSON.stringify(data, null, 2), "utf-8");
}

// GET /api/invoices - List all invoices with optional filtering and pagination
export async function GET(
  request: NextRequest,
): Promise<NextResponse<InvoiceListApiResponse | InvoiceApiResponse>> {
  try {
    const { userId } = getAuth(request);
    if (!userId) {
      return NextResponse.json(
        { success: false, message: "Unauthorized", data: [] },
        { status: 401 },
      );
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const status = searchParams.get("status");

    const db = await readDB();
    if (!db.invoices) {
      db.invoices = { current: [], history: [] };
      await writeDB(db);
    }

    const invoices = db.invoices.current;

    // If ID is provided, return single invoice
    if (id) {
      const invoice = invoices.find((inv: IInvoice) => inv.id === id);
      if (!invoice) {
        return NextResponse.json(
          { success: false, message: "Invoice not found", data: [] },
          { status: 404 },
        );
      }
      return NextResponse.json({ success: true, data: invoice });
    }

    // Filter by status if provided
    let filteredInvoices = [...invoices];
    if (status) {
      filteredInvoices = filteredInvoices.filter(
        (inv: IInvoice) => inv.status === status,
      );
    }

    // Calculate pagination
    const start = (page - 1) * limit;
    const end = start + limit;
    const paginatedInvoices = filteredInvoices.slice(start, end);
    const total = filteredInvoices.length;

    return NextResponse.json({
      success: true,
      data: paginatedInvoices,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching invoices:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch invoices", data: [] },
      { status: 500 },
    );
  }
}

// POST /api/invoices - Create a new invoice
export const POST = validateRequest(
  createInvoiceSchema,
  async (
    request: NextRequest,
    data: z.infer<typeof createInvoiceSchema>,
  ): Promise<NextResponse<InvoiceApiResponse>> => {
    try {
      const { userId } = getAuth(request);
      if (!userId) {
        return NextResponse.json(
          { success: false, message: "Unauthorized", data: {} as IInvoice },
          { status: 401 },
        );
      }

      const db = await readDB();
      const processedItems = data.items.map((item) => ({
        ...item,
        id: crypto.randomUUID(),
        amount: calculateItemAmount(item.unitPrice, item.quantity),
      }));

      // Create default vendor if not provided
      const defaultVendor: IVendor = {
        name: "Company Name",
        logo: "",
        slogan: "",
        address: "Company Address",
        phone: [""],
        email: "contact@company.com",
        website: "www.company.com",
        accountNumber: "DEFAULT-ACCOUNT",
        bankName: "DEFAULT BANK",
        bankBranch: "MAIN BRANCH",
      };

      const newInvoice: IInvoice = {
        id: crypto.randomUUID(),
        invoiceNumber: generateInvoiceNumber(),
        issueDate: new Date().toISOString(),
        dueDate: data.dueDate || new Date().toISOString(),
        vendor: defaultVendor,
        client: data.client,
        status: "draft",
        currency: "USD",
        items: processedItems,
        taxRate: data.taxRate || 0,
        subtotal: calculateSubtotal(processedItems),
        taxAmount: calculateTax(
          processedItems.reduce((sum, item) => sum + item.amount, 0),
          data.taxRate ?? 0,
        ),
        total: calculateTotal(
          processedItems.reduce((sum, item) => sum + item.amount, 0),
          data.taxRate ?? 0,
        ),
        termsAndConditions:
          data.termsAndConditions || "Standard terms and conditions apply",
        signature: {
          name: "",
          title: "",
        },
      };

      db.invoices.current.push(newInvoice);
      if (!db.invoices) {
        db.invoices = { current: [], history: [] };
      }
      if (!db.invoices.current) {
        db.invoices.current = [];
      }
      db.invoices.current.push(newInvoice);
      await writeDB(db);

      return NextResponse.json({
        success: true,
        data: newInvoice,
      });
    } catch (error) {
      console.error("Error creating invoice:", error);
      return NextResponse.json(
        {
          success: false,
          message: "Error creating invoice",
          data: {} as IInvoice,
        },
        { status: 500 },
      );
    }
  },
);

// PUT /api/invoices - Bulk update invoices (optional)
export async function PUT(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get("action");

    if (action === "bulk-status-update") {
      const { invoiceIds, status } = await request.json();

      if (!invoiceIds || !Array.isArray(invoiceIds) || !status) {
        return NextResponse.json(
          {
            success: false,
            message:
              "Invalid request: invoiceIds array and status are required",
          },
          { status: 400 },
        );
      }

      const db = await readDB();
      const updatedInvoices = db.invoices.current.map((invoice: IInvoice) => {
        if (invoiceIds.includes(invoice.id)) {
          return { ...invoice, status };
        }
        return invoice;
      });

      db.invoices.current = updatedInvoices;
      await writeDB(db);

      return NextResponse.json({
        success: true,
        message: `${invoiceIds.length} invoices updated successfully`,
      });
    }

    return NextResponse.json(
      { success: false, message: "Invalid action" },
      { status: 400 },
    );
  } catch (error) {
    console.error("Error updating invoices:", error);
    return NextResponse.json(
      { success: false, message: "Failed to update invoices" },
      { status: 500 },
    );
  }
}

// DELETE /api/invoices - Bulk delete invoices (optional)
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const invoiceIds = searchParams.get("ids")?.split(",");

    if (!invoiceIds || invoiceIds.length === 0) {
      return NextResponse.json(
        { success: false, message: "No invoice IDs provided" },
        { status: 400 },
      );
    }

    const db = await readDB();
    const originalLength = db.invoices.current.length;
    db.invoices.current = db.invoices.current.filter(
      (invoice: IInvoice) => !invoiceIds.includes(invoice.id),
    );
    const deletedCount = originalLength - db.invoices.current.length;
    await writeDB(db);

    return NextResponse.json({
      success: true,
      message: `${deletedCount} invoices deleted successfully`,
    });
  } catch (error) {
    console.error("Error deleting invoices:", error);
    return NextResponse.json(
      { success: false, message: "Failed to delete invoices" },
      { status: 500 },
    );
  }
}
