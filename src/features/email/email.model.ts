export type EmailAttachment =
  | {
      filename: string;
      path: string;
      contentType?: string;
    }
  | {
      filename: string;
      content: Buffer;
      contentType?: string;
    };

export interface Email {
  to: string | string[];
  subject: string;
  html?: string;
  attachments?: EmailAttachment[];
}
export interface EmailQueue {
  shopId: number;
  email: Email;
  batchId?: string;
  batchName?: string;
}
