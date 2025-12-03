"use server";
import {
  employeesTable,
  otFieldValueTable,
  payrollFieldValueTable,
  payrollPeriodsTable,
  payrollRecordsTable,
  penaltyFieldValueTable,
} from "@/db/schema";
import globalDrizzle from "@/db/drizzle";
import { isOwner } from "@/lib/isOwner";
import { Employee } from "@/types/employee";
import { and, eq, inArray } from "drizzle-orm";
import { PayrollPeriod } from "@/types/payrollPeriod";
import { PayrollRecord } from "@/types/payrollRecord";
import Decimal from "decimal.js";
import { RecordDetails } from "@/types/RecordDetails";
import { PAY_PERIOD_STATUS } from "@/types/enum/enum";

export async function updatePayrollRecord(
  data: {
    salary: number;
    salaryValues: { id: number; amount: number }[];
    otValues: { id: number; value: number; amount: number }[];
    penaltyValues: { id: number; value: number; amount: number }[];
  },
  recordId: number,
  shopId: number,
  userId: string | null,
) {
  const ownerCheck = await isOwner(shopId, userId);
  if (!ownerCheck) {
    throw new Error("Forbidden");
  }
  if (isNaN(recordId)) throw Error("Invalid payrollRecordId");

  const [record] = await globalDrizzle
      .select()
      .from(payrollRecordsTable)
      .where(eq(payrollRecordsTable.id, recordId)).limit(1)
  if(!record) {
    throw Error("Record not found");
  }

  const [period] = await globalDrizzle
      .select()
      .from(payrollPeriodsTable)
      .where(eq(payrollPeriodsTable.id, record.payrollPeriodId)).limit(1)

  if(period.status !== PAY_PERIOD_STATUS.DRAFT)  throw Error("Cannot edit finalized payroll");

  const { salaryValues = [], otValues = [], penaltyValues = [] } = data;

  await globalDrizzle.transaction(async (tx) => {
    await tx
      .update(payrollRecordsTable)
      .set({ salary: new Decimal(data.salary).toFixed(2) })
      .where(eq(payrollRecordsTable.id, recordId));

    for (const { id, amount } of salaryValues) {
      await tx
        .update(payrollFieldValueTable)
        .set({ amount: new Decimal(amount).toFixed(2) })
        .where(eq(payrollFieldValueTable.id, id));
    }

    for (const { id, value, amount } of otValues) {
      await tx
        .update(otFieldValueTable)
        .set({
          value: new Decimal(value).toFixed(2),
          amount: new Decimal(amount).toFixed(2),
        })
        .where(eq(otFieldValueTable.id, id));
    }

    for (const { id, value, amount } of penaltyValues) {
      await tx
        .update(penaltyFieldValueTable)
        .set({
          value: new Decimal(value).toFixed(2),
          amount: new Decimal(amount).toFixed(2),
        })
        .where(eq(penaltyFieldValueTable.id, id));
    }
  });
}
