import { branchesTable, shopOwnerTable, shopsTable } from "@/db/schema";
import globalDrizzle from "@/db/drizzle";
import { errorResponse, successResponse } from "@/utils/respounses/respounses";
import { auth } from "@clerk/nextjs/server";
import { count } from "console";
import { and, eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import { isOwner } from "@/lib/isOwner";
import { Branch } from "@/types/branch";

export async function GET(request: NextRequest) {
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

    const data: Branch[] = await globalDrizzle
      .select({
        id: branchesTable.id,
        name: branchesTable.name,
        nameEng: branchesTable.nameEng,
        shopId: branchesTable.shopId,
      })
      .from(branchesTable)
      .innerJoin(
        shopOwnerTable,
        eq(branchesTable.shopId, shopOwnerTable.shopId),
      )
      .where(
        and(
          eq(branchesTable.shopId, Number(shopId)),
          eq(shopOwnerTable.ownerId, userId),
        ),
      );


    return successResponse(data);
  } catch (err) {
    console.error(err);
    return errorResponse("Internal server error", 500);
  }
}
