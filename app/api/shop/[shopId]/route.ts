import { shopOwnerTable, shopsTable } from "@/db/schema";
import globalDrizzle from "@/db/drizzle";
import { errorResponse, successResponse } from "@/utils/respounses/respounses";
import { auth } from "@clerk/nextjs/server";
import { count } from "console";
import { and, eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import { NextApiRequest } from "next";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ shopId: string }> },
) {
  try {
    const shopId = (await params).shopId;

    if (!shopId) {
      return errorResponse("Bad request", 403);
    }

    const data = await globalDrizzle
      .select()
      .from(shopsTable)
      .where(eq(shopsTable.id, Number(shopId)))
      .limit(1);

    return successResponse(data[0]);
  } catch (err) {
    console.error(err);
    return errorResponse("Internal server error", 500);
  }
}
