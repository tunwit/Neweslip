import {
  branchesTable,
  employeesTable,
  otFieldsTable,
  payrollPeriodsTable,
  payrollRecordsTable,
  penaltyFieldsTable,
  shopOwnerTable,
  shopsTable,
} from "@/db/schema";
import globalDrizzle from "@/db/drizzle";
import { errorResponse, successResponse } from "@/utils/respounses/respounses";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { exportSummaryAsExcel } from "@/lib/exportSummaryAsExcel";
import { summaryPeriod } from "@/lib/summaryPeriod";
import calculateTotalSalary from "@/lib/calculateTotalSalary";
import { and, eq } from "drizzle-orm";
import nunjucks from "nunjucks";
import { dateFormat, moneyFormat } from "@/utils/formmatter";
import { SALARY_FIELD_DEFINATION_TYPE } from "@/types/enum/enum";
import generateHTMLPayslip from "@/lib/generateHTMLPayslip";

nunjucks.configure({
  autoescape: true,
});

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ recordId: string }> },
) {
  try {
    const recordId = (await params).recordId;
    const { userId } = await auth();
    if (!userId) return errorResponse("Unauthorized", 401);
    if (!recordId) return errorResponse("Illegal Arguments", 400);

    const [record] = await globalDrizzle
      .select()
      .from(payrollRecordsTable)
      .where(eq(payrollRecordsTable.id, Number(recordId)))
      .limit(1);

    const [employee] = await globalDrizzle
      .select()
      .from(employeesTable)
      .where(eq(employeesTable.id, Number(record.employeeId)))
      .limit(1);

    const [period] = await globalDrizzle
      .select()
      .from(payrollPeriodsTable)
      .where(eq(payrollPeriodsTable.id, record.payrollPeriodId))
      .limit(1);

    const [shop] = await globalDrizzle
      .select()
      .from(shopsTable)
      .where(eq(shopsTable.id, period.shopId))
      .limit(1);

    const [branch] = await globalDrizzle
      .select()
      .from(branchesTable)
      .where(and(eq(branchesTable.id, Number(employee.branchId))))
      .limit(1);

    const data = await calculateTotalSalary(Number(recordId));

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

    const html = generateHTMLPayslip(
      shop,
      employee,
      branch,
      period,
      record,
      data,
    );
    return new NextResponse(html, {
      headers: {
        "Content-Type": "text/html",
        "Content-Disposition": `attachment; filename="payslip_${employee.id}.html"`,
      },
    });
  } catch (err) {
    console.error(err);
    return errorResponse("Internal server error", 500);
  }
}
