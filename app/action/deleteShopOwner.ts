"use server";
import { shopOwnerTable } from "@/db/schema";
import globalDrizzle from "@/db/drizzle";
import { isOwner } from "@/lib/isOwner";
import { inArray } from "drizzle-orm";
import { Owner } from "@/types/owner";

export async function deleteShopOwner(toDelete: Owner["id"][], shopId: number,userId:string|null) {
  const ownerCheck = await isOwner(shopId,userId);
  if (!ownerCheck) {
    throw new Error("Forbidden");
  }

  try {
    await globalDrizzle
      .delete(shopOwnerTable)
      .where(inArray(shopOwnerTable.ownerId, toDelete));
  } catch (err) {
    throw err;
  }
}
