"use server";
import { branchesTable, employeesTable, otFieldsTable, payrollPeriodsTable, salaryFieldsTable } from "@/db/schema";
import globalDrizzle from "@/db/drizzle";
import { isOwner } from "@/lib/isOwner";
import { Employee } from "@/types/employee";
import { auth } from "@clerk/nextjs/server";
import { NewBranch } from "@/types/branch";
import { NewSalaryField } from "@/types/salaryFields";
import { NewOtField } from "@/types/otField";
import { NewPayrollPeriod } from "@/types/payrollPeriod";

export async function createPayrollPeriod(data: Omit<NewPayrollPeriod,"shopId">,shopId:number) {
  const ownerCheck = await isOwner(shopId);
  if (!ownerCheck) {
    throw new Error("Forbidden");
  }

  const payload = {
    ...data,
    shopId: shopId,
  };

  try {
    const id:{
      id:number
    }[] = await globalDrizzle.insert(payrollPeriodsTable).values(payload).$returningId();
    return id
  } catch (err:any) {
    if(err.cause.code === "ER_DUP_ENTRY") err.message = err.cause.code
    
    throw err;
  }
}
