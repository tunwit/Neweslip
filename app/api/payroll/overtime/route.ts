import { otFieldsTable, shopOwnerTable, shopsTable } from "@/db/schema";
import globalDrizzle from "@/db/drizzle";
import { errorResponse, successResponse } from "@/utils/respounses/respounses";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { count } from "console";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import { isOwner } from "@/lib/isOwner";
import { Owner } from "@/types/owner";
import { OtField } from "@/types/otField";

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

    const data:OtField[] = await globalDrizzle
      .select({
        id: otFieldsTable.id,
        name: otFieldsTable.name,
        nameEng: otFieldsTable.nameEng,
        type: otFieldsTable.type,
        method: otFieldsTable.method,
        rate: otFieldsTable.rate,
        shopId: otFieldsTable.shopId,
        rateOfPay: otFieldsTable.rateOfPay,
        createdAt: otFieldsTable.createdAt
      })
      .from(otFieldsTable)
      .where(eq(otFieldsTable.shopId, Number(shopId)));

    return successResponse(data);
  } catch (err) {
    console.error(err);
    return errorResponse("Internal server error", 500);
  }
}
