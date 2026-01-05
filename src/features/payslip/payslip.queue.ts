import { Queue } from "bullmq";
import { connection } from "@/src/infra/bullmq/connection";
import { PayslipQueue } from "./payslip.model";

export const paySlip = new Queue<PayslipQueue>("payslip.generate", {
  connection,
});
