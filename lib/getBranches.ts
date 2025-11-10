import globleDrizzle from "@/db/drizzle";
import { branchesTable, shopOwnerTable, shopsTable } from "@/db/schema";
import { errorResponse, successResponse } from "@/utils/respounses/respounses";
import { auth } from "@clerk/nextjs/server";
import { and, eq } from "drizzle-orm";
import { isOwner } from "./isOwner";
import { Branch } from "@/types/branch";

export default async function getBranches(shopId:number) {
     try {
       const { userId } = await auth();   
       if (!userId) {
         throw Error("Unauthorized");
       }
   
       if (!shopId) {
         throw Error("Illegel Arguments");
       }
   
       if(!await isOwner(Number(shopId))) throw Error("Forbidden");
       
       const data: Branch[] = await globleDrizzle
         .select({
           id: branchesTable.id,
           name: branchesTable.name,
           nameEng: branchesTable.nameEng,
           shopId: branchesTable.shopId,
         })
         .from(branchesTable)
         .innerJoin(
           shopOwnerTable,
           eq(branchesTable.shopId, shopOwnerTable.shopId),
         )
         .where(
           and(
             eq(branchesTable.shopId, Number(shopId)),
             eq(shopOwnerTable.ownerId, userId),
           ),
         );
   
   
       return data
     } catch (err) {
       console.error(err);
       throw Error("Internal server error");
     }
}