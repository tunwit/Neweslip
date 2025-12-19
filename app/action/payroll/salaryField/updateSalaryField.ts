"use server";
import { branchesTable, salaryFieldsTable} from "@/db/schema";
import globalDrizzle from "@/db/drizzle";
import { isOwner } from "@/lib/isOwner";
import { Employee } from "@/types/employee";
import { auth } from "@clerk/nextjs/server";
import { and, eq, isNull } from "drizzle-orm";
import { Branch } from "@/types/branch";
import { NewSalaryField, SalaryField } from "@/types/salaryFields";

export async function updateSalaryFIeld(
  id: SalaryField["id"],
  data: Omit<NewSalaryField, "shopId" | "id">,
  userId:string|null
) {
  const field = await globalDrizzle
    .select()
    .from(salaryFieldsTable)
    .where(eq(salaryFieldsTable.id, id))
    .limit(1);

  if (field.length === 0) {
    throw new Error("Branch not found");
  }

  const ownerCheck = await isOwner(field[0].shopId,userId);
  if (!ownerCheck) {
    throw new Error("Forbidden");
  }


  try {
    await globalDrizzle
      .update(salaryFieldsTable)
      .set(data)
      .where(and(
          eq(salaryFieldsTable.id, id),
       ))
  } catch (err) {
    throw err;
  }
}
