import { otFieldsTable, penaltyFieldsTable, shopOwnerTable, shopsTable } from "@/db/schema";
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

    if(!await isOwner(Number(shopId),userId)) return errorResponse("Forbidden", 403);

    const data:PenaltyField[] = await globalDrizzle
      .select({
        id: penaltyFieldsTable.id,
        name: penaltyFieldsTable.name,
        nameEng: penaltyFieldsTable.nameEng,
        type: penaltyFieldsTable.type,
        method: penaltyFieldsTable.method,
        shopId: penaltyFieldsTable.shopId,
        rateOfPay: penaltyFieldsTable.rateOfPay,
        createdAt: penaltyFieldsTable.createdAt
      })
      .from(penaltyFieldsTable)
      .where(eq(penaltyFieldsTable.shopId, Number(shopId)));

    return successResponse(data);
  } catch (err) {
    console.error(err);
    return errorResponse("Internal server error", 500);
  }
}
