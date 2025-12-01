"use server";
import { employeesTable, payrollPeriodsTable } from "@/db/schema";
import globalDrizzle from "@/db/drizzle";
import { isOwner } from "@/lib/isOwner";
import { Employee } from "@/types/employee";
import { inArray } from "drizzle-orm";
import { PayrollPeriod } from "@/types/payrollPeriod";

export async function deletePayrollPeriod(toDelete: PayrollPeriod["id"][], shopId: number,userId:string|null) {
  const ownerCheck = await isOwner(shopId,userId);
  if (!ownerCheck) {
    throw new Error("Forbidden");
  }

  try {
    await globalDrizzle
      .delete(payrollPeriodsTable)
      .where(inArray(payrollPeriodsTable.id, toDelete));
  } catch (err) {
    throw err;
  }
}
