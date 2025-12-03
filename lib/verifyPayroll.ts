import { branchesTable, employeesTable, otFieldValueTable, payrollFieldValueTable, payrollPeriodsTable, payrollRecordsTable, penaltyFieldValueTable } from "@/db/schema";
import { OT_METHOD, PAYROLL_PROBLEM } from "@/types/enum/enum";
import { moneyFormat } from "@/utils/formmatter";
import { eq, inArray } from "drizzle-orm";
import globalDrizzle from "@/db/drizzle";
import calculateTotalSalary from "./calculateTotalSalary";
import Decimal from "decimal.js";
import { calculateOT } from "./otCalculater";
import { calculatePenalty } from "./penaltyCalculater";

const groupBy = (rows, key) =>
  rows.reduce((acc, row) => {
    (acc[row[key]] ||= []).push(row);
    return acc;
  }, {});

export default async function verifyPayroll(periodId:number){
    let problems = [];
      const [period] = await globalDrizzle
        .select()
        .from(payrollPeriodsTable)
        .where(eq(payrollPeriodsTable.id, Number(periodId)))
        .limit(1);
    
      const records = await globalDrizzle
        .select({
          payrollRecord: payrollRecordsTable,
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
        .where(eq(payrollRecordsTable.payrollPeriodId, Number(periodId)));
    
      const recordIds = records.map((r) => r.payrollRecord.id);
    
      const allFieldValues = await globalDrizzle
        .select()
        .from(payrollFieldValueTable)
        .where(inArray(payrollFieldValueTable.payrollRecordId, recordIds));
    
      const allOtValues = await globalDrizzle
        .select()
        .from(otFieldValueTable)
        .where(inArray(otFieldValueTable.payrollRecordId, recordIds));
    
      const allPenaltyValues = await globalDrizzle
        .select()
        .from(penaltyFieldValueTable)
        .where(inArray(penaltyFieldValueTable.payrollRecordId, recordIds));
    
      const otByRecord = groupBy(allOtValues, "payrollRecordId");
      const penaltiesByRecord = groupBy(allPenaltyValues, "payrollRecordId");
      const fieldsByRecord = groupBy(allFieldValues, "payrollRecordId");
    
      let totalNet = 0;
      for (const r of records) {
        const { totals } = await calculateTotalSalary(r.payrollRecord.id);
        totalNet += totals.net;
    
        const salaryFields = fieldsByRecord[r.payrollRecord.id] ?? [];
        const ot = otByRecord[r.payrollRecord.id] ?? [];
        const penalties = penaltiesByRecord[r.payrollRecord.id] ?? [];
    
        if (Number(r.payrollRecord.salary) <= 0) {
          problems.push({
            type: PAYROLL_PROBLEM.WARNNING,
            employee: r.employee,
            message: "Base salary is equal or below zero",
          });
        }
    
        if (totals.net < 0) {
          problems.push({
            type: PAYROLL_PROBLEM.WARNNING,
            employee: r.employee,
            message: `Net salary is negative (${moneyFormat(totals.net)}) - please verify`,
          });
        } else if (totals.net === 0) {
          problems.push({
            type: PAYROLL_PROBLEM.WARNNING,
            employee: r.employee,
            message: `Net salary is zero (${moneyFormat(totals.net)}) - please verify`,
          });
        }
    
        if (totals.totalDeduction > totals.totalEarning) {
          problems.push({
            type: PAYROLL_PROBLEM.WARNNING,
            employee: r.employee,
            message: `Total deductions (${moneyFormat(totals.totalDeduction)}) exceed gross salary (${moneyFormat(totals.totalEarning)})`,
          });
        }
    
        if (new Decimal(totals.totalEarning)
          .sub(totals.totalDeduction)
          .sub(totals.net)
          .abs()
          .gt(0.01)) {
          problems.push({
            type: PAYROLL_PROBLEM.CRITICAL,
            employee: r.employee,
            message: "Net salary does not match gross minus deductions",
          });
        }
    
        const totalOtHours = ot.reduce((sum, o) => {
          if (o.method === OT_METHOD.DAILY) {
            // If OT is daily, multiply by work hours per day
            return sum + Number(o.value) * Number(period.work_hours_per_day);
          } else if (o.method === OT_METHOD.HOURLY) {
            return sum + Number(o.value);
          }
          return sum;
        }, 0);
    
        if (totalOtHours > 144) {
          problems.push({
            type: PAYROLL_PROBLEM.CRITICAL,
            employee: r.employee,
            message: `Total OT hours (${moneyFormat(totalOtHours)}) exceed monthly limit (144)`,
          });
        }
    
        ot.forEach((o) => {
          const expectedAmount = calculateOT(
            new Decimal(r.payrollRecord.salary),
            Number(o.value),
            o.type,
            o.method,
            new Decimal(period.work_hours_per_day || 8),
            new Decimal(period.workdays_per_month || 22),
            o.rate,
            o.rateOfPay,
          );
    
          if (Math.abs(Number(o.amount) - expectedAmount) > 0.01) {
            problems.push({
              type: PAYROLL_PROBLEM.CRITICAL,
              employee: r.employee,
              message: `OT amount (${moneyFormat(o.amount)}}) does not match expected value (${moneyFormat(expectedAmount)}) please contact developer`,
            });
          }
    
          if (Number(o.value) < 0 || Number(o.amount) < 0) {
            problems.push({
              type: PAYROLL_PROBLEM.CRITICAL,
              employee: r.employee,
              message: "OT hours or amount cannot be negative",
            });
          }
        });
    
        if (totals.totalPenalty > totals.totalEarning) {
          problems.push({
            type: PAYROLL_PROBLEM.WARNNING,
            employee: r.employee,
            message: `Penalty (${moneyFormat(totals.totalPenalty)}) is greater than the employee gross salary (${moneyFormat(totals.totalEarning)}).`,
          });
        }
        if (totals.totalPenalty > Number(r.payrollRecord.salary) * 0.3) {
          problems.push({
            type: PAYROLL_PROBLEM.WARNNING,
            employee: r.employee,
            message: `Employee has unusually high penalties (${moneyFormat(totals.totalPenalty)}), exceeding 30% of base salary.`,
          });
        }
    
        let totalPenalty = 0;
    
        penalties.forEach((p) => {
          const expectedAmount = calculatePenalty(
            new Decimal(r.payrollRecord.salary),
            Number(p.value),
            p.type,
            p.method,
            new Decimal(period.work_hours_per_day || 8),
            new Decimal(period.workdays_per_month || 22),
            p.rateOfPay,
          );
          totalPenalty += expectedAmount;
    
          if (Number(p.value) < 0 || Number(p.amount) < 0) {
            problems.push({
              type: PAYROLL_PROBLEM.CRITICAL,
              employee: r.employee,
              message: "Penalty value or amount cannot be negative",
            });
          }
        });
    
        if (Math.abs(Number(totals.totalPenalty) - totalPenalty) > 0.01) {
          problems.push({
            type: PAYROLL_PROBLEM.CRITICAL,
            employee: r.employee,
            message: `Penalty amount (${moneyFormat(totals.totalPenalty)}) does not match expected value (${moneyFormat(totalPenalty)})`,
          });
        }
    }
    return problems
}