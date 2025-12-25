
import globalDrizzle from "@/db/drizzle";
import { errorResponse, successResponse } from "@/utils/respounses/respounses";
import { auth } from "@clerk/nextjs/server";
import { eq, and } from "drizzle-orm";
import { NextRequest } from "next/server";
import { isOwner } from "@/lib/isOwner";
import calculateTotalSalary from "@/lib/calculateTotalSalary";
import Decimal from "decimal.js";
import { summaryPeriod } from "@/lib/summaryPeriod";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ periodId: string }> },
) {
  try {
    const periodId = (await params).periodId;
    const { userId } = await auth();

    if (!userId) return errorResponse("Unauthorized", 401);
    if (!periodId) return errorResponse("Illegal Arguments", 400);

    // Fetch payroll period
    const result = await summaryPeriod(Number(periodId), userId);
    return successResponse(result);
  } catch (err) {
    console.error(err);
    return errorResponse("Internal server error", 500);
  }
}
