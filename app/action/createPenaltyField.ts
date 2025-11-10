"use server";
import { branchesTable, employeesTable, otFieldsTable, penaltyFieldsTable, salaryFieldsTable } from "@/db/schema";
import globalDrizzle from "@/db/drizzle";
import { isOwner } from "@/lib/isOwner";
import { NewPenaltyField } from "@/types/penaltyField";

export async function createPenaltyField(data: Omit<NewPenaltyField,"shopId">,shopId:number) {
  const ownerCheck = await isOwner(shopId);
  if (!ownerCheck) {
    throw new Error("Forbidden");
  }

  const payload = {
    ...data,
    shopId: shopId,
  };

  try {
    await globalDrizzle.insert(penaltyFieldsTable).values(payload);
  } catch (err:any) {
    if(err.cause.code === "ER_DUP_ENTRY") err.message = err.cause.code
    
    throw err;
  }
}
