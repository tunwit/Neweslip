import { shopOwnerTable, shopsTable } from "@/db/schema";
import globalDrizzle from "@/db/drizzle";
import { errorResponse, successResponse } from "@/utils/respounses/respounses";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { count } from "console";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import { isOwner } from "@/lib/isOwner";
import { Owner } from "@/types/owner";

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
      .select({
        ownerId: shopOwnerTable.ownerId,
      })
      .from(shopOwnerTable)
      .where(eq(shopOwnerTable.shopId, Number(shopId)));
    
    const ownerIds = data.map((owner)=>owner.ownerId)
    const users = await (await clerkClient()).users.getUserList({
        userId:ownerIds,
        limit:ownerIds.length
    });

    const payload:Owner[] = users.data.map((value)=>({
        id: value.id,
        firstName: value.firstName,
        lastName: value.lastName,
        fullName: value.fullName,
        email: value.primaryEmailAddress?.emailAddress,
        hasImage: value.hasImage,
        imageUrl: value.imageUrl,
        lastSignInAt: value.lastSignInAt,
        lastActiveAt: value.lastActiveAt,
    }))
    
    return successResponse(payload);
  } catch (err) {
    console.error(err);
    return errorResponse("Internal server error", 500);
  }
}
