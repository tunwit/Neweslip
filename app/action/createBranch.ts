"use server";
import { branchesTable, employeesTable } from "@/db/schema";
import globalDrizzle from "@/db/drizzle";
import { isOwner } from "@/lib/isOwner";
import { Employee } from "@/types/employee";
import { auth } from "@clerk/nextjs/server";
import { NewBranch } from "@/types/branch";

export async function createBranch(data: Omit<NewBranch,"shopId">,shopId:number) {
  const ownerCheck = await isOwner(shopId);
  if (!ownerCheck) {
    throw new Error("Forbidden");
  }

  const payload = {
    ...data,
    shopId: shopId,
  };

  try {
    await globalDrizzle.insert(branchesTable).values(payload);
  } catch (err:any) {
    if(err.cause.code === "ER_DUP_ENTRY") err.message = err.cause.code
    
    throw err;
  }
}
