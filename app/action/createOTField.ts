"use server";
import { branchesTable, employeesTable, otFieldsTable, salaryFieldsTable } from "@/db/schema";
import globalDrizzle from "@/db/drizzle";
import { isOwner } from "@/lib/isOwner";
import { Employee } from "@/types/employee";
import { auth } from "@clerk/nextjs/server";
import { NewBranch } from "@/types/branch";
import { NewSalaryField } from "@/types/salaryFields";
import { NewOtField } from "@/types/otField";

export async function createOTField(data: Omit<NewOtField,"shopId">,shopId:number) {
  const ownerCheck = await isOwner(shopId);
  if (!ownerCheck) {
    throw new Error("Forbidden");
  }

  const payload = {
    ...data,
    shopId: shopId,
  };

  try {
    await globalDrizzle.insert(otFieldsTable).values(payload);
  } catch (err:any) {
    if(err.cause.code === "ER_DUP_ENTRY") err.message = err.cause.code
    
    throw err;
  }
}
