import globalDrizzle from "@/db/drizzle";
import {
  otFieldValueTable,
  payrollFieldValueTable,
  payrollRecordsTable,
  penaltyFieldValueTable,
} from "@/db/schema";
import { SALARY_FIELD_DEFINATION_TYPE } from "@/types/enum/enum";
import { RecordDetails } from "@/types/RecordDetails";
import Decimal from "decimal.js";
import { eq } from "drizzle-orm";

export default async function calculateTotalSalary(
  recordId: number,
) {
  const record = await globalDrizzle
    .select()
    .from(payrollRecordsTable)
    .where(eq(payrollRecordsTable.id, recordId))
    .limit(1);

  //   if (!record.length) {
  //     return new Error("Payroll record not found");
  //   }

  const [salaryValues, otValues, penaltyValues] = await Promise.all([
    globalDrizzle
      .select()
      .from(payrollFieldValueTable)
      .where(eq(payrollFieldValueTable.payrollRecordId, recordId)),
    globalDrizzle
      .select()
      .from(otFieldValueTable)
      .where(eq(otFieldValueTable.payrollRecordId, recordId)),
    globalDrizzle
      .select()
      .from(penaltyFieldValueTable)
      .where(eq(penaltyFieldValueTable.payrollRecordId, recordId)),
  ]);

  const baseSalary = new Decimal(record[0].salary);

  // Sum income and deductions from salaryValues
  const totalSalaryIncome = salaryValues
    .filter((v) => v.type === SALARY_FIELD_DEFINATION_TYPE.INCOME)
    .reduce((sum, v) => sum.plus(new Decimal(v.amount)), baseSalary);

  const totalSalaryDeduction = salaryValues
    .filter((v) => v.type === SALARY_FIELD_DEFINATION_TYPE.DEDUCTION)
    .reduce((sum, v) => sum.plus(new Decimal(v.amount)), new Decimal(0));

  // Sum OT
  const totalOT = otValues.reduce(
    (sum, v) => sum.plus(new Decimal(v.amount)),
    new Decimal(0),
  );

  // Sum penalties
  const totalPenalty = penaltyValues.reduce(
    (sum, v) => sum.plus(new Decimal(v.amount)),
    new Decimal(0),
  );

  // Total earnings and deductions
  const totalEarning = totalSalaryIncome.plus(totalOT);
  const totalDeduction = totalSalaryDeduction.plus(totalPenalty);

  // Net
  const net = totalEarning.minus(totalDeduction);
  return {
    record: record[0],
    salaryValues,
    otValues,
    penaltyValues,
    totals: {
      totalSalaryIncome: totalSalaryIncome.toNumber(),
      totalSalaryDeduction: totalSalaryDeduction.toNumber(),
      totalOT: totalOT.toNumber(),
      totalPenalty: totalPenalty.toNumber(),
      totalEarning: totalEarning.toNumber(),
      totalDeduction: totalDeduction.toNumber(),
      net: net.toNumber(),
    },
  };
}
