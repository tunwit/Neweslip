import { Worker } from "bullmq";
import { connection } from "../../infra/bullmq/connection";
import { PayslipService } from "./payslip.service";
const service = new PayslipService();

const payslipWorker = new Worker(
  "payslip.generate",
  async (job) => {
    const jobId = job.id || new Date().toISOString();
    const { shopId, recordId } = job.data;
    const htmlPath = await service.generateHTML(shopId, recordId, jobId);
    const pdfPath = await service.generatePDF(htmlPath, jobId);
    console.log({ htmlPath, pdfPath });

    return { htmlPath, pdfPath };
  },
  {
    connection,
    concurrency: 5, 
    lockDuration: 60000, 
    removeOnComplete: { count: 100 },
    removeOnFail: { age: 24 * 3600 },
  },
);

payslipWorker.on("completed", (job, result) => {
  console.log("✅ Payslip generated", {
    jobId: job.id,
    htmlPath: result.htmlPath,
    pdfPath: result.pdfPath,
  });
});

payslipWorker.on("failed", (job, err) => {
  console.error("❌ Payslip generation failed", {
    jobId: job?.id,
    error: err.message,
    stack: err.stack,
  });
});
