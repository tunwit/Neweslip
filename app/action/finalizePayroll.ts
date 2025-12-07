"use server";
import {
  branchesTable,
  otFieldsTable,
  payrollPeriodsTable,
  penaltyFieldsTable,
  salaryFieldsTable,
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

export async function finalizePayroll(
  periodId: PayrollPeriod["id"],
  userId: string | null,
) {
  const [period] = await globalDrizzle
    .select()
    .from(payrollPeriodsTable)
    .where(eq(payrollPeriodsTable.id, periodId))
    .limit(1);

  if (!period) {
    throw new Error("Period not found");
  }

  const ownerCheck = await isOwner(period.shopId, userId);
  if (!ownerCheck) {
    throw new Error("Forbidden");
  }

  try {
    const problems = await verifyPayroll(Number(periodId));
    const isCrititalPresence =
      problems.filter((p) => p.type === PAYROLL_PROBLEM.CRITICAL).length > 0;
    if (isCrititalPresence) {
      throw new Error("Critical issue presence");
    }

    await globalDrizzle
      .update(payrollPeriodsTable)
      .set({
        status: PAY_PERIOD_STATUS.FINALIZED,
        finalized_at: new Date(),
        finalized_by: userId,
      })
      .where(and(eq(payrollPeriodsTable.id, periodId)));
  } catch (err) {
    throw err;
  }
}
