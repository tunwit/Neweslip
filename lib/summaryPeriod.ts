import globalDrizzle from "@/db/drizzle";
import {
  branchesTable,
  employeesTable,
  otFieldValueTable,
  payrollFieldValueTable,
  payrollPeriodsTable,
  payrollRecordsTable,
  penaltyFieldValueTable,
} from "@/db/schema";
import { eq } from "drizzle-orm";
import { isOwner } from "./isOwner";
import calculateTotalSalary from "./calculateTotalSalary";
import Decimal from "decimal.js";
import {
  PayrollPeriodSummary,
  PayrollRecordSummary,
} from "@/types/payrollPeriodSummary";

export async function summaryPeriod(
  periodId: number,
  userId: string,
): Promise<PayrollPeriodSummary> {
  // Fetch payroll period
  const [period] = await globalDrizzle
    .select({
      id: payrollPeriodsTable.id,
      name: payrollPeriodsTable.name,
      status: payrollPeriodsTable.status,
      shopId: payrollPeriodsTable.shopId,
      start_period: payrollPeriodsTable.start_period,
      end_period: payrollPeriodsTable.end_period,
      work_hours_per_day: payrollPeriodsTable.work_hours_per_day,
      workdays_per_month: payrollPeriodsTable.workdays_per_month,
    })
    .from(payrollPeriodsTable)
    .where(eq(payrollPeriodsTable.id, Number(periodId)));

  if (!period) throw new Error("Payroll period not found");
  if (!(await isOwner(Number(period.shopId), userId)))
    throw new Error("Forbidden");

  // Fetch payroll records with employee info
  const records = await globalDrizzle
    .select({
      id: payrollRecordsTable.id,
      baseSalary: payrollRecordsTable.salary,
      employee: {
        id: employeesTable.id,
        firstName: employeesTable.firstName,
        lastName: employeesTable.lastName,
        nickName: employeesTable.nickName,
        branch: branchesTable.name,
        branchEng: branchesTable.nameEng,
      },
    })
    .from(payrollRecordsTable)
    .leftJoin(
      employeesTable,
      eq(payrollRecordsTable.employeeId, employeesTable.id),
    )
    .innerJoin(branchesTable, eq(employeesTable.branchId, branchesTable.id))
    .where(eq(payrollRecordsTable.payrollPeriodId, period.id));

  const recordsSummary: PayrollRecordSummary[] = [];

  let totalNet = 0;
  let totalBaseSalary = 0;
  let totalEarning = 0;
  let totalDeduction = 0;

  for (const r of records) {
    // Fetch payroll field values

    const fields = await globalDrizzle
      .select()
      .from(payrollFieldValueTable)
      .where(eq(payrollFieldValueTable.payrollRecordId, r.id));

    // Fetch OT fields
    const ot = await globalDrizzle
      .select()
      .from(otFieldValueTable)
      .where(eq(otFieldValueTable.payrollRecordId, r.id));

    // Fetch penalty fields
    const penalties = await globalDrizzle
      .select()
      .from(penaltyFieldValueTable)
      .where(eq(penaltyFieldValueTable.payrollRecordId, r.id));

    // Calculate total salary
    const { totals } = await calculateTotalSalary(r.id);
    totalNet += totals.net;
    totalEarning += totals.totalEarning;
    totalDeduction += totals.totalDeduction;
    totalBaseSalary += new Decimal(r.baseSalary).toNumber();

    recordsSummary.push({
      id: r.id,
      baseSalary: Number(r.baseSalary),
      employee: r.employee,
      totals: totals,
      fields,
      ot,
      penalties,
    });
  }

  return {
    ...period,
    employeeCount: records.length,
    totalNet,
    totalBaseSalary,
    totalEarning,
    totalDeduction,
    records: recordsSummary,
  };
}
