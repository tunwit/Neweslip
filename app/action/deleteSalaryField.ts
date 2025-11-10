"use server";
import { branchesTable, employeesTable, salaryFieldsTable } from "@/db/schema";
import globalDrizzle from "@/db/drizzle";
import { isOwner } from "@/lib/isOwner";
import { inArray } from "drizzle-orm";
import { Branch } from "@/types/branch";
import { SalaryField } from "@/types/salaryFields";

export async function deleteSalaryField(toDelete: SalaryField["id"][], shopId: number) {
  const ownerCheck = await isOwner(shopId);
  if (!ownerCheck) {
    throw new Error("Forbidden");
  }

  try {
    await globalDrizzle
      .delete(salaryFieldsTable)
      .where(inArray(salaryFieldsTable.id, toDelete));
  } catch (err) {
    throw err;
  }
}
