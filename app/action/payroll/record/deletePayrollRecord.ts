"use server";
import {
  employeesTable,
  payrollPeriodsTable,
  payrollRecordsTable,
} from "@/db/schema";
import globalDrizzle from "@/db/drizzle";
import { isOwner } from "@/lib/isOwner";
import { Employee } from "@/types/employee";
import { and, eq, inArray } from "drizzle-orm";
import { PayrollPeriod } from "@/types/payrollPeriod";
import { PayrollRecord } from "@/types/payrollRecord";
import { PAY_PERIOD_STATUS } from "@/types/enum/enum";

export async function deletePayrollRecords(
  toDelete: PayrollRecord["id"][],
  periodId: number,
  userId: string | null,
) {
  const [period] = await globalDrizzle
    .select()
    .from(payrollPeriodsTable)
    .where(eq(payrollPeriodsTable.id, periodId))
    .limit(1);

  if (!period) throw new Error("Period not found");
  if (!(await isOwner(period.shopId, userId))) throw new Error("Forbidden");

  if (period.status !== PAY_PERIOD_STATUS.DRAFT)
    throw Error("Cannot delete finalized payroll");
  try {
    await globalDrizzle
      .delete(payrollRecordsTable)
      .where(
        and(
          inArray(payrollRecordsTable.id, toDelete),
          eq(payrollRecordsTable.payrollPeriodId, periodId),
        ),
      );
  } catch (err) {
    throw err;
  }
}
