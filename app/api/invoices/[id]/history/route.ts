import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
// import { auth } from '@clerk/nextjs';
import fs from "fs/promises";
import path from "path";
import { InvoiceHistory } from "@/app/lib/types/invoice";

const DB_PATH = path.join(process.cwd(), "db.json");

async function readDB() {
  const data = await fs.readFile(DB_PATH, "utf-8");
  return JSON.parse(data);
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json(
        { success: false, message: "Unauthorized", data: null },
        { status: 401 },
      );
    }

    const db = await readDB();
    if (!db.invoices?.history) {
      return NextResponse.json({
        success: true,
        data: [],
        message: "No history found",
      });
    }

    // Get history entries for this invoice
    const history = db.invoices.history
      .filter((entry: InvoiceHistory) => entry.invoiceId === params.id)
      .sort((a: InvoiceHistory, b: InvoiceHistory) => {
        return (
          new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
        );
      });

    return NextResponse.json({
      success: true,
      data: history,
      message: `Found ${history.length} history entries`,
    });
  } catch (error) {
    console.error("Error fetching invoice history:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch invoice history",
        data: null,
      },
      { status: 500 },
    );
  }
}
