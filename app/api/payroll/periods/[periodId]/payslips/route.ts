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
import { and, eq, inArray, not } from "drizzle-orm";
import { dateFormat, moneyFormat } from "@/utils/formmatter";
import {
  PAY_PERIOD_STATUS,
  SALARY_FIELD_DEFINATION_TYPE,
} from "@/types/enum/enum";
import generateHTMLPayslip from "@/lib/generateHTMLPayslip";

nunjucks.configure({ autoescape: true });

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ periodId: string }> },
) {
  try {
    const periodId = (await params).periodId;
    const recordIds: number[] = await request.json();

    const { userId } = await auth();
    if (!userId) return errorResponse("Unauthorized", 401);

    if (!periodId) return errorResponse("Illegal Arguments", 400);

    // 1️⃣ fetch all records in this period
    const records = await globalDrizzle
      .select()
      .from(payrollRecordsTable)
      .where(
        and(
          eq(payrollRecordsTable.payrollPeriodId, Number(periodId)),
          inArray(payrollRecordsTable.id, recordIds),
        ),
      );

    if (records.length === 0)
      return errorResponse("No records in this period", 404);

    // 2️⃣ fetch period + shop
    const [period] = await globalDrizzle
      .select()
      .from(payrollPeriodsTable)
      .where(eq(payrollPeriodsTable.id, Number(periodId)));

    if (period.status === PAY_PERIOD_STATUS.DRAFT) {
      return errorResponse("Cannot send unfinalized period", 403);
    }

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
    let html;
    for (const record of records) {
      const employee = employeeMap.get(record.employeeId)!;
      const branch = branchMap.get(employee.branchId)!;
      const data = salaryDataMap.get(record.id)!;

      html = generateHTMLPayslip(shop, employee, branch, period, record, {
        ...data,
        note: data.note || "",
      });

      const branchFolderName = branch.name.replace(/[/\\?%*:|"<>]/g, "-"); // Sanitize folder name
      if (records.length > 1)
        zip.file(
          `${branchFolderName}/payslip_${employee.id}_${employee.firstName}.html`,
          html,
        );
    }

    if (records.length > 1) {
      const zipData = await zip.generateAsync({ type: "blob" });
      return new NextResponse(zipData, {
        headers: {
          "Content-Type": "application/zip",
          "Content-Disposition": `attachment; filename="payslips_period_${periodId}.zip"`,
        },
      });
    } else {
      return new NextResponse(html, {
        headers: {
          "Content-Type": "text/html",
          "Content-Disposition": `attachment; filename="payslip_${records[0].id}.html"`,
        },
      });
    }
  } catch (err) {
    console.error(err);
    return errorResponse("Internal server error", 500);
  }
}
