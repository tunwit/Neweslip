"use server";
import { branchesTable, employeesTable, penaltyFieldsTable, salaryFieldsTable } from "@/db/schema";
import globalDrizzle from "@/db/drizzle";
import { isOwner } from "@/lib/isOwner";
import { inArray } from "drizzle-orm";
import { Branch } from "@/types/branch";
import { SalaryField } from "@/types/salaryFields";
import { PenaltyField } from "@/types/penaltyField";

export async function deletePenaltyField(toDelete: PenaltyField["id"][], shopId: number,userId:string|null) {
  const ownerCheck = await isOwner(shopId,userId);
  if (!ownerCheck) {
    throw new Error("Forbidden");
  }

  try {
    await globalDrizzle
      .delete(penaltyFieldsTable)
      .where(inArray(penaltyFieldsTable.id, toDelete));
  } catch (err) {
    throw err;
  }
}
