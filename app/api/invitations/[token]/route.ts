import { invitationsTable, shopOwnerTable, shopsTable } from "@/db/schema";
import globalDrizzle from "@/db/drizzle";
import { errorResponse, successResponse } from "@/utils/respounses/respounses";
import { auth } from "@clerk/nextjs/server";
import { count } from "console";
import { and, eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import { NextApiRequest } from "next";
import { INVITATION_STATUS } from "@/types/enum/enum";

export async function GET(req:NextRequest,{ params }: { params: Promise<{ token: string }> }) {
  try {
    const { token } = await params

    if (!token) {
      return errorResponse("Bad request", 403);
    }

    const data = await globalDrizzle
      .select()
      .from(invitationsTable)
      .where(and(
        eq(invitationsTable.token, token),
        eq(invitationsTable.status, INVITATION_STATUS.PENDING)
      )
      ).limit(1);

    return successResponse(data[0]);
  } catch (err) {
    console.error(err);
    return errorResponse("Internal server error", 500);
  }
}
