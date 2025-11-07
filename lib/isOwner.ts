"use server"
import { EmployeeRespounse } from "@/types/employee";
import { auth } from "@clerk/nextjs/server";
import globalDrizzle from "./drizzle";
import { shopOwnerTable, shopsTable } from "@/db/schema";
import { and, eq } from "drizzle-orm";

export async function isOwner(shopId:number) : Promise<boolean> {
    const {userId} = await auth()
    if(!userId) return false;

    const owner = await globalDrizzle
    .select()
    .from(shopOwnerTable)
    .where(and(
        eq(shopOwnerTable.ownerId,userId),
        eq(shopOwnerTable.shopId,shopId)
    ))
    .limit(1)
    return owner.length > 0;

}