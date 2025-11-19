import { branchesTable, employeesTable, otFieldsTable, otFieldValueTable, payrollFieldValueTable, payrollPeriodsTable, payrollRecordsTable, penaltyFieldsTable, penaltyFieldValueTable, shopOwnerTable, shopsTable } from "@/db/schema";
import globalDrizzle from "@/db/drizzle";
import { errorResponse, successResponse } from "@/utils/respounses/respounses";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { count } from "console";
import { and, eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import { isOwner } from "@/lib/isOwner";

export async function GET(request:NextRequest, { params }: { params: { recordId: string } }) {
  try {
    const { userId } = await auth();
    const { recordId } = await params
    const recordIdNum = Number(recordId)
    
    if (!userId) {
        return errorResponse("Unauthorized", 401);
    }

    if (isNaN(recordIdNum)) {
      return errorResponse("Invalid payrollRecordId" , 400);
    }
    
    const record = await globalDrizzle
    .select()
    .from(payrollRecordsTable)
    .where(eq(payrollRecordsTable.id, recordIdNum))
    .limit(1);

  if (!record.length) {
    return errorResponse("Payroll record not found",404 );
  }


    const [salaryValues, otValues, penaltyValues] = await Promise.all([
      globalDrizzle.select().from(payrollFieldValueTable).where(eq(payrollFieldValueTable.payrollRecordId, recordIdNum)),
      globalDrizzle.select().from(otFieldValueTable).where(eq(otFieldValueTable.payrollRecordId, recordIdNum)),
      globalDrizzle.select().from(penaltyFieldValueTable).where(eq(penaltyFieldValueTable.payrollRecordId, recordIdNum)),
    ]);

    const result ={
    payrollRecordId : recordIdNum,
    employeeId: record[0].employeeId,
    periodId: record[0].payrollPeriodId,
    salaryValues,
    otValues,
    penaltyValues,
  }
    
    return successResponse(result);
  } catch (err) {
    console.error(err);
    return errorResponse("Internal server error", 500);
  }
}
