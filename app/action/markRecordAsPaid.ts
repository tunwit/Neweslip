"use server";
import {
  branchesTable,
  otFieldsTable,
  payrollPeriodsTable,
  payrollRecordsTable,
  penaltyFieldsTable,
  salaryFieldsTable,
  shopsTable,
} from "@/db/schema";
import globalDrizzle from "@/db/drizzle";
import { isOwner } from "@/lib/isOwner";
import { Employee } from "@/types/employee";
import { auth } from "@clerk/nextjs/server";
import { and, eq, isNull } from "drizzle-orm";
import { NewOtField, OtField } from "@/types/otField";
import { NewPenaltyField, PenaltyField } from "@/types/penaltyField";
import { PayrollPeriod } from "@/types/payrollPeriod";
import { PAY_PERIOD_STATUS, PAYROLL_PROBLEM } from "@/types/enum/enum";
import verifyPayroll from "@/lib/verifyPayroll";
import { verifyPassword } from "@/lib/password";
import { PayrollRecord } from "@/types/payrollRecord";

export async function setMarkRecordAsPaid(
  recordId: PayrollRecord["id"],
  paid: boolean,
  userId: string | null,
) {
  if (!userId) throw new Error("Unauthorized");
  const [record] = await globalDrizzle
    .select()
    .from(payrollRecordsTable)
    .where(eq(payrollRecordsTable.id, recordId))
    .limit(1);

  if (!record) {
    throw new Error("Record not found");
  }

  const [period] = await globalDrizzle
    .select()
    .from(payrollPeriodsTable)
    .where(eq(payrollPeriodsTable.id, record.payrollPeriodId))
    .limit(1);

  if (!period) {
    throw new Error("Period not found");
  }

  const ownerCheck = await isOwner(period.shopId, userId);
  if (!ownerCheck) {
    throw new Error("Forbidden");
  }

  if (period.status === PAY_PERIOD_STATUS.DRAFT) {
    throw new Error("Cannot perform this action on draft period");
  }

  try {
    await globalDrizzle
      .update(payrollRecordsTable)
      .set({
        paid: paid,
      })
      .where(and(eq(payrollRecordsTable.id, recordId)));
    return {
      code: 200,
      message: "success",
    };
  } catch (err) {
    throw err;
  }
}
