import { salaryFieldsTable, shopOwnerTable, shopsTable } from "@/db/schema";
import globalDrizzle from "@/db/drizzle";
import { errorResponse, successResponse } from "@/utils/respounses/respounses";
import { auth } from "@clerk/nextjs/server";
import { count } from "console";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import { isOwner } from "@/lib/isOwner";
import { SalaryFieldGrouped } from "@/types/salaryFields";

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
    
    if(!await isOwner(Number(shopId),userId)) return errorResponse("Forbidden", 403);

    const data = await globalDrizzle
      .select()
      .from(salaryFieldsTable)
      .where(eq(salaryFieldsTable.shopId, Number(shopId)));

    const grouped = data.reduce((acc, field) => {
    (acc[field.type] ??= []).push(field);
    return acc;
    }, {} as Record<string, typeof data>);

    return successResponse(grouped);
  } catch (err) {
    console.error(err);
    return errorResponse("Internal server error", 500);
  }
}
