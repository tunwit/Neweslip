"use server";
import { employeesTable, otFieldsTable, otFieldValueTable, payrollFieldValueTable, payrollPeriodsTable, payrollRecordsTable, penaltyFieldsTable, penaltyFieldValueTable, salaryFieldsTable } from "@/db/schema";
import globalDrizzle from "@/db/drizzle";
import { isOwner } from "@/lib/isOwner";
import { eq, inArray, InferInsertModel } from "drizzle-orm";
import { NewPayrollRecord } from "@/types/payrollRecord";
import { SALARY_FIELD_DEFINATION_TYPE } from "@/types/enum/enum";
import { NewSalaryField } from "@/types/salaryFields";
import { NewOtField } from "@/types/otField";
import { NewPenaltyField } from "@/types/penaltyField";

function mapSalaryField (recordId: number, field: NewSalaryField): InferInsertModel<typeof payrollFieldValueTable>{
  return {
    payrollRecordId:recordId,
    name: field.name,
    nameEng: field.nameEng,
    type: field.type
  };
}

function mapOtField(recordId: number, field: NewOtField): InferInsertModel<typeof otFieldValueTable> {
  return {
    payrollRecordId:recordId,
    name: field.name,
    nameEng: field.nameEng,
    rate: field.rate,
    type:field.type,
    method: field.method,
    rateOfPay:field.rateOfPay,
  };
}

function mapPenaltyField(recordId: number, field: NewPenaltyField):InferInsertModel<typeof penaltyFieldValueTable> {
  return {
    payrollRecordId:recordId,
    name: field.name,
    nameEng: field.name,
    type:field.type,
    method: field.method,
    rateOfPay:field.rateOfPay,
  };
}

function mapFields<T extends { name: string; nameEng: string }, V>(
  recordId: number,
  fields: T[],
  mapper: (recordId: number, field: T) => V
) {
  return fields.map((f) => mapper(recordId, f));
}

export async function createPayrollRecords(
  items: number[],
  payrollPeriodId: number,
  userId:string|null
) {
  const periods = await globalDrizzle
    .select()
    .from(payrollPeriodsTable)
    .where(eq(payrollPeriodsTable.id, payrollPeriodId))
    .limit(1);

  if (!periods.length) throw new Error("Period not found");
  if (!(await isOwner(periods[0].shopId,userId))) throw new Error("Forbidden");




  try {
    const result = await globalDrizzle.transaction(async (tx) => {
      const employees = await tx
      .select()
      .from(employeesTable)
      .where(inArray(employeesTable.id, items));

      const payloads = employees.map((emp) => ({
        employeeId:emp.id,
        salary:emp.salary,
        payrollPeriodId,
      }));

      const inserted = await tx
        .insert(payrollRecordsTable)
        .values(payloads)
        .$returningId();

      const [salaryFields, otFields, penaltyFields] = await Promise.all([
        tx.select().from(salaryFieldsTable).where(eq(salaryFieldsTable.shopId, periods[0].shopId)),
        tx.select().from(otFieldsTable).where(eq(otFieldsTable.shopId, periods[0].shopId)),
        tx.select().from(penaltyFieldsTable).where(eq(penaltyFieldsTable.shopId, periods[0].shopId)),
      ]);

      // Collect all payloads first
      const allSalaryValues: any[] = [];
      const allOtValues: any[] = [];
      const allPenaltyValues: any[] = [];

      for (const record of inserted) {
        allSalaryValues.push(...mapFields(record.id, salaryFields, mapSalaryField));
        allOtValues.push(...mapFields(record.id, otFields, mapOtField));
        allPenaltyValues.push(...mapFields(record.id, penaltyFields, mapPenaltyField));
      }

      // Bulk insert per table
      if (allSalaryValues.length) await tx.insert(payrollFieldValueTable).values(allSalaryValues);
      if (allOtValues.length) await tx.insert(otFieldValueTable).values(allOtValues);
      if (allPenaltyValues.length) await tx.insert(penaltyFieldValueTable).values(allPenaltyValues);

      return inserted;
    });

    return result;
  } catch (err: any) {
    if (err?.cause?.code === "ER_DUP_ENTRY") {
      err.message = "ER_DUP_ENTRY";
    }
    throw err;
  }
}
