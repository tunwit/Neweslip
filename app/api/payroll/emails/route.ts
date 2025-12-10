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
import { count } from "console";
import { and, eq, inArray } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import { isOwner } from "@/lib/isOwner";
import { Owner } from "@/types/owner";
import { OtField } from "@/types/otField";
import { PenaltyField } from "@/types/penaltyField";
import { PAY_PERIOD_STATUS } from "@/types/enum/enum";
import { sendMail } from "@/lib/emailService";
import generateHTMLPayslip from "@/lib/generateHTMLPayslip";
import calculateTotalSalary from "@/lib/calculateTotalSalary";
import { RecordDetails } from "@/types/RecordDetails";

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return errorResponse("Unauthorized", 401);
    }

    const body: { id: number; email: string }[] = await request.json();
    const ids = body.map((item) => item.id);

    // Setup SSE
    const encoder = new TextEncoder();
    let success: number[] = [];
    const stream = new ReadableStream({
      async start(controller) {
        const sendProgress = (data: any) => {
          controller.enqueue(
            encoder.encode(`data: ${JSON.stringify(data)}\n\n`),
          );
        };

        try {
          sendProgress({ type: "init", total: body.length, current: 0 });

          // Fetch all data
          const records = await globalDrizzle
            .select()
            .from(payrollRecordsTable)
            .where(inArray(payrollRecordsTable.id, ids));

          if (records.length === 0) {
            sendProgress({ type: "error", message: "No records found" });
            controller.close();
            return;
          }

          sendProgress({
            type: "progress",
            message: "Fetching employee data...",
          });

          const employeeIds = [...new Set(records.map((r) => r.employeeId))];
          const periodIds = [...new Set(records.map((r) => r.payrollPeriodId))];

          const [periods, employees] = await Promise.all([
            globalDrizzle
              .select()
              .from(payrollPeriodsTable)
              .where(inArray(payrollPeriodsTable.id, periodIds)),
            globalDrizzle
              .select()
              .from(employeesTable)
              .where(inArray(employeesTable.id, employeeIds)),
          ]);

          const period = periods[0];
          if (period.status === PAY_PERIOD_STATUS.DRAFT) {
            sendProgress({
              type: "error",
              message: "Cannot send unfinalized period",
            });
            controller.close();
            return;
          }

          if (!(await isOwner(Number(period.shopId), userId))) {
            sendProgress({ type: "error", message: "Forbidden" });
            controller.close();
            return;
          }

          const branchIds = [...new Set(employees.map((e) => e.branchId))];

          sendProgress({
            type: "progress",
            message: "Loading shop configuration...",
          });

          const [shop, branches] = await Promise.all([
            globalDrizzle
              .select()
              .from(shopsTable)
              .where(eq(shopsTable.id, period.shopId))
              .limit(1)
              .then((res) => res[0]),
            globalDrizzle
              .select()
              .from(branchesTable)
              .where(inArray(branchesTable.id, branchIds)),
          ]);

          if (!shop.SMTPHost || !shop.emailAddress || !shop.SMTPPort) {
            sendProgress({ type: "error", message: "Email not configured" });
            controller.close();
            return;
          }

          // Create lookup maps
          const employeeMap = new Map(employees.map((e) => [e.id, e]));
          const branchMap = new Map(branches.map((b) => [b.id, b]));
          const recordMap = new Map(records.map((r) => [r.id, r]));
          const periodMap = new Map(periods.map((p) => [p.id, p]));

          sendProgress({
            type: "progress",
            message: "Calculating salaries...",
          });

          const salaryData = await Promise.all(
            body.map((item) => calculateTotalSalary(Number(item.id))),
          );

          sendProgress({
            type: "progress",
            message: "Processing...",
            current: 0,
          });

          // Track progress with atomic counters
          const progress = { completed: 0, failed: 0 };

          // Send all emails in parallel with progress tracking
          const emailPromises = body.map(async (item, index) => {
            const record = recordMap.get(item.id);

            if (!record) {
              progress.failed++;
              sendProgress({
                type: "item_failed",
                current: progress.completed + progress.failed,
                total: body.length,
                email: item.email,
                error: "Record not found",
              });
              return { success: false, email: item.email };
            }

            const employee = employeeMap.get(record.employeeId);
            if (!employee) {
              progress.failed++;
              sendProgress({
                type: "item_failed",
                current: progress.completed + progress.failed,
                total: body.length,
                email: item.email,
                error: "Employee not found",
              });
              return { success: false, email: item.email };
            }

            const branch = branchMap.get(employee.branchId);
            const recordPeriod = periodMap.get(record.payrollPeriodId);
            const data = salaryData[index];
            if (!branch || !recordPeriod)
              return errorResponse("data not found", 404);
            if (
              !shop.SMTPHost ||
              !shop.SMTPPort ||
              !shop.SMTPSecure ||
              !shop.emailAddress ||
              !shop.emailPassword ||
              !shop.emailAddress ||
              !shop.emailName
            )
              return errorResponse("email not set", 405);

            try {
              const html = generateHTMLPayslip(
                shop,
                employee,
                branch,
                recordPeriod,
                record,
                data,
              );

              await sendMail({
                host: shop.SMTPHost,
                port: shop.SMTPPort,
                secure: shop.SMTPSecure,
                username: shop.emailAddress,
                password: shop.emailPassword,
                senderAddress: shop.emailAddress,
                emailName: shop.emailName,
                email: item.email,
                subject: "Your payroll is available!!",
                html: html,
                attachments: [
                  {
                    filename: `payslip-${item.id}.html`,
                    content: html,
                    contentType: "application/html",
                  },
                ],
              });
              success.push(record.id);
              progress.completed++;
              sendProgress({
                type: "item_success",
                current: progress.completed + progress.failed,
                total: body.length,
                email: item.email,
                employeeName: employee.firstName + " " + employee.lastName,
                message: `Sending to ${employee.firstName + " " + employee.lastName}`,
              });

              return { success: true, email: item.email };
            } catch (error: any) {
              progress.failed++;
              sendProgress({
                type: "item_failed",
                current: progress.completed + progress.failed,
                total: body.length,
                email: item.email,
                error: error.message,
              });

              return {
                success: false,
                email: item.email,
                error: error.message,
              };
            }
          });

          // Wait for all emails to complete
          await Promise.allSettled(emailPromises);

          await globalDrizzle
            .update(payrollRecordsTable)
            .set({
              sentMail: true,
            })
            .where(inArray(payrollRecordsTable.id, success));

          sendProgress({
            type: "complete",
            total: body.length,
            completed: progress.completed,
            failed: progress.failed,
          });

          controller.close();
        } catch (error: any) {
          sendProgress({ type: "error", message: error.message });
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (err) {
    console.error(err);
    return new Response("Internal server error", { status: 500 });
  }
}
