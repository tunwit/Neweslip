import {
  otFieldsTable,
  otFieldValueTable,
  payrollFieldValueTable,
  payrollPeriodsTable,
  payrollRecordsTable,
  penaltyFieldsTable,
  penaltyFieldValueTable,
  shopOwnerTable,
  shopsTable,
} from "@/db/schema";
import globalDrizzle from "@/db/drizzle";
import { errorResponse, successResponse } from "@/utils/respounses/respounses";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { exportSummaryAsExcel } from "@/lib/exportSummaryAsExcel";
import { summaryPeriod } from "@/lib/summaryPeriod";
import { eq } from "drizzle-orm";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ periodId: string }> },
) {
  try {
    const periodId = (await params).periodId;
    const { userId } = await auth();
    if (!userId) return errorResponse("Unauthorized", 401);
    if (!periodId) return errorResponse("Illegal Arguments", 400);

    const payrollFields = await globalDrizzle
      .select({ name: payrollFieldValueTable.name })
      .from(payrollFieldValueTable)
      .leftJoin(
        payrollRecordsTable,
        eq(payrollRecordsTable.id, payrollFieldValueTable.payrollRecordId),
      )
      .where(eq(payrollRecordsTable.payrollPeriodId, Number(periodId)));

    const penaltyFields = await globalDrizzle
      .select({ name: penaltyFieldValueTable.name })
      .from(penaltyFieldValueTable)
      .leftJoin(
        payrollRecordsTable,
        eq(payrollRecordsTable.id, penaltyFieldValueTable.payrollRecordId),
      )
      .where(eq(payrollRecordsTable.payrollPeriodId, Number(periodId)));

    const otFields = await globalDrizzle
      .select({ name: otFieldValueTable.name })
      .from(otFieldValueTable)
      .leftJoin(
        payrollRecordsTable,
        eq(payrollRecordsTable.id, otFieldValueTable.payrollRecordId),
      )
      .where(eq(payrollRecordsTable.payrollPeriodId, Number(periodId)));

    const uniqueFields = Array.from(
      new Set([
        ...payrollFields.map((f) => f.name),
        ...penaltyFields.map((f) => f.name),
        ...otFields.map((f) => f.name),
        "paid",
        "totalSalaryIncome",
        "totalSalaryDeduction",
        "totalOT",
        "totalPenalty",
        "totalEarning",
        "totalDeduction",
        "net",
      ]),
    );
    return successResponse(uniqueFields);
  } catch (err) {
    console.error(err);
    return errorResponse("Internal server error", 500);
  }
}
