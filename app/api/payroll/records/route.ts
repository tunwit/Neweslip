import {
  branchesTable,
  employeesTable,
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
import { and, eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import { isOwner } from "@/lib/isOwner";
import calculateTotalSalary from "@/lib/calculateTotalSalary";

export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth();

    const periodId = request.nextUrl.searchParams.get("periodId");

    if (!userId) {
      return errorResponse("Unauthorized", 401);
    }

    if (!periodId) {
      return errorResponse("Illegel Arguments", 400);
    }

    const [period] = await globalDrizzle
      .select({ shopId: payrollPeriodsTable.shopId })
      .from(payrollPeriodsTable)
      .where(eq(payrollPeriodsTable.id, Number(periodId)));

    if (!period) return errorResponse("Payroll period not found", 404);

    const [owner] = await globalDrizzle
      .select()
      .from(shopOwnerTable)
      .where(
        and(
          eq(shopOwnerTable.ownerId, userId),
          eq(shopOwnerTable.shopId, period.shopId),
        ),
      );

    if (!owner) return errorResponse("Forbidden", 403);
    const data = await globalDrizzle
      .select({
        id: payrollRecordsTable.id,
        periodId: payrollRecordsTable.payrollPeriodId,
        updatedAt: payrollRecordsTable.updatedAt,
        createdAt: payrollRecordsTable.createdAt,
        baseSalary: payrollRecordsTable.salary,
        note: payrollRecordsTable.note,

        employeeId: employeesTable.id,
        firstName: employeesTable.firstName,
        lastName: employeesTable.lastName,
        nickName: employeesTable.nickName,
        avatar: employeesTable.avatar,

        branchName: branchesTable.name,
        branchNameEng: branchesTable.nameEng,
      })
      .from(payrollRecordsTable)
      .innerJoin(
        employeesTable,
        eq(employeesTable.id, payrollRecordsTable.employeeId),
      )
      .innerJoin(branchesTable, eq(branchesTable.id, employeesTable.branchId))
      .where(eq(payrollRecordsTable.payrollPeriodId, Number(periodId)));

    const formatted = data.map((r) => ({
      id: r.id,
      periodId: r.periodId,
      updatedAt: r.updatedAt,
      createdAt: r.createdAt,
      baseSalary: r.baseSalary,
      note: r.note,
      employee: {
        id: r.employeeId,
        firstName: r.firstName,
        lastName: r.lastName,
        nickName: r.nickName,
        avatar: r.avatar,
        branch: {
          name: r.branchName,
          nameEng: r.branchNameEng,
        },
      },
    }));

    const dataWithNet = await Promise.all(
      formatted.map(async (r) => {
        const { totals } = await calculateTotalSalary(r.id);
        return {
          ...r,
          totals: totals, // add net salary
        };
      }),
    );
    return successResponse(dataWithNet);
  } catch (err) {
    console.error(err);
    return errorResponse("Internal server error", 500);
  }
}
