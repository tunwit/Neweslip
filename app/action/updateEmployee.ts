"use server";
import { employeesTable} from "@/db/schema";
import globalDrizzle from "@/db/drizzle";
import { isOwner } from "@/lib/isOwner";
import { Employee, NewEmployee } from "@/types/employee";
import { auth } from "@clerk/nextjs/server";
import { and, eq, isNull } from "drizzle-orm";

export async function updateEmployee(
  id: Employee["id"],
  data: Omit<NewEmployee,"shopId" | "id">,
  userId:string|null
) {
  const employee = await globalDrizzle
    .select()
    .from(employeesTable)
    .where(eq(employeesTable.id, id))
    .limit(1);

  if (employee.length === 0) {
    throw new Error("Employee not found");
  }

  const ownerCheck = await isOwner(employee[0].shopId,userId);
  if (!ownerCheck) {
    throw new Error("Forbidden");
  }

  try {
    await globalDrizzle
      .update(employeesTable)
      .set(data)
      .where(eq(employeesTable.id, id))
  } catch (err) {
    throw err;
  }
}
