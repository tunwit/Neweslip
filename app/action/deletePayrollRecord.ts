"use server";
import { employeesTable, payrollPeriodsTable, payrollRecordsTable } from "@/db/schema";
import globalDrizzle from "@/db/drizzle";
import { isOwner } from "@/lib/isOwner";
import { Employee } from "@/types/employee";
import { and, eq, inArray } from "drizzle-orm";
import { PayrollPeriod } from "@/types/payrollPeriod";
import { PayrollRecord } from "@/types/payrollRecord";

export async function deletePayrollRecords(toDelete: PayrollRecord["id"][], periodId: number) {
  const periods = await globalDrizzle
      .select()
      .from(payrollPeriodsTable)
      .where(eq(payrollPeriodsTable.id, periodId))
      .limit(1);
  
  if (!periods.length) throw new Error("Period not found");
  if (!(await isOwner(periods[0].shopId))) throw new Error("Forbidden");


  try {
    await globalDrizzle
      .delete(payrollRecordsTable)
      .where(and(
          inArray(payrollRecordsTable.id, toDelete),
          eq(payrollRecordsTable.payrollPeriodId, periodId)
        ));
  } catch (err) {
    throw err;
  }
}
