import {
  otFieldsTable,
  payrollFieldValueTable,
  payrollPeriodsTable,
  payrollRecordsTable,
  penaltyFieldsTable,
  employeesTable,
  otFieldValueTable,
  penaltyFieldValueTable,
  branchesTable,
} from "@/db/schema";
import globalDrizzle from "@/db/drizzle";
import { errorResponse, successResponse } from "@/utils/respounses/respounses";
import { auth } from "@clerk/nextjs/server";
import { eq, and } from "drizzle-orm";
import { NextRequest } from "next/server";
import { isOwner } from "@/lib/isOwner";
import calculateTotalSalary from "@/lib/calculateTotalSalary";
import Decimal from "decimal.js";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ periodId: string }> },
) {
  try {
    const periodId = (await params).periodId;
    const { userId } = await auth();

    if (!userId) return errorResponse("Unauthorized", 401);
    if (!periodId) return errorResponse("Illegal Arguments", 400);

    // Fetch payroll period
    const [period] = await globalDrizzle
      .select({
        id: payrollPeriodsTable.id,
        name: payrollPeriodsTable.name,
        status: payrollPeriodsTable.status,
        shopId: payrollPeriodsTable.shopId,
        start_date: payrollPeriodsTable.start_date,
        work_hours_per_day: payrollPeriodsTable.work_hours_per_day,
        workdays_per_month: payrollPeriodsTable.workdays_per_month,
      })
      .from(payrollPeriodsTable)
      .where(eq(payrollPeriodsTable.id, Number(periodId)));

    if (!period) return errorResponse("Payroll period not found", 404);
    if (!(await isOwner(Number(period.shopId), userId)))
      return errorResponse("Forbidden", 403);

    // Fetch payroll records with employee info
    const records = await globalDrizzle
      .select({
        id: payrollRecordsTable.id,
        baseSalary: payrollRecordsTable.salary,
        employee: {
          id: employeesTable.id,
          firstName: employeesTable.firstName,
          lastName: employeesTable.lastName,
          nickName: employeesTable.nickName,
          branch: branchesTable.name,
          branchEng: branchesTable.nameEng,
        },
      })
      .from(payrollRecordsTable)
      .leftJoin(
        employeesTable,
        eq(payrollRecordsTable.employeeId, employeesTable.id),
      )
      .innerJoin(branchesTable, eq(employeesTable.branchId, branchesTable.id))
      .where(eq(payrollRecordsTable.payrollPeriodId, period.id));

    const recordsSummary = [];

    let totalNet = 0;
    let totalBaseSalary = 0;
    let totalEarning = 0;
    let totalDeduction = 0;

    for (const r of records) {
      // Fetch payroll field values

      const fields = await globalDrizzle
        .select()
        .from(payrollFieldValueTable)
        .where(eq(payrollFieldValueTable.payrollRecordId, r.id));

      // Fetch OT fields
      const ot = await globalDrizzle
        .select()
        .from(otFieldValueTable)
        .where(eq(otFieldValueTable.payrollRecordId, r.id));

      // Fetch penalty fields
      const penalties = await globalDrizzle
        .select()
        .from(penaltyFieldValueTable)
        .where(eq(penaltyFieldValueTable.payrollRecordId, r.id));

      // Calculate total salary
      const { totals } = await calculateTotalSalary(r.id);
      totalNet += totals.net;
      totalEarning += totals.totalEarning;
      totalDeduction += totals.totalDeduction;
      totalBaseSalary += new Decimal(r.baseSalary).toNumber();

      recordsSummary.push({
        id: r.id,
        baseSalary: r.baseSalary,
        employee: r.employee,
        totals: totals,
        fields,
        ot,
        penalties,
      });
    }

    return successResponse({
      ...period,
      employeeCount: records.length,
      totalNet,
      totalBaseSalary,
      totalEarning,
      totalDeduction,
      records: recordsSummary,
    });
  } catch (err) {
    console.error(err);
    return errorResponse("Internal server error", 500);
  }
}
