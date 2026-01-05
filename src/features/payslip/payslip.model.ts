export interface PayslipQueue {
  shopId: number;
  recordId: number;
  withPdf: boolean;
  batchId?: string;
  batchName?: string;
}

export interface PayslipAndSendQueue {
  shopId: number;
  recordId: number;
  email: string;
  batchId?: string;
  batchName?: string;
}
