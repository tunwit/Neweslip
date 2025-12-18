import {
  branchesTable,
  employeesTable,
  shopOwnerTable,
  shopsTable,
} from "@/db/schema";
import globalDrizzle from "@/db/drizzle";
import {
  errorResponse,
  successPaginationResponse,
} from "@/utils/respounses/respounses";
import { auth } from "@clerk/nextjs/server";
import { and, desc, eq, getTableColumns, like, or, sql } from "drizzle-orm";
import { NextRequest } from "next/server";
import { EMPLOYEE_ORDERBY, EMPLOYEE_STATUS } from "@/types/enum/enum";
import { EmployeeWithShop } from "@/types/employee";
import { isOwner } from "@/lib/isOwner";

export function buildOrderBy<T extends Record<string, string>>(sortBy: string) {
  switch (sortBy) {
    case "name":
      return desc(employeesTable.firstName);
    case "salary":
      return desc(employeesTable.salary);
    case "createdat":
      return desc(employeesTable.createdAt);
    default:
      return desc(employeesTable.firstName);
  }
}

export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return errorResponse("Unauthorized", 401);
    }

    const shopIdQ = request.nextUrl.searchParams.get("shopId");
    const branchIdQ = request.nextUrl.searchParams.get("branchId");

    if (!shopIdQ) {
      return errorResponse("Illegal Argument", 400);
    }

    if (!(await isOwner(Number(shopIdQ), userId))) {
      return errorResponse("Forbidden", 403);
    }

    const empStatus = request.nextUrl.searchParams.get("status");
    let validateEmpStatus: EMPLOYEE_STATUS | undefined;

    if (empStatus && empStatus !== "ALL") {
      if (empStatus in EMPLOYEE_STATUS) {
        validateEmpStatus =
          EMPLOYEE_STATUS[empStatus as keyof typeof EMPLOYEE_STATUS];
      } else {
        validateEmpStatus = undefined;
      }
    }

    const search = request.nextUrl.searchParams.get("search_query");
    const page = Number(request.nextUrl.searchParams.get("page") || 1);
    const limit = Number(request.nextUrl.searchParams.get("limit") || 15);
    const orderBy = String(
      request.nextUrl.searchParams.get("orderBy") || "name",
    );

    const offset = (page - 1) * limit;

    const trimmedSearch = search?.trim();
    const searchFilter = trimmedSearch
      ? or(
          like(employeesTable.firstName, `%${trimmedSearch}%`),
          like(employeesTable.lastName, `%${trimmedSearch}%`),
          like(employeesTable.nickName, `%${trimmedSearch}%`),
          like(employeesTable.email, `%${trimmedSearch}%`),
          like(employeesTable.position, `%${trimmedSearch}%`),
        )
      : undefined;

    // Build the WHERE conditions
    const whereConditions = and(
      eq(shopOwnerTable.ownerId, userId),
      eq(employeesTable.shopId, Number(shopIdQ)),
      ...(searchFilter ? [searchFilter] : []),
      ...(branchIdQ ? [eq(employeesTable.branchId, Number(branchIdQ))] : []),
      ...(validateEmpStatus !== undefined
        ? [eq(employeesTable.status, validateEmpStatus)]
        : []),
    );

    const { shopId, branchId, ...rest } = getTableColumns(employeesTable);
    // Single query with window function to get count
    const results = await globalDrizzle
      .select({
        ...rest,
        shop: {
          id: shopsTable.id,
          name: shopsTable.name,
          avatar: shopsTable.avatar,
          work_hours_per_day: shopsTable.work_hours_per_day,
          workdays_per_month: shopsTable.workdays_per_month,
          SMTPHost: shopsTable.SMTPHost,
          SMTPPort: shopsTable.SMTPPort,
          SMTPSecure: shopsTable.SMTPSecure,
          emailAddress: shopsTable.emailAddress,
          emailName: shopsTable.emailName,
          emailPassword: shopsTable.emailPassword,
        },
        branch: {
          id: branchesTable.id,
          name: branchesTable.name,
          nameEng: branchesTable.nameEng,
        },
        // Window function to get total count in same query
        totalCount: sql<number>`COUNT(*) OVER()`.as("total_count"),
      })
      .from(employeesTable)
      .innerJoin(
        shopOwnerTable,
        eq(employeesTable.shopId, shopOwnerTable.shopId),
      )
      .innerJoin(shopsTable, eq(shopOwnerTable.shopId, shopsTable.id))
      .innerJoin(branchesTable, eq(employeesTable.branchId, branchesTable.id))
      .where(whereConditions)
      .offset(offset)
      .limit(limit)
      .orderBy(buildOrderBy(orderBy));

    // Extract total count from first row (all rows have same count due to window function)
    const total = results.length > 0 ? Number(results[0].totalCount) : 0;

    // Remove totalCount from results before returning
    const employees: EmployeeWithShop[] = results.map(
      ({ totalCount, ...employee }) => employee as EmployeeWithShop,
    );

    return successPaginationResponse(employees, {
      page,
      pageSize: limit,
      totalItems: total,
      totalPages: Math.ceil(total / limit),
      hasNextPage: page * limit < total,
      hasPrevPage: page > 1,
    });
  } catch (err) {
    console.error(err);
    return errorResponse("Internal server error", 500);
  }
}
