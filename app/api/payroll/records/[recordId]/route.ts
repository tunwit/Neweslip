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
import { and, eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import { isOwner } from "@/lib/isOwner";
import { RecordDetails } from "@/types/RecordDetails";
import { SALARY_FIELD_DEFINATION_TYPE } from "@/types/enum/enum";
import Decimal from "decimal.js";
import calculateTotalSalary from "@/lib/calculateTotalSalary";

export async function GET(
  request: NextRequest,
  { params }: { params: { recordId: string } },
) {
  try {
    const { userId } = await auth();
    const { recordId } = await params;
    const recordIdNum = Number(recordId);

    if (!userId) {
      return errorResponse("Unauthorized", 401);
    }

    if (isNaN(recordIdNum)) {
      return errorResponse("Invalid payrollRecordId", 400);
    }

    const data = await calculateTotalSalary(recordIdNum);

    const result: RecordDetails = {
      payrollRecordId: recordIdNum,
      employeeId: data.record.employeeId,
      salary: data.record.salary,
      periodId: data.record.payrollPeriodId,
      salaryValues: data.salaryValues,
      otValues: data.otValues,
      penaltyValues: data.penaltyValues,
      totals: data.totals,
    };
    console.log(result);

    return successResponse(result);
  } catch (err) {
    console.error(err);
    return errorResponse("Internal server error", 500);
  }
}
