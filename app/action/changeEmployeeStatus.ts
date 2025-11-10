"use server";
import globalDrizzle from "@/db/drizzle";
import { employeesTable } from "@/db/schema";
import { isOwner } from "@/lib/isOwner";
import { EMPLOYEE_STATUS } from "@/types/enum/enum";
import { and, eq, isNull } from "drizzle-orm";

interface changeEmployeeStatusProps {
  employeeId: number;
  status: EMPLOYEE_STATUS;
}

export async function changeEmployeeStatus({
  employeeId,
  status,
}: changeEmployeeStatusProps) {
  const employee = await globalDrizzle
    .select()
    .from(employeesTable)
    .where(eq(employeesTable.id, employeeId))
    .limit(1);

  if (employee.length === 0) {
    throw new Error("Employee not found");
  }

  const ownerCheck = await isOwner(employee[0].shopId);
  if (!ownerCheck) {
    throw new Error("Forbidden");
  }

  try {
    await globalDrizzle
      .update(employeesTable)
      .set({ status })
      .where(eq(employeesTable.id, employeeId)
      )
  } catch (err) {
    throw err;
  }
}
