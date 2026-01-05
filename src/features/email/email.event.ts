import { QueueEvents, Worker } from "bullmq";
import { connection } from "../../infra/bullmq/connection";
import { emailQueue } from "./email.queue";

const emailEvent = new QueueEvents("email.send", { connection });
emailEvent.on("completed", async ({ jobId, returnvalue }) => {
  const job = await emailQueue.getJob(jobId);
  if (!job) return;

  const { batchId, batchName } = job.data;
  if (!batchId) return;

  await connection.incr(`flow:${batchName}:${batchId}:completed`);
  console.log("✅ Email send");
});

emailEvent.on("failed", async ({ jobId, failedReason }) => {
  const job = await emailQueue.getJob(jobId);
  if (!job) return;

  const { batchId, batchName } = job.data;
  if (!batchId) return;

  await connection.incr(`flow:${batchName}:${batchId}:failed`);
  console.error("❌ Email failed to send", {
    jobId,
    reason: failedReason,
  });
});
