"use server";
import { branchesTable, otFieldsTable, penaltyFieldsTable, salaryFieldsTable} from "@/db/schema";
import globalDrizzle from "@/db/drizzle";
import { isOwner } from "@/lib/isOwner";
import { Employee } from "@/types/employee";
import { auth } from "@clerk/nextjs/server";
import { and, eq, isNull } from "drizzle-orm";
import { NewOtField, OtField } from "@/types/otField";
import { NewPenaltyField, PenaltyField } from "@/types/penaltyField";

export async function updatePenaltyField(
  id: PenaltyField["id"],
  data: Omit<NewPenaltyField, "shopId" | "id">,
  userId:string |null
) {
  const field = await globalDrizzle
    .select()
    .from(penaltyFieldsTable)
    .where(eq(penaltyFieldsTable.id, id))
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
      .update(penaltyFieldsTable)
      .set(data)
      .where(and(
          eq(penaltyFieldsTable.id, id),
       ))
  } catch (err) {
    throw err;
  }
}
