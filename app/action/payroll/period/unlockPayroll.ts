"use server";
import {
  branchesTable,
  otFieldsTable,
  payrollPeriodsTable,
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

export async function unlockPayroll(
  periodId: PayrollPeriod["id"],
  password: string,
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

  const [shop] = await globalDrizzle
    .select()
    .from(shopsTable)
    .where(eq(shopsTable.id, period.shopId))
    .limit(1);

  if (!shop) {
    throw new Error("Shop Not found");
  }

  if (!shop.password) return { code: 404, message: "password not set" };

  if (!(await verifyPassword(password, shop.password))) {
    return { code: 401, message: "wrong password" };
  }

  try {
    await globalDrizzle
      .update(payrollPeriodsTable)
      .set({
        status: PAY_PERIOD_STATUS.DRAFT,
        edited: true,
      })
      .where(and(eq(payrollPeriodsTable.id, periodId)));
    return {
      code: 200,
      message: "success",
    };
  } catch (err) {
    throw err;
  }
}
