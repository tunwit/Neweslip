"use server";
import { branchesTable, otFieldsTable, salaryFieldsTable} from "@/db/schema";
import globalDrizzle from "@/db/drizzle";
import { isOwner } from "@/lib/isOwner";
import { Employee } from "@/types/employee";
import { auth } from "@clerk/nextjs/server";
import { and, eq, isNull } from "drizzle-orm";
import { NewOtField, OtField } from "@/types/otField";

export async function updateOTField(
  id: OtField["id"],
  data: Omit<NewOtField, "shopId" | "id">,
) {
  const field = await globalDrizzle
    .select()
    .from(otFieldsTable)
    .where(eq(otFieldsTable.id, id))
    .limit(1);

  if (field.length === 0) {
    throw new Error("Branch not found");
  }

  const ownerCheck = await isOwner(field[0].shopId);
  if (!ownerCheck) {
    throw new Error("Forbidden");
  }

  try {
    await globalDrizzle
      .update(otFieldsTable)
      .set(data)
      .where(and(
          eq(otFieldsTable.id, id),
       ))
  } catch (err) {
    throw err;
  }
}
