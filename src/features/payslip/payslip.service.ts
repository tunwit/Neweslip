import globalDrizzle from "@/db/drizzle";
import {
  branchesTable,
  employeesTable,
  payrollPeriodsTable,
  payrollRecordsTable,
  shopsTable,
} from "@/db/schema";
import calculateTotalSalary from "@/lib/calculateTotalSalary";
import generateHTMLPayslip from "@/lib/generateHTMLPayslip";
import { eq } from "drizzle-orm";
import fs from "fs/promises";
import path from "path";
import os from "os";
import puppeteer from "puppeteer";

export class PayslipService {
  async getTempPayslipPath(jobId: string, fileName: string) {
    const baseDir = path.join(os.tmpdir(), "mitr", "payslips", jobId);
    return {
      dir: baseDir,
      file: path.join(baseDir, fileName),
    };
  }

  async buildPayslipData(shopId: number, recordId: number) {
    const [record] = await globalDrizzle
      .select()
      .from(payrollRecordsTable)
      .where(eq(payrollRecordsTable.id, recordId));

    if (!record) {
      throw new Error("Payroll record not found");
    }

    // 2️⃣ Fetch related entities in parallel
    const [[employee], [period], [shop], salaryData] = await Promise.all([
      globalDrizzle
        .select()
        .from(employeesTable)
        .where(eq(employeesTable.id, record.employeeId)),

      globalDrizzle
        .select()
        .from(payrollPeriodsTable)
        .where(eq(payrollPeriodsTable.id, record.payrollPeriodId)),

      globalDrizzle.select().from(shopsTable).where(eq(shopsTable.id, shopId)),

      calculateTotalSalary(recordId),
    ]);

    if (!employee || !period || !shop) {
      throw new Error("Payslip dependency missing");
    }

    const [branch] = await globalDrizzle
      .select()
      .from(branchesTable)
      .where(eq(branchesTable.id, employee.branchId));

    return {
      shop,
      employee,
      branch,
      period,
      record,
      salary: {
        ...salaryData,
        note: salaryData.note || "",
      },
    };
  }

  async generateHTML(shopId: number, recordId: number, jobId: string) {
    const data = await this.buildPayslipData(shopId, recordId);
    const html = generateHTMLPayslip(
      data.shop,
      data.employee,
      data.branch,
      data.period,
      data.record,
      data.salary,
    );
    return html;
  }

  async generatePDF(html: string, jobId: string) {
    const browser = await puppeteer.launch({
      headless: true,
    });
    const page = await browser.newPage();

    await page.setContent(html, { waitUntil: "domcontentloaded" });

    const pdf = await page.pdf({
      width: "210mm",
      height: "297mm", // A4
      printBackground: true,
      pageRanges: "1",
    });

    await browser.close();
    const { dir, file } = await this.getTempPayslipPath(
      jobId,
      "payslipPDF.pdf",
    );
    await fs.mkdir(dir, { recursive: true });
    await fs.writeFile(file, pdf);
    return file;
  }
}
