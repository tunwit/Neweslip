"use server"
import { employeesTable } from "@/db/schema";
import globalDrizzle from "@/lib/drizzle";
import { isOwner } from "@/lib/isOwner";
import { Employee } from "@/types/employee";
import { auth } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";

export async function updateEmployee(
    id:Employee["id"],
    data:Omit<Employee,"createdAt"|"shopId"|"id">,
) {
    console.log(data);

    const employee = await globalDrizzle
    .select()
    .from(employeesTable)
    .where(eq(employeesTable.id, id))
    .limit(1);

    const ownerCheck = await isOwner(employee[0].shopId)
    if(!ownerCheck) {
        throw new Error("Unthorized");
    }

    if (employee.length === 0) {
        throw new Error("Employee not found");
    }

  try{
     await globalDrizzle
      .update(employeesTable)
      .set(data)
      .where(eq(employeesTable.id, id));
  }catch (err){
    throw err
  }
  
}
