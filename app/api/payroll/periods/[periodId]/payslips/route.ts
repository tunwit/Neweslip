import {
  branchesTable,
  employeesTable,
  payrollPeriodsTable,
  payrollRecordsTable,
  shopsTable,
} from "@/db/schema";

import globalDrizzle from "@/db/drizzle";
import { errorResponse } from "@/utils/respounses/respounses";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import nunjucks from "nunjucks";
import JSZip from "jszip";

import calculateTotalSalary from "@/lib/calculateTotalSalary";
import { and, eq, inArray } from "drizzle-orm";
import { dateFormat, moneyFormat } from "@/utils/formmatter";
import { SALARY_FIELD_DEFINATION_TYPE } from "@/types/enum/enum";

nunjucks.configure({ autoescape: true });

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ periodId: string }> },
) {
  try {
    const periodId = (await params).periodId;

    const { userId } = await auth();
    if (!userId) return errorResponse("Unauthorized", 401);

    if (!periodId) return errorResponse("Illegal Arguments", 400);

    // 1️⃣ fetch all records in this period
    const records = await globalDrizzle
      .select()
      .from(payrollRecordsTable)
      .where(eq(payrollRecordsTable.payrollPeriodId, Number(periodId)));

    if (records.length === 0)
      return errorResponse("No records in this period", 404);

    // 2️⃣ fetch period + shop
    const [period] = await globalDrizzle
      .select()
      .from(payrollPeriodsTable)
      .where(eq(payrollPeriodsTable.id, Number(periodId)));

    const [shop] = await globalDrizzle
      .select()
      .from(shopsTable)
      .where(eq(shopsTable.id, period.shopId));

    // 🚀 OPTIMIZATION: Fetch ALL employees and branches at once
    const employeeIds = records.map((r) => r.employeeId);

    const employees = await globalDrizzle
      .select()
      .from(employeesTable)
      .where(inArray(employeesTable.id, employeeIds));

    const employeeMap = new Map(employees.map((e) => [e.id, e]));

    const branchIds = [...new Set(employees.map((e) => e.branchId))];
    const branches = await globalDrizzle
      .select()
      .from(branchesTable)
      .where(inArray(branchesTable.id, branchIds));

    const branchMap = new Map(branches.map((b) => [b.id, b]));

    // 🚀 OPTIMIZATION: Calculate all salaries in parallel
    const salaryDataPromises = records.map((record) =>
      calculateTotalSalary(record.id),
    );
    const salaryDataResults = await Promise.all(salaryDataPromises);
    const salaryDataMap = new Map(
      records.map((record, idx) => [record.id, salaryDataResults[idx]]),
    );

    const zip = new JSZip();

    for (const record of records) {
      const employee = employeeMap.get(record.employeeId)!;
      const branch = branchMap.get(employee.branchId)!;
      const data = salaryDataMap.get(record.id)!;

      const render = {
        company: { name: shop.name, address: "...", contact: "..." },
        employee: {
          position: employee.position,
          branch: branch.name,
          name: `${employee.firstName} ${employee.lastName}`,
          id: employee.id,
        },
        payPeriod: `${dateFormat(new Date(period.start_period))} - ${dateFormat(
          new Date(period.end_period),
        )}`,
        earnings: [
          {
            description: "ค่าจ้าง",
            amount: moneyFormat(record.salary),
          },
          ...data.salaryValues
            .filter((s) => s.type === SALARY_FIELD_DEFINATION_TYPE.INCOME)
            .map((s) => ({
              description: s.name,
              amount: moneyFormat(s.amount),
            })),
        ],
        overtime: data.otValues.map((s) => ({
          description: s.name,
          value: s.value,
          amount: moneyFormat(s.amount),
        })),
        deductions: data.salaryValues
          .filter((s) => s.type === SALARY_FIELD_DEFINATION_TYPE.DEDUCTION)
          .map((s) => ({
            description: s.name,
            amount: moneyFormat(s.amount),
          })),
        penalties: data.penaltyValues.map((s) => ({
          description: s.name,
          value: s.value,
          amount: moneyFormat(s.amount),
        })),
        details: data.salaryValues
          .filter((s) => s.type === SALARY_FIELD_DEFINATION_TYPE.NON_CALCULATED)
          .map((s) => ({
            description: s.name,
            amount: moneyFormat(s.amount),
          })),
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
      const branchFolderName = branch.name.replace(/[/\\?%*:|"<>]/g, "-"); // Sanitize folder name
      zip.file(`${branchFolderName}/payslip_${employee.id}.html`, html);
    }

    // 4️⃣ Generate zip output
    const zipData = await zip.generateAsync({ type: "blob" });
    return new NextResponse(zipData, {
      headers: {
        "Content-Type": "application/zip",
        "Content-Disposition": `attachment; filename="payslips_period_${periodId}.zip"`,
      },
    });
  } catch (err) {
    console.error(err);
    return errorResponse("Internal server error", 500);
  }
}
