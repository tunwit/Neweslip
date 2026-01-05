import { connection } from "@/src/infra/bullmq/connection";
import { Queue } from "bullmq";
import { EmailQueue } from "./email.model";

export const emailQueue = new Queue<
  EmailQueue 
>("email.send", { connection });