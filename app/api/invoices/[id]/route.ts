import { NextRequest, NextResponse } from "next/server";
import {
  IInvoice,
  UpdateInvoiceRequest,
  InvoiceApiResponse,
} from "../../../lib/types/invoice";

import {
  calculateItemAmount,
  calculateSubtotal,
  calculateTax,
  calculateTotal,
} from "../../../lib/utils/invoice";

// TODO: Replace with actual database operations
const invoiceDatabase: IInvoice[] = [];

// GET /api/invoices/[id] - Get specific invoice
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    const invoice = invoiceDatabase.find((inv) => inv.id === id);

    if (!invoice) {
      return NextResponse.json(
        { success: false, message: "Invoice not found" },
        { status: 404 },
      );
    }

    const response: InvoiceApiResponse = {
      success: true,
      data: invoice,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("Error fetching invoice:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch invoice" },
      { status: 500 },
    );
  }
}

// PUT /api/invoices/[id] - Update specific invoice
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const body: UpdateInvoiceRequest = await request.json();

    const invoiceIndex = invoiceDatabase.findIndex((inv) => inv.id === id);

    if (invoiceIndex === -1) {
      return NextResponse.json(
        { success: false, message: "Invoice not found" },
        { status: 404 },
      );
    }

    const existingInvoice = invoiceDatabase[invoiceIndex];

    // Update invoice with new data
    let updatedInvoice: IInvoice = { ...existingInvoice };

    // If items are being updated, recalculate totals
    if (body.items) {
      const itemsWithAmounts = body.items.map((item, index) => ({
        ...item,
        id: `item-${Date.now()}-${index}`,
        amount: calculateItemAmount(item.unitPrice, item.quantity),
      }));

      const subtotal = calculateSubtotal(itemsWithAmounts);
      const taxRate = body.taxRate || existingInvoice.taxRate;
      const taxAmount = calculateTax(subtotal, taxRate);
      const total = calculateTotal(subtotal, taxAmount);

      updatedInvoice = {
        ...existingInvoice,
        client: body.client || existingInvoice.client,
        dueDate: body.dueDate || existingInvoice.dueDate,
        status: body.status || existingInvoice.status,
        termsAndConditions:
          body.termsAndConditions || existingInvoice.termsAndConditions,
        items: itemsWithAmounts,
        subtotal,
        taxRate,
        taxAmount,
        total,
      };
    } else {
      // Update other fields without changing items
      updatedInvoice = {
        ...existingInvoice,
        client: body.client || existingInvoice.client,
        dueDate: body.dueDate || existingInvoice.dueDate,
        status: body.status || existingInvoice.status,
        termsAndConditions:
          body.termsAndConditions || existingInvoice.termsAndConditions,
      };
    }

    // Update in database
    (invoiceDatabase as IInvoice[])[invoiceIndex] = updatedInvoice;

    const response: InvoiceApiResponse = {
      success: true,
      data: updatedInvoice,
      message: "Invoice updated successfully",
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("Error updating invoice:", error);
    return NextResponse.json(
      { success: false, message: "Failed to update invoice" },
      { status: 500 },
    );
  }
}

// DELETE /api/invoices/[id] - Delete specific invoice
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    const invoiceIndex = invoiceDatabase.findIndex((inv) => inv.id === id);

    if (invoiceIndex === -1) {
      return NextResponse.json(
        { success: false, message: "Invoice not found" },
        { status: 404 },
      );
    }

    // Remove from database
    const deletedInvoice = (invoiceDatabase as IInvoice[]).splice(
      invoiceIndex,
      1,
    )[0];

    return NextResponse.json({
      success: true,
      message: "Invoice deleted successfully",
      data: { id: deletedInvoice.id },
    });
  } catch (error) {
    console.error("Error deleting invoice:", error);
    return NextResponse.json(
      { success: false, message: "Failed to delete invoice" },
      { status: 500 },
    );
  }
}

// PATCH /api/invoices/[id] - Update specific fields (like status)
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const updates = await request.json();

    const invoiceIndex = invoiceDatabase.findIndex((inv) => inv.id === id);

    if (invoiceIndex === -1) {
      return NextResponse.json(
        { success: false, message: "Invoice not found" },
        { status: 404 },
      );
    }

    // Apply partial updates
    (invoiceDatabase as IInvoice[])[invoiceIndex] = {
      ...invoiceDatabase[invoiceIndex],
      ...updates,
    };

    const response: InvoiceApiResponse = {
      success: true,
      data: invoiceDatabase[invoiceIndex],
      message: "Invoice updated successfully",
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("Error patching invoice:", error);
    return NextResponse.json(
      { success: false, message: "Failed to update invoice" },
      { status: 500 },
    );
  }
}
