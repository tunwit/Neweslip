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
import { count } from "console";
import { countDistinct, eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import { isOwner } from "@/lib/isOwner";
import { Owner } from "@/types/owner";
import { OtField } from "@/types/otField";
import { PenaltyField } from "@/types/penaltyField";
import calculateTotalSalary from "@/lib/calculateTotalSalary";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ periodId: string }> },
) {
  try {
    const periodId = (await params).periodId;
    const { userId } = await auth();

    if (!userId) {
      return errorResponse("Unauthorized", 401);
    }

    if (!periodId) {
      return errorResponse("Illegel Arguments", 400);
    }

    const [period] = await globalDrizzle
      .select({
        id: payrollPeriodsTable.id,
        name: payrollPeriodsTable.name,
        status: payrollPeriodsTable.status,
        shopId: payrollPeriodsTable.shopId,
        start_date: payrollPeriodsTable.start_date,
        employeeCount: countDistinct(payrollRecordsTable.employeeId),
        work_hours_per_day: payrollPeriodsTable.work_hours_per_day,
        workdays_per_month: payrollPeriodsTable.workdays_per_month,
      })
      .from(payrollPeriodsTable)
      .leftJoin(
        payrollRecordsTable,
        eq(payrollRecordsTable.payrollPeriodId, payrollPeriodsTable.id),
      )
      .where(eq(payrollPeriodsTable.id, Number(periodId)))
      .groupBy(payrollPeriodsTable.id);

    if (!(await isOwner(Number(period.shopId), userId)))
      return errorResponse("Forbidden", 403);

    const records = await globalDrizzle
      .select({ id: payrollRecordsTable.id })
      .from(payrollRecordsTable)
      .where(eq(payrollRecordsTable.payrollPeriodId, period.id));

    // Sum net salary for all records
    let totalNet = 0;
    for (const r of records) {
      const { totals } = await calculateTotalSalary(r.id);
      totalNet += totals.net;
    }

    return successResponse({ ...period, totalNet });
  } catch (err) {
    console.error(err);
    return errorResponse("Internal server error", 500);
  }
}
