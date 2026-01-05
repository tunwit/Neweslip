import { flowProducer } from "@/src/infra/bullmq/flowProducer";
import { PayslipAndSendQueue } from "./payslip.model";
import { connection } from "@/src/infra/bullmq/connection";
import { nanoid } from "nanoid";
import { paySlipQueue } from "./payslip.queue";

export class PayslipController {
  async enqueueGenerateAndSend(payloads: PayslipAndSendQueue[]) {
    const batchId = nanoid();
    const batchName = "generate-send";
    for (const input of payloads) {
      await flowProducer.add({
        name: "send-email",
        queueName: "email.send",
        data: {
          batchId: batchId,
          batchName: batchName,
          shopId: input.shopId,
          email: {
            to: input.email,
            subject: "Payslip Test System",
          },
        },
        children: [
          {
            name: "generate",
            queueName: "payslip.generate",
            data: {
              batchId: batchId,
              batchName: batchName,
              shopId: input.shopId,
              recordId: input.recordId,
              withPdf: true,
            },
          },
        ],
      });
    }
    await connection.set(
      `flow:${batchName}:${batchId}:total`,
      payloads.length * 2,
    );
    await connection.set(`flow:${batchName}:${batchId}:completed`, 0);
    await connection.set(`flow:${batchName}:${batchId}:failed`, 0);
    return { batchId, batchName };
  }

  async enqueueGenerateSlipPreview(shopId: number, recordId: number) {
    const job = await paySlipQueue.add("generate-preview", {
      shopId,
      recordId,
      withPdf: false,
    });
    return {jobId:job.id}
  }
}
