"use server";
import {
  branchesTable,
  employeesTable,
  otFieldsTable,
  payrollPeriodsTable,
  salaryFieldsTable,
  shopsTable,
} from "@/db/schema";
import globalDrizzle from "@/db/drizzle";
import { isOwner } from "@/lib/isOwner";
import { Employee } from "@/types/employee";
import { auth } from "@clerk/nextjs/server";
import { NewBranch } from "@/types/branch";
import { NewSalaryField } from "@/types/salaryFields";
import { NewOtField } from "@/types/otField";
import { NewPayrollPeriod } from "@/types/payrollPeriod";
import { eq } from "drizzle-orm";

export async function createPayrollPeriod(
  data: Omit<NewPayrollPeriod, "shopId">,
  shopId: number,
  userId: string | null,
) {
  const ownerCheck = await isOwner(shopId, userId);
  if (!ownerCheck) {
    throw new Error("Forbidden");
  }

  const [shop] = await globalDrizzle
    .select()
    .from(shopsTable)
    .where(eq(shopsTable.id, shopId))
    .limit(1);

  const payload = {
    ...data,
    shopId: shopId,
    work_hours_per_day: shop.work_hours_per_day,
    workdays_per_month: shop.workdays_per_month,
    finalized_at: null,
    finalized_by: null,
    edited: false,
  };

  try {
    const id: {
      id: number;
    }[] = await globalDrizzle
      .insert(payrollPeriodsTable)
      .values(payload)
      .$returningId();
    return id;
  } catch (err: any) {
    if (err.cause.code === "ER_DUP_ENTRY") err.message = err.cause.code;

    throw err;
  }
}
