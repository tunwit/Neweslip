import { z } from "zod";

export const contractSchema = z.object({
  salary: z
    .number({ required_error: "Salary is Required" })
    .gte(0, "Salary must >= 0"),
  position: z.string().min(1, "Position is required"),
  dateEmploy: z.date({ required_error: "Employ date is required" }),
  bankName: z.string().min(1, "Bank is required"),
  bankAccountNumber: z
    .string()
    .length(10, "Account number must be exactly 10 digits")
    .regex(/^\d+$/, "Account number must contain only numbers"),
  bankAccountOwner: z.string().min(1, "Owner name is required"),
  promtpay: z.string().optional(),
  branchId: z.number({ required_error: "Branch is required" }),
  status: z.string().min(1, "Status name is required"),
});
