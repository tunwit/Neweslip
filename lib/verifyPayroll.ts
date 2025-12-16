import {
  branchesTable,
  employeesTable,
  otFieldValueTable,
  payrollFieldValueTable,
  payrollPeriodsTable,
  payrollRecordsTable,
  penaltyFieldValueTable,
} from "@/db/schema";
import {
  OT_METHOD,
  PAYROLL_PROBLEM,
  PAYROLL_PROBLEM_CODE,
} from "@/types/enum/enum";
import { eq, inArray } from "drizzle-orm";
import globalDrizzle from "@/db/drizzle";
import calculateTotalSalary from "./calculateTotalSalary";
import Decimal from "decimal.js";
import { calculateOT } from "./otCalculater";
import { calculatePenalty } from "./penaltyCalculater";
import { PayrollProblem } from "@/types/payrollProblem";

function groupBy<
  T,
  K extends keyof T,
  KeyType extends string | number | symbol = T[K] & (string | number | symbol),
>(rows: T[], key: K): Record<KeyType, T[]> {
  return rows.reduce(
    (acc, row) => {
      const groupKey = row[key] as KeyType;
      (acc[groupKey] ||= []).push(row);
      return acc;
    },
    {} as Record<KeyType, T[]>,
  );
}

export default async function verifyPayroll(periodId: number) {
  let problems: PayrollProblem[] = [];
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
  if (records.length < 1) {
    problems.push({
      type: PAYROLL_PROBLEM.CRITICAL,
      employee: { firstName: "Period", lastName: "System" },
      code: PAYROLL_PROBLEM_CODE.NO_EMPLOYEE,
      meta: {},
    });
  }
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
        employee: {
          firstName: r.employee.firstName,
          lastName: r.employee.lastName,
        },
        code: PAYROLL_PROBLEM_CODE.BASE_SALARY_ZERO,
        meta: {
          salary: r.payrollRecord.salary,
        },
      });
    }

    if (totals.net < 0) {
      problems.push({
        type: PAYROLL_PROBLEM.WARNNING,
        employee: r.employee,
        code: PAYROLL_PROBLEM_CODE.NET_NEGATIVE,
        meta: {
          net: totals.net,
        },
      });
    } else if (totals.net === 0) {
      problems.push({
        type: PAYROLL_PROBLEM.WARNNING,
        employee: r.employee,
        code: PAYROLL_PROBLEM_CODE.NET_ZERO,
        meta: {
          net: totals.net,
        },
      });
    }

    if (totals.totalDeduction > totals.totalEarning) {
      problems.push({
        type: PAYROLL_PROBLEM.WARNNING,
        employee: r.employee,
        code: PAYROLL_PROBLEM_CODE.DEDUCTION_EXCEED_EARNING,
        meta: {
          deduction: totals.totalDeduction,
          earning: totals.totalEarning,
        },
      });
    }

    if (
      new Decimal(totals.totalEarning)
        .sub(totals.totalDeduction)
        .sub(totals.net)
        .abs()
        .gt(0.01)
    ) {
      problems.push({
        type: PAYROLL_PROBLEM.CRITICAL,
        employee: r.employee,
        code: PAYROLL_PROBLEM_CODE.NET_MISMATCH,
        meta: {
          earning: totals.totalEarning,
          deduction: totals.totalDeduction,
          net: totals.net,
        },
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
        code: PAYROLL_PROBLEM_CODE.OT_HOURS_EXCEED_LIMIT,
        meta: {
          hours: totalOtHours,
          limit: 144,
        },
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
          code: PAYROLL_PROBLEM_CODE.OT_AMOUNT_MISMATCH,
          meta: {
            actual: o.amount,
            expected: expectedAmount,
          },
        });
      }

      if (Number(o.value) < 0 || Number(o.amount) < 0) {
        problems.push({
          type: PAYROLL_PROBLEM.CRITICAL,
          employee: r.employee,
          code: PAYROLL_PROBLEM_CODE.OT_NEGATIVE,
          meta: {
            value: o.value,
            amount: o.amount,
          },
        });
      }
    });

    if (totals.totalPenalty > totals.totalEarning) {
      problems.push({
        type: PAYROLL_PROBLEM.WARNNING,
        employee: r.employee,
        code: PAYROLL_PROBLEM_CODE.PENALTY_EXCEED_GROSS,
        meta: {
          penalty: totals.totalPenalty,
          earning: totals.totalEarning,
        },
      });
    }

    if (totals.totalPenalty > Number(r.payrollRecord.salary) * 0.3) {
      problems.push({
        type: PAYROLL_PROBLEM.WARNNING,
        employee: r.employee,
        code: PAYROLL_PROBLEM_CODE.PENALTY_EXCEED_30_PERCENT,
        meta: {
          penalty: totals.totalPenalty,
          salary: r.payrollRecord.salary,
          percent: 30,
        },
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
          code: PAYROLL_PROBLEM_CODE.PENALTY_NEGATIVE,
          meta: {
            value: p.value,
            amount: p.amount,
          },
        });
      }
    });

    if (Math.abs(Number(totals.totalPenalty) - totalPenalty) > 0.01) {
      problems.push({
        type: PAYROLL_PROBLEM.CRITICAL,
        employee: r.employee,
        code: PAYROLL_PROBLEM_CODE.PENALTY_MISMATCH,
        meta: {
          actual: totals.totalPenalty,
          expected: totalPenalty,
        },
      });
    }
  }
  return problems;
}
