import { Worker } from "bullmq";
import { connection } from "../../infra/bullmq/connection";
import { PayslipService } from "./payslip.service";
const service = new PayslipService();

const payslipWorker = new Worker(
  "payslip.generate",
  async (job) => {
    const jobId = job.id || new Date().toISOString();
    const { shopId, recordId, withPdf } = job.data;
    const html = await service.generateHTML(shopId, recordId, jobId);
    const pdfPath = withPdf ? await service.generatePDF(html, jobId) : null;

    if (!withPdf) {
      await connection.set(`payslip:preview:${jobId}`, html, "EX", 60 * 10);
    }
    return { html, pdfPath };
  },
  {
    connection,
    concurrency: 5,
    lockDuration: 60000,
    removeOnComplete: { count: 100 },
    removeOnFail: { age: 24 * 3600 },
  },
);
