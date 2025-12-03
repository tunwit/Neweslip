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

export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth();

    const shopId = request.nextUrl.searchParams.get("shopId");

    if (!userId) {
      return errorResponse("Unauthorized", 401);
    }

    if (!shopId) {
      return errorResponse("Illegel Arguments", 400);
    }

    if (!(await isOwner(Number(shopId), userId)))
      return errorResponse("Forbidden", 403);

    const data = await globalDrizzle
      .select({
        id: payrollPeriodsTable.id,
        name: payrollPeriodsTable.name,
        status: payrollPeriodsTable.status,
        start_period: payrollPeriodsTable.start_period,
        end_period: payrollPeriodsTable.end_period,
        employeeCount: countDistinct(payrollRecordsTable.employeeId),
        work_hours_per_day: payrollPeriodsTable.work_hours_per_day,
        workdays_per_month: payrollPeriodsTable.workdays_per_month,
      })
      .from(payrollPeriodsTable)
      .leftJoin(
        payrollRecordsTable,
        eq(payrollRecordsTable.payrollPeriodId, payrollPeriodsTable.id),
      )
      .where(eq(payrollPeriodsTable.shopId, Number(shopId)))
      .groupBy(payrollPeriodsTable.id); // only group by ID

    const periodsWithNet = await Promise.all(
      data.map(async (period) => {
        // Get all records for this period
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

        return {
          ...period,
          totalNet,
        };
      }),
    );

    return successResponse(periodsWithNet);
  } catch (err) {
    console.error(err);
    return errorResponse("Internal server error", 500);
  }
}
