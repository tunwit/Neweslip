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
  successResponse,
} from "@/utils/respounses/respounses";
import { auth } from "@clerk/nextjs/server";
import { and, eq, getTableColumns, isNull, like, or } from "drizzle-orm";
import { NextApiRequest } from "next";
import { NextRequest, NextResponse } from "next/server";
import { count } from "drizzle-orm";
import { EMPLOYEE_STATUS } from "@/types/enum/enum";
import { EmployeeWithShop } from "@/types/employee";
import { isOwner } from "@/lib/isOwner";

export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return errorResponse("Unauthorized", 401);
    }

    const shopIdQ = request.nextUrl.searchParams.get("shopId");
    const branchIdQ = request.nextUrl.searchParams.get("branchId");

    if (!shopIdQ) {
      return errorResponse("Illegel Argument", 400);
    }

    if(!await isOwner(Number(shopIdQ),userId)) return errorResponse("Forbidden", 403);

    const empStatus = request.nextUrl.searchParams.get("status");
    let validateEmpStatus: EMPLOYEE_STATUS | undefined;

    if (empStatus && empStatus !== "ALL") {
      if (empStatus in EMPLOYEE_STATUS) {
        validateEmpStatus =
          EMPLOYEE_STATUS[empStatus as keyof typeof EMPLOYEE_STATUS];
      } else {
        // invalid status, ignore or throw error
        validateEmpStatus = undefined;
      }
    }
    const search = request.nextUrl.searchParams.get("search_query");

    const page = request.nextUrl.searchParams.get("page") || 1;
    const limit = request.nextUrl.searchParams.get("limit") || 15;

    const offset = (Number(page) - 1) * Number(limit);
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

    const totalItems = await globalDrizzle
      .select({ count: count() })
      .from(employeesTable);

    const total = totalItems[0].count as number;

    const { shopId, branchId, ...rest } = getTableColumns(employeesTable);

    const employees: EmployeeWithShop[] = await globalDrizzle
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
      })
      .from(employeesTable)
      .innerJoin(
        shopOwnerTable,
        eq(employeesTable.shopId, shopOwnerTable.shopId),
      )
      .innerJoin(shopsTable, eq(shopOwnerTable.shopId, shopsTable.id))
      .innerJoin(branchesTable, eq(employeesTable.branchId, branchesTable.id))
      .where(
        and(
          eq(shopOwnerTable.ownerId, userId),
          eq(employeesTable.shopId, Number(shopIdQ)),
          ...(searchFilter ? [searchFilter] : []),
          ...(branchIdQ
            ? [eq(employeesTable.branchId, Number(branchIdQ))]
            : []),
          ...(validateEmpStatus !== undefined
            ? [eq(employeesTable.status, validateEmpStatus)]
            : []),
        ),
      )
      .offset(Number(offset))
      .limit(Number(limit));

    return successPaginationResponse(employees, {
      page: Number(page),
      pageSize: Number(limit),
      totalItems: total,
      totalPages: Math.ceil(total / Number(limit)),
      hasNextPage: Number(page) * Number(limit) < total,
      hasPrevPage: Number(page) > 1,
    });
  } catch (err) {
    console.error(err);
    return errorResponse("Internal server error", 500);
  }
}
