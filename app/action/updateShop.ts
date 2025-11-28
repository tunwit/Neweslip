"use server";
import { employeesTable, shopsTable} from "@/db/schema";
import globalDrizzle from "@/db/drizzle";
import { isOwner } from "@/lib/isOwner";
import { Employee, NewEmployee } from "@/types/employee";
import { auth } from "@clerk/nextjs/server";
import { and, eq, isNull } from "drizzle-orm";
import { NewShop } from "@/types/shop";

export async function updateShop(
  data: Omit<NewShop, "name"> & { name?: string },
  shopId:number,
  userId:string|null
) {

  const ownerCheck = await isOwner(shopId,userId);
  if (!ownerCheck) {
    throw new Error("Forbidden");
  }

  try {
    await globalDrizzle
      .update(shopsTable)
      .set({...data})
      .where(eq(shopsTable.id, shopId))
  } catch (err) {
    throw err;
  }
}
