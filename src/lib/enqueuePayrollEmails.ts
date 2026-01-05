// import { EmailPayload } from "@/types/mailPayload";
// import { connection, emailQueue } from "../queues/email.queue";
// import { nanoid } from "nanoid";

// export async function enqueuePayrollEmails(mails: EmailPayload[]) {
//   const batchId = nanoid();
//   for (const mail of mails) {
//     if (!mail.email) continue;
//     await emailQueue.add(
//       "send-email-payslip",
//       { ...mail, batchId },
//       {
//         attempts: 3,
//         backoff: {
//           type: "exponential",
//           delay: 2000,
//         },
//         removeOnComplete: true,
//         removeOnFail: false,
//       },
//     );
//   }
//   await connection.set(`email:batch:${batchId}:total`, mails.length);
//   return batchId;
// }
