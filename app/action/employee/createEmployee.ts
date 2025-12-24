"use server";
import { employeesTable } from "@/db/schema";
import globalDrizzle from "@/db/drizzle";
import { isOwner } from "@/lib/isOwner";
import { Employee, NewEmployee } from "@/types/employee";
import { auth } from "@clerk/nextjs/server";
import { changeEmployeeAvatar } from "./changeEmployeeAvatar";

export async function createEmployee(data: NewEmployee, userId: string | null) {
  const ownerCheck = await isOwner(data.shopId, userId);

  if (!ownerCheck) {
    throw new Error("Forbidden");
  }
  const { avatar, ...employeeData } = data;
  try {
    const [result] = await globalDrizzle
      .insert(employeesTable)
      .values({ ...employeeData, avatar: null })
      .$returningId();
    const employeeId = result.id;
    if (avatar) {
      await changeEmployeeAvatar(avatar, employeeId, data.shopId, userId);
    }

  } catch (err) {
    throw err;
  }
}
