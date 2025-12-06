import { payrollRecordsTable } from "@/db/schema";
import { Branch } from "@/types/branch";
import { Employee } from "@/types/employee";
import { SALARY_FIELD_DEFINATION_TYPE } from "@/types/enum/enum";
import { PayrollPeriod } from "@/types/payrollPeriod";
import {
  PayrollPeriodSummary,
  PayrollRecordSummary,
} from "@/types/payrollPeriodSummary";
import { PayrollRecord } from "@/types/payrollRecord";
import { RecordDetails } from "@/types/RecordDetails";
import { Shop } from "@/types/shop";
import { dateFormat, moneyFormat } from "@/utils/formmatter";
import { InferSelectModel } from "drizzle-orm";
import nunjucks from "nunjucks";

export default function generateHTMLPayslip(
  shop: Shop,
  employee: Employee,
  branch: Branch,
  period: Omit<PayrollPeriod, "totalNet" | "employeeCount">,
  record: InferSelectModel<typeof payrollRecordsTable>,
  data: RecordDetails,
) {
  const render = {
    company: { name: shop.name, taxId: shop.taxId },
    employee: {
      position: employee.position,
      branch: { name: branch.name, address: branch.address },
      name: `${employee.firstName} ${employee.lastName}`,
      id: employee.id,
    },
    payPeriod: `${dateFormat(new Date(period.start_period))} - ${dateFormat(new Date(period.end_period))}`,
    earnings: [
      {
        description: "ค่าจ้าง",
        amount: moneyFormat(record.salary),
      },
      ...data.salaryValues
        .filter((s) => s.type === SALARY_FIELD_DEFINATION_TYPE.INCOME)
        .map((s) => {
          return {
            description: s.name,
            amount: moneyFormat(s.amount),
          };
        }),
    ],
    overtime: [
      ...data.otValues.map((s) => {
        return {
          description: s.name,
          value: s.value,
          amount: moneyFormat(s.amount),
        };
      }),
    ],
    deductions: [
      ...data.salaryValues
        .filter((s) => s.type === SALARY_FIELD_DEFINATION_TYPE.DEDUCTION)
        .map((s) => {
          return {
            description: s.name,
            amount: moneyFormat(s.amount),
          };
        }),
    ],
    penalties: [
      ...data.penaltyValues.map((s) => {
        return {
          description: s.name,
          value: s.value,
          amount: moneyFormat(s.amount),
        };
      }),
    ],
    details: [
      ...data.salaryValues
        .filter((s) => s.type === SALARY_FIELD_DEFINATION_TYPE.NON_CALCULATED)
        .map((s) => {
          return {
            description: s.name,
            amount: moneyFormat(s.amount),
          };
        }),
    ],
    summary: {
      grossEarnings: moneyFormat(data.totals.totalSalaryIncome),
      totalOvertime: moneyFormat(data.totals.totalOT),
      totalEarnings: moneyFormat(data.totals.totalEarning),
      totalDeductions: moneyFormat(data.totals.totalSalaryDeduction),
      totalPenalties: moneyFormat(data.totals.totalPenalty),
      totalDeducted: moneyFormat(data.totals.totalDeduction),
      netPay: moneyFormat(data.totals.net),
    },
  };

  const html = nunjucks.render("assets/template/test.html", render);
  return html;
}
