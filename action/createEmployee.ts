"use server"
import { employeesTable } from "@/db/schema";
import globalDrizzle from "@/lib/drizzle";
import { isOwner } from "@/lib/isOwner";
import { Employee } from "@/types/employee";
import { auth } from "@clerk/nextjs/server";

export async function createEmployee(
    data:Employee,
) {
    const ownerCheck = await isOwner(data.shopId)
    if(!ownerCheck) {
        throw new Error("Unthorized");
    }
  try{
    await globalDrizzle.insert(employeesTable).values(data)
  }catch (err){
    throw err
  }
  
}
