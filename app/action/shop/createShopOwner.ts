"use server";
import { shopOwnerTable } from "@/db/schema";
import globalDrizzle from "@/db/drizzle";

export async function createShopOwner(shopId:number,userId:string) {
  try {
    await globalDrizzle.insert(shopOwnerTable).values({
        shopId:shopId,
        ownerId:userId
    });
  } catch (err) {
    throw err;
  }
}
