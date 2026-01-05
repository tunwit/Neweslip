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
import { EmailPayload } from "@/types/mailPayload";
import { PayslipController } from "@/src/features/payslip/payslip.controller";
import { PayslipAndSendQueue, PayslipQueue } from "@/src/features/payslip/payslip.model";

const controller = new PayslipController();

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return errorResponse("Unauthorized", 401);
    }

    const body: PayslipAndSendQueue[] = await request.json();
    const batchId = await controller.enqueueGenerateAndSend(body);

    return successResponse(batchId);
  } catch (err) {
    console.error(err);
    return new Response("Internal server error", { status: 500 });
  }
}
