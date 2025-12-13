import { shopOwnerTable, shopsTable } from "@/db/schema";
import globalDrizzle from "@/db/drizzle";
import { errorResponse, successResponse } from "@/utils/respounses/respounses";
import { auth } from "@clerk/nextjs/server";
import { count } from "console";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const { userId } = await auth();
    

    if (!userId) {
      return errorResponse("Unauthorized", 401);
    }

    const data = await globalDrizzle
      .select({
        id: shopsTable.id,
        name: shopsTable.name,
        avatar: shopsTable.avatar,
      })
      .from(shopOwnerTable)
      .innerJoin(shopsTable, eq(shopOwnerTable.shopId, shopsTable.id))
      .where(eq(shopOwnerTable.ownerId, userId));

    return successResponse(data);
  } catch (err) {
    console.error(err);
    return errorResponse("Internal server error", 500);
  }
}
