import { Worker } from "bullmq";
import { connection } from "../../infra/bullmq/connection";
import { EmailService } from "./email.service";
import { EmailQueue } from "./email.model";
import path from "path";
import fs from "fs/promises";

const service = new EmailService();

const emailWorker = new Worker(
  "email.send",
  async (job) => {
    let { shopId, email }: EmailQueue = job.data;

    const childrenValues = await job.getChildrenValues();

    const childResult = Object.values(childrenValues)[0];
    if (childResult) {
      if (childResult.htmlPath) {
        const htmlContent = await fs.readFile(childResult.htmlPath, "utf-8");
        email.html = htmlContent;
      }

      if (childResult.pdfPath) {
        email.attachments = email.attachments || [];
        email.attachments.push({
          filename: childResult.filename || "attachment.pdf",
          path: childResult.pdfPath,
        });
      }
    }

    await service.sendEmail(shopId, email);

    // for (const att of email.attachments ?? []) {
    //   if ("path" in att) {
    //     await fs.rm(path.dirname(att.path), {
    //       recursive: true,
    //       force: true,
    //     });
    //   }
    // }
  },
  {
    connection,
    concurrency: 10,
    limiter: {
      max: 10,
      duration: 1000,
    },
    maxStalledCount: 3,
  },
);

emailWorker.on("completed", (job, result) => {
  console.log("✅ Email sended");
});

emailWorker.on("failed", (job, err) => {
  console.error("❌ Email send failed", {
    jobId: job?.id,
    error: err.message,
    stack: err.stack,
  });
});
