"use server";
import { branchesTable, employeesTable, otFieldsTable, penaltyFieldsTable, salaryFieldsTable } from "@/db/schema";
import globalDrizzle from "@/db/drizzle";
import { isOwner } from "@/lib/isOwner";
import { inArray } from "drizzle-orm";
import { Branch } from "@/types/branch";
import { SalaryField } from "@/types/salaryFields";
import { PenaltyField } from "@/types/penaltyField";
import { OtField } from "@/types/otField";

export async function deleteOTField(toDelete: OtField["id"][], shopId: number,userId:string|null) {
  const ownerCheck = await isOwner(shopId,userId);
  if (!ownerCheck) {
    throw new Error("Forbidden");
  }

  try {
    await globalDrizzle
      .delete(otFieldsTable)
      .where(inArray(otFieldsTable.id, toDelete));
  } catch (err) {
    throw err;
  }
}
