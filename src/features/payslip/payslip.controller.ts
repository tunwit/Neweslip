import { flowProducer } from "@/src/infra/bullmq/flowProducer";
import { PayslipAndSendQueue } from "./payslip.model";

export class PayslipController {
  async enqueueGenerateAndSend(payloads: PayslipAndSendQueue[]) {
    for (const input of payloads) {
      await flowProducer.add({
        name: "send-email",
        queueName: "email.send",
        data: {
          shopId: input.shopId,
          email: {
            to: input.email,
            subject: "Payslip Test System"
          },
        },
        children: [
          {
            name: "generate",
            queueName: "payslip.generate",
            data: {
              shopId: input.shopId,
              recordId: input.recordId,
            },
          },
        ],
      });
    }
  }
}
