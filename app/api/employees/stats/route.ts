import globalDrizzle from "@/db/drizzle";
import { errorResponse, successResponse } from "@/utils/respounses/respounses";
import { auth } from "@clerk/nextjs/server";
import { count, sql, sum } from "drizzle-orm";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import { EMPLOYEE_STATUS, GENDER } from "@/types/enum/enum";
import { EmployeeStats } from "@/types/employeeStats";
import { isOwner } from "@/lib/isOwner";
import { employeesTable } from "@/db/schema";

export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return errorResponse("Unauthorized", 401);
    }

    const shopId = request.nextUrl.searchParams.get("shopId");
    if (!(await isOwner(Number(shopId))))
      return errorResponse("Forbidden", 403);

    if (!shopId) return errorResponse("Bad request", 400);

    const statDataRaw = await globalDrizzle
      .select({
        totalEmployees: count(employeesTable.id),
        activeEmployees: sql<number>`COUNT(CASE WHEN ${employeesTable.status} = ${EMPLOYEE_STATUS.ACTIVE} THEN 1 END)`,
        inActiveEmployee: sql<number>`COUNT(CASE WHEN ${employeesTable.status} = ${EMPLOYEE_STATUS.INACTIVE} THEN 1 END)`,
        partTimeEmployees: sql<number>`COUNT(CASE WHEN ${employeesTable.status} = ${EMPLOYEE_STATUS.PARTTIME} THEN 1 END)`,
        salary: {
          totalSalary: sum(employeesTable.salary),
          activeSalary: sql<number>`SUM(CASE WHEN ${employeesTable.status} = ${EMPLOYEE_STATUS.ACTIVE} THEN ${employeesTable.salary} ELSE 0 END)`,
          inactiveSalary: sql<number>`SUM(CASE WHEN ${employeesTable.status} = ${EMPLOYEE_STATUS.INACTIVE} THEN ${employeesTable.salary} ELSE 0 END)`,
          partTimeSalary: sql<number>`SUM(CASE WHEN ${employeesTable.status} = ${EMPLOYEE_STATUS.PARTTIME} THEN ${employeesTable.salary} ELSE 0 END)`,
        },
        statusDistribution: {
          ACTIVE: sql<number>`COUNT(CASE WHEN ${employeesTable.status} = ${EMPLOYEE_STATUS.ACTIVE} THEN 1 END)`,
          INACTIVE: sql<number>`COUNT(CASE WHEN ${employeesTable.status} = ${EMPLOYEE_STATUS.INACTIVE} THEN 1 END)`,
          PARTTIME: sql<number>`COUNT(CASE WHEN ${employeesTable.status} = ${EMPLOYEE_STATUS.PARTTIME} THEN 1 END)`,
        },
        genderDistribution: {
          MALE: sql<number>`COUNT(CASE WHEN ${employeesTable.gender} = ${GENDER.MALE} THEN 1 END)`,
          FEMALE: sql<number>`COUNT(CASE WHEN ${employeesTable.gender} = ${GENDER.FEMALE} THEN 1 END)`,
          OTHER: sql<number>`COUNT(CASE WHEN ${employeesTable.gender} = ${GENDER.OTHER} THEN 1 END)`,
        },
      })
      .from(employeesTable)
      .where(eq(employeesTable.shopId, Number(shopId)))
      .limit(1);

    const row = statDataRaw[0];
    const totalData: EmployeeStats = {
      ...row,
      salary: {
        totalSalary: Number(row.salary.totalSalary ?? 0),
        activeSalary: Number(row.salary.activeSalary ?? 0),
        inactiveSalary: Number(row.salary.inactiveSalary ?? 0),
        partTimeSalary: Number(row.salary.partTimeSalary ?? 0),
      },
    };

    return successResponse(totalData);
  } catch (err) {
    console.error(err);
    return errorResponse("Internal server error", 500);
  }
}
