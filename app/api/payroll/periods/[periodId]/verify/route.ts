import {
  branchesTable,
  employeesTable,
  otFieldsTable,
  otFieldValueTable,
  payrollFieldValueTable,
  payrollPeriodsTable,
  payrollRecordsTable,
  penaltyFieldsTable,
  penaltyFieldValueTable,
  shopOwnerTable,
  shopsTable,
} from "@/db/schema";
import globalDrizzle from "@/db/drizzle";
import { errorResponse, successResponse } from "@/utils/respounses/respounses";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { count } from "console";
import { countDistinct, eq, inArray } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import { isOwner } from "@/lib/isOwner";
import { Owner } from "@/types/owner";
import { OtField } from "@/types/otField";
import { PenaltyField } from "@/types/penaltyField";
import calculateTotalSalary from "@/lib/calculateTotalSalary";
import { OT_METHOD, OT_TYPE, PAYROLL_PROBLEM } from "@/types/enum/enum";
import Decimal from "decimal.js";
import { calculateOT } from "@/lib/otCalculater";
import { calculatePenalty } from "@/lib/penaltyCalculater";
import { moneyFormat } from "@/utils/formmatter";
import verifyPayroll from "@/lib/verifyPayroll";



export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ periodId: string }> },
) {
  const periodId = (await params).periodId;
  const { userId } = await auth();

  if (!userId) {
    return errorResponse("Unauthorized", 401);
  }

  if (!periodId) {
    return errorResponse("Illegel Arguments", 400);
  }
  const problems = await verifyPayroll(Number(periodId))
  
  return successResponse(problems);
}
