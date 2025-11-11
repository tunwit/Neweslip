import { otFieldsTable, payrollPeriodsTable, penaltyFieldsTable, shopOwnerTable, shopsTable } from "@/db/schema";
import globalDrizzle from "@/db/drizzle";
import { errorResponse, successResponse } from "@/utils/respounses/respounses";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { count } from "console";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import { isOwner } from "@/lib/isOwner";
import { Owner } from "@/types/owner";
import { OtField } from "@/types/otField";
import { PenaltyField } from "@/types/penaltyField";

export async function GET(request:NextRequest) {
  try {
    const { userId } = await auth();

     const shopId = request.nextUrl.searchParams.get("shopId");
    
    if (!userId) {
        return errorResponse("Unauthorized", 401);
    }

    if (!shopId) {
        return errorResponse("Illegel Arguments", 400);
    }

    if(!await isOwner(Number(shopId))) return errorResponse("Forbidden", 403);

    const data = await globalDrizzle
      .select({
        id: payrollPeriodsTable.id,
        shopId: payrollPeriodsTable.shopId,
        name: payrollPeriodsTable.name,
        start_date: payrollPeriodsTable.start_date,
        end_date: payrollPeriodsTable.end_date,
        status: payrollPeriodsTable.status,
        createdAt: payrollPeriodsTable.createdAt,
        updatedAt: payrollPeriodsTable.updatedAt
      })
      .from(payrollPeriodsTable)
      .where(eq(payrollPeriodsTable.shopId, Number(shopId)));

    return successResponse(data);
  } catch (err) {
    console.error(err);
    return errorResponse("Internal server error", 500);
  }
}
