"use server";
import { branchesTable } from "@/db/schema";
import globalDrizzle from "@/db/drizzle";
import { isOwner } from "@/lib/isOwner";
import { Employee } from "@/types/employee";
import { auth } from "@clerk/nextjs/server";
import { and, eq, isNull } from "drizzle-orm";
import { Branch, NewBranch } from "@/types/branch";

export async function updateBranch(
  id: Branch["id"],
  data: Omit<NewBranch, "shopId" | "id">,
  userId: string | null,
) {
  const branch = await globalDrizzle
    .select()
    .from(branchesTable)
    .where(eq(branchesTable.id, id))
    .limit(1);

  if (branch.length === 0) {
    throw new Error("Branch not found");
  }

  const ownerCheck = await isOwner(branch[0].shopId, userId);
  if (!ownerCheck) {
    throw new Error("Forbidden");
  }

  try {
    await globalDrizzle
      .update(branchesTable)
      .set(data)
      .where(and(eq(branchesTable.id, id)));
  } catch (err) {
    throw err;
  }
}
