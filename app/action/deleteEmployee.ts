"use server";
import { employeesTable } from "@/db/schema";
import globalDrizzle from "@/db/drizzle";
import { isOwner } from "@/lib/isOwner";
import { Employee } from "@/types/employee";
import { inArray } from "drizzle-orm";

export async function deleteEmployee(toDelete: Employee["id"][], shopId: number) {
  const ownerCheck = await isOwner(shopId);
  if (!ownerCheck) {
    throw new Error("Forbidden");
  }

  try {
    await globalDrizzle
      .delete(employeesTable)
      .where(inArray(employeesTable.id, toDelete));
  } catch (err) {
    throw err;
  }
}
