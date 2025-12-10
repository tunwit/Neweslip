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
import { clerkClient } from "@clerk/nextjs/server";

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
      finalized_at: payrollPeriodsTable.finalized_at,
      finalized_by: payrollPeriodsTable.finalized_by,
      edited: payrollPeriodsTable.edited,
    })
    .from(payrollPeriodsTable)
    .where(eq(payrollPeriodsTable.id, Number(periodId)));

  if (!period) throw new Error("Payroll period not found");
  if (!(await isOwner(Number(period.shopId), userId)))
    throw new Error("Forbidden");

  let finalizedByUser = null;
  if (period.finalized_by) {
    const client = await clerkClient();
    const clerkUser = await client.users.getUser(period.finalized_by);
    finalizedByUser = {
      id: clerkUser.id,
      firstName: clerkUser.firstName,
      lastName: clerkUser.lastName,
      fullName: clerkUser.fullName,
      email: clerkUser.primaryEmailAddress?.emailAddress,
      hasImage: clerkUser.hasImage,
      imageUrl: clerkUser.imageUrl,
      lastSignInAt: clerkUser.lastSignInAt,
      lastActiveAt: clerkUser.lastActiveAt,
    };
  }

  // Fetch payroll records with employee info
  const records = await globalDrizzle
    .select({
      id: payrollRecordsTable.id,
      baseSalary: payrollRecordsTable.salary,
      sentMail: payrollRecordsTable.sentMail,
      employee: {
        id: employeesTable.id,
        firstName: employeesTable.firstName,
        lastName: employeesTable.lastName,
        nickName: employeesTable.nickName,
        branch: branchesTable.name,
        branchEng: branchesTable.nameEng,
        email: employeesTable.email,
        bankAccountNumber: employeesTable.bankAccountNumber,
        bankAccountOwner: employeesTable.bankAccountOwner,
        bankName: employeesTable.bankName,
        promtpay: employeesTable.promtpay,
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
      sentMail: r.sentMail || false,
      baseSalary: Number(r.baseSalary),
      employee: {
        id: r.employee.id ?? 0,
        firstName: r.employee.firstName ?? "",
        lastName: r.employee.lastName ?? "",
        nickName: r.employee.nickName ?? "",
        branch: r.employee.branch,
        branchEng: r.employee.branchEng,
        email: r.employee.email ?? "",
        bankAccountNumber: r.employee.bankAccountNumber ?? "",
        bankAccountOwner: r.employee.bankAccountOwner ?? "",
        bankName: r.employee.bankName ?? "",
        promtpay: r.employee.promtpay ?? "",
      },
      totals: totals,
      fields,
      ot,
      penalties,
    });
  }

  return {
    ...period,
    start_period: period.start_period?.toISOString(),
    end_period: period.end_period?.toISOString(),
    finalized_at: period.finalized_at?.toISOString() || "",
    work_hours_per_day: 8,
    workdays_per_month: 22,
    edited: period.edited || false,
    finalizedByUser,
    employeeCount: records.length,
    totalNet,
    totalBaseSalary,
    totalEarning,
    totalDeduction,
    records: recordsSummary,
  };
}
