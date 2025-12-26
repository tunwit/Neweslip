import { EmailPayload } from "@/types/mailPayload";
import { Worker } from "bullmq";
import globalDrizzle from "@/db/drizzle";
import { buildTransporter } from "../lib/buildTransporter";
import { connection } from "../queues/email.queue";
import {
  branchesTable,
  employeesTable,
  payrollPeriodsTable,
  payrollRecordsTable,
  shopsTable,
} from "@/db/schema";
import { eq } from "drizzle-orm";
import { PAY_PERIOD_STATUS } from "@/types/enum/enum";
import { isOwner } from "@/lib/isOwner";
import calculateTotalSalary from "@/lib/calculateTotalSalary";
import generateHTMLPayslip from "@/lib/generateHTMLPayslip";
import { sendMail } from "../lib/emailService";
import { htmlToPdf } from "../lib/htmlTopdf";

export const emailWorker = new Worker<
  EmailPayload & {
    batchId: string;
  }
>(
  "send-email-payslip",
  async (job) => {
    await job.updateProgress({ status: "started" });
    const transporter = await buildTransporter(1);
    if (!transporter) return;
    const {
      id,
      email,
      metaData: { userId },
    } = job.data;

    const [result] = await globalDrizzle
      .select({
        record: payrollRecordsTable,
        period: payrollPeriodsTable,
        employee: employeesTable,
        shop: shopsTable,
        branch: branchesTable,
      })
      .from(payrollRecordsTable)
      .innerJoin(
        payrollPeriodsTable,
        eq(payrollRecordsTable.payrollPeriodId, payrollPeriodsTable.id),
      )
      .innerJoin(
        employeesTable,
        eq(payrollRecordsTable.employeeId, employeesTable.id),
      )
      .innerJoin(shopsTable, eq(payrollPeriodsTable.shopId, shopsTable.id))
      .innerJoin(branchesTable, eq(employeesTable.branchId, branchesTable.id))
      .where(eq(payrollRecordsTable.id, id))
      .limit(1);

    const { record, period, employee, shop, branch } = result;
    if (!record) return;

    if (period.status === PAY_PERIOD_STATUS.DRAFT) {
      return;
    }
    if (!(await isOwner(Number(period.shopId), userId))) {
      return;
    }

    const salaryData = await calculateTotalSalary(id);

    const html = generateHTMLPayslip(
      shop,
      employee,
      branch,
      period,
      record,
      salaryData,
    );
    const pdf = await htmlToPdf(html);
    await sendMail({
      email: "kinmour@gmail.com",
      emailName: shop.emailName || "",
      subject: `สลิปเงินเดือนของ ${employee.firstName}`,
      html: html,
      attachments: [
        {
          filename: `payslip-${employee.firstName}.pdf`,
          content: pdf, // 🔥 Buffer
          contentType: "application/pdf",
        },
      ],
      senderAddress: shop.emailAddress || "",
      transporter: transporter,
    });
    await job.updateProgress({ status: "completed" });
  },
  {
    connection,
    concurrency: 5,
  },
);

emailWorker.on("completed", async (job) => {
  const batchId = job.data.batchId;
  if (!batchId) return;

  await connection.incr(`email:batch:${batchId}:completed`);
  console.log(`✅ Sent`);
});

emailWorker.on("failed", async (job, err) => {
  const batchId = job?.data.batchId;
  if (!batchId) return;

  await connection.incr(`email:batch:${batchId}:failed`);
  console.error(`❌ Failed ${job?.data}`, err);
});
