"use server";
import {
  branchesTable,
  otFieldsTable,
  payrollPeriodsTable,
  salaryFieldsTable,
} from "@/db/schema";
import globalDrizzle from "@/db/drizzle";
import { isOwner } from "@/lib/isOwner";
import { Employee } from "@/types/employee";
import { auth } from "@clerk/nextjs/server";
import { and, eq, isNull } from "drizzle-orm";
import { NewOtField, OtField } from "@/types/otField";
import { NewPayrollPeriod, PayrollPeriod } from "@/types/payrollPeriod";
import { PAY_PERIOD_STATUS } from "@/types/enum/enum";

export async function updatePayrollPeriod(
  id: PayrollPeriod["id"],
  data: Omit<NewPayrollPeriod, "shopId" | "id">,
  userId: string | null,
) {
  const [period] = await globalDrizzle
    .select()
    .from(payrollPeriodsTable)
    .where(eq(payrollPeriodsTable.id, id))
    .limit(1);

  if (!period) {
    throw new Error("Period not found");
  }

  const isNotDraft = period.status !== PAY_PERIOD_STATUS.DRAFT;

  if (isNotDraft) throw new Error("Cannot edit finalized period");

  const ownerCheck = await isOwner(period.shopId, userId);
  if (!ownerCheck) {
    throw new Error("Forbidden");
  }

  try {
    await globalDrizzle
      .update(payrollPeriodsTable)
      .set(data)
      .where(and(eq(payrollPeriodsTable.id, id)));
  } catch (err) {
    throw err;
  }
}
