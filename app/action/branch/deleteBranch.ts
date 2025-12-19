"use server";
import { branchesTable, employeesTable } from "@/db/schema";
import globalDrizzle from "@/db/drizzle";
import { isOwner } from "@/lib/isOwner";
import { inArray } from "drizzle-orm";
import { Branch } from "@/types/branch";

export async function deleteBranch(toDelete: Branch["id"][], shopId: number,userId:string|null) {
  const ownerCheck = await isOwner(shopId,userId);
  if (!ownerCheck) {
    throw new Error("Forbidden");
  }

  try {
    await globalDrizzle
      .delete(branchesTable)
      .where(inArray(branchesTable.id, toDelete));
  } catch (err) {
    throw err;
  }
}
