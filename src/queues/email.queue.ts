import { EmailPayload } from "@/types/mailPayload";
import { Queue } from "bullmq";
import IORedis from "ioredis";

export const connection = new IORedis({
  host: "127.0.0.1",
  port: 6379,
  maxRetriesPerRequest: null,
});

export const emailQueue = new Queue<
  EmailPayload & {
    batchId: string;
  }
>("send-email-payslip", { connection });
