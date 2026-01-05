export interface PayslipQueue {
  shopId: number;
  recordId: number;
}

export interface PayslipAndSendQueue {
  shopId: number;
  recordId: number;
  email: string;
}
