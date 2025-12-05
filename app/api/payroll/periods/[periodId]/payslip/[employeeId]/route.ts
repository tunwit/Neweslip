import {
  otFieldsTable,
  payrollPeriodsTable,
  payrollRecordsTable,
  penaltyFieldsTable,
  shopOwnerTable,
  shopsTable,
} from "@/db/schema";
import globalDrizzle from "@/db/drizzle";
import { errorResponse, successResponse } from "@/utils/respounses/respounses";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { exportSummaryAsExcel } from "@/lib/exportSummaryAsExcel";
import { summaryPeriod } from "@/lib/summaryPeriod";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ periodId: string }> },
) {
  try {
    const periodId = (await params).periodId;
    const { userId } = await auth();
    if (!userId) return errorResponse("Unauthorized", 401);
    if (!periodId) return errorResponse("Illegal Arguments", 400);

    const periodSummary = await summaryPeriod(Number(periodId), userId);
    const buffer = exportSummaryAsExcel(periodSummary);
    return new NextResponse(buffer, {
      headers: {
        "Content-Type":
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition": `attachment; filename="payroll_summary_${periodId}.xlsx"`,
      },
    });
  } catch (err) {
    console.error(err);
    return errorResponse("Internal server error", 500);
  }
}
