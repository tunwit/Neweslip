"use server";
import { employeesTable } from "@/db/schema";
import globalDrizzle from "@/db/drizzle";
import { isOwner } from "@/lib/isOwner";
import { Employee, NewEmployee } from "@/types/employee";
import { auth } from "@clerk/nextjs/server";

export async function createEmployee(data: NewEmployee) {
  const ownerCheck = await isOwner(data.shopId);
  if (!ownerCheck) {
    throw new Error("Forbidden");
  }
  try {
    await globalDrizzle.insert(employeesTable).values(data);
  } catch (err) {
    throw err;
  }
}
