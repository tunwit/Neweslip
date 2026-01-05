import { QueueEvents, Worker } from "bullmq";
import { connection } from "../../infra/bullmq/connection";
import { PayslipService } from "./payslip.service";
import { paySlipQueue } from "./payslip.queue";

const payslipEvent = new QueueEvents("payslip.generate", { connection });
payslipEvent.on("completed", async ({ jobId, returnvalue }) => {
  const job = await paySlipQueue.getJob(jobId);
  if (!job) return;

  const { batchId, batchName } = job.data;
  if (!batchId) return;
  
  await connection.incr(`flow:${batchName}:${batchId}:completed`);

  console.log("✅ Payslip generated");
});

payslipEvent.on("failed", async ({ jobId, failedReason }) => {
  const job = await paySlipQueue.getJob(jobId);
  if (!job) return;

  const { batchId, batchName } = job.data;
  if (!batchId) return;

  await connection.incr(`flow:${batchName}:${batchId}:failed`);
  console.error("❌ Payslip generation failed", {
    jobId,
    reason: failedReason,
  });
});
