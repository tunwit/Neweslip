import globalDrizzle from "@/db/drizzle";
import { errorResponse, successResponse } from "@/utils/respounses/respounses";
import { auth } from "@clerk/nextjs/server";
import { count, countDistinct, sql, sum, sumDistinct } from "drizzle-orm";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import { EMPLOYEE_STATUS, GENDER } from "@/types/enum/enum";
import { EmployeeStats } from "@/types/employeeStats";
import { isOwner } from "@/lib/isOwner";
import { employeesTable, otFieldValueTable, payrollFieldValueTable, payrollPeriodsTable, payrollRecordsTable, penaltyFieldValueTable } from "@/db/schema";
import Decimal from "decimal.js";

export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return errorResponse("Unauthorized", 401);
    }

    const periodId = request.nextUrl.searchParams.get("periodId");

    // if (!(await isOwner(Number(shopId))))
    //   return errorResponse("Forbidden", 403);

    if (!periodId) return errorResponse("Bad request", 400);

    
    const [{totalIncome, totalDeduction, totalBaseSalary, employeeCount }] = await globalDrizzle
        .select({
            totalIncome: sum(
            sql`CASE WHEN ${payrollFieldValueTable.type} = 'INCOME' THEN ${payrollFieldValueTable.amount} ELSE 0 END`
            ),
            totalDeduction: sum(
            sql`CASE WHEN ${payrollFieldValueTable.type} = 'DEDUCTION' THEN ${payrollFieldValueTable.amount} ELSE 0 END`
            ),
            totalBaseSalary: sumDistinct(employeesTable.salary),
            employeeCount: countDistinct(payrollRecordsTable.employeeId),
        })
        .from(payrollFieldValueTable)
        .innerJoin(
            payrollRecordsTable,
            eq(payrollRecordsTable.id, payrollFieldValueTable.payrollRecordId)
        )
        .innerJoin(employeesTable,eq(employeesTable.id,payrollRecordsTable.employeeId))
        .where(eq(payrollRecordsTable.payrollPeriodId, Number(periodId)));

    const [{ totalOT }] = await globalDrizzle
      .select({
        totalOT: sum(otFieldValueTable.amount),
      })
      .from(otFieldValueTable)
      .innerJoin(
        payrollRecordsTable,
        eq(payrollRecordsTable.id, otFieldValueTable.payrollRecordId)
      )
      .where(eq(payrollRecordsTable.payrollPeriodId, Number(periodId)));
    
    const [{ totalPenalty }] = await globalDrizzle
      .select({
        totalPenalty: sum(penaltyFieldValueTable.amount),
      })
      .from(penaltyFieldValueTable)
      .innerJoin(
        payrollRecordsTable,
        eq(payrollRecordsTable.id, penaltyFieldValueTable.payrollRecordId)
      )
      .where(eq(payrollRecordsTable.payrollPeriodId, Number(periodId)));
    
    const totalPay = new Decimal(totalBaseSalary ?? 0).add(new Decimal(totalIncome ?? 0)).sub(new Decimal(totalDeduction ?? 0)).add(new Decimal(totalOT ?? 0)).sub(new Decimal(totalPenalty ?? 0))
    const payload = {
      employeeCount: employeeCount,
      totalPay: totalPay,
      totalBaseSalary: totalBaseSalary,
      totalIncome: totalIncome,
      totalDeduction: totalDeduction,
      totalOT: totalOT,
      totalPenalty: totalPenalty
    }
    return successResponse(payload);
  } catch (err) {
    console.error(err);
    return errorResponse("Internal server error", 500);
  }
}
