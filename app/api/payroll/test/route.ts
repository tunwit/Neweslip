import { shopOwnerTable, shopsTable } from "@/db/schema";
import globalDrizzle from "@/db/drizzle";
import { errorResponse, successResponse } from "@/utils/respounses/respounses";
import { auth } from "@clerk/nextjs/server";
import { count } from "console";
import { and, eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import { NextApiRequest } from "next";
import { enqueuePayrollEmails } from "@/src/lib/enqueuePayrollEmails";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ shopId: string }> },
) {
  try {
    const job = await enqueuePayrollEmails([{ id: 1, email: "test" }]);
    return successResponse(job?.id);
  } catch (err) {
    console.error(err);
    return errorResponse("Internal server error", 500);
  }
}
