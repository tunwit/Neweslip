"use server";
import { employeesTable, payrollPeriodsTable } from "@/db/schema";
import globalDrizzle from "@/db/drizzle";
import { isOwner } from "@/lib/isOwner";
import { Employee } from "@/types/employee";
import { inArray } from "drizzle-orm";
import { PayrollPeriod } from "@/types/payrollPeriod";
import { PAY_PERIOD_STATUS } from "@/types/enum/enum";

export async function deletePayrollPeriod(
  toDelete: PayrollPeriod["id"][],
  shopId: number,
  userId: string | null,
) {
  const ownerCheck = await isOwner(shopId, userId);
  if (!ownerCheck) {
    throw new Error("Forbidden");
  }

  const periods = await globalDrizzle
    .select()
    .from(payrollPeriodsTable)
    .where(inArray(payrollPeriodsTable.id, toDelete));
  const isNotDraft =
    periods.filter((p) => p.status !== PAY_PERIOD_STATUS.DRAFT).length > 0;

  if (isNotDraft) throw new Error("Cannot delete finalized period");

  if (!periods) throw new Error("Period not found");

  if (!(await isOwner(periods[0].shopId, userId))) throw new Error("Forbidden");

  try {
    await globalDrizzle
      .delete(payrollPeriodsTable)
      .where(inArray(payrollPeriodsTable.id, toDelete));
  } catch (err) {
    throw err;
  }
}
