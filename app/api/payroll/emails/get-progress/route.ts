import {
  branchesTable,
  employeesTable,
  otFieldsTable,
  payrollPeriodsTable,
  payrollRecordsTable,
  penaltyFieldsTable,
  shopOwnerTable,
  shopsTable,
} from "@/db/schema";
import globalDrizzle from "@/db/drizzle";
import { errorResponse, successResponse } from "@/utils/respounses/respounses";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { count } from "console";
import { and, eq, inArray } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import { isOwner } from "@/lib/isOwner";
import { Owner } from "@/types/owner";
import { OtField } from "@/types/otField";
import { PenaltyField } from "@/types/penaltyField";
import { PAY_PERIOD_STATUS } from "@/types/enum/enum";
import { sendMail } from "@/lib/emailService";
import generateHTMLPayslip from "@/lib/generateHTMLPayslip";
import calculateTotalSalary from "@/lib/calculateTotalSalary";
import { RecordDetails } from "@/types/RecordDetails";
import { enqueuePayrollEmails } from "@/src/lib/enqueuePayrollEmails";
import { EmailPayload } from "@/types/mailPayload";
import { connection } from "@/src/queues/email.queue";

export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return errorResponse("Unauthorized", 401);
    }

    const batchId = request.nextUrl.searchParams.get("batchId");

    const total = Number(await connection.get(`email:batch:${batchId}:total`));
    const completed = Number(
      (await connection.get(`email:batch:${batchId}:completed`)) || 0,
    );
    const failed = Number(
      (await connection.get(`email:batch:${batchId}:failed`)) || 0,
    );
    return successResponse({
      total,
      completed,
      failed,
      pending: total - completed - failed,
      percent: Math.round((completed / total) * 100),
    });
  } catch (err) {
    console.error(err);
    return new Response("Internal server error", { status: 500 });
  }
}
