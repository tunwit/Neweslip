import { InferSelectModel } from "drizzle-orm";
import { Employee } from "./employee";
import { OtField } from "./otField";
import { PenaltyField } from "./penaltyField";
import { SalaryField } from "./salaryFields";
import { TotalSalary } from "./totalSalary";
import {
  otFieldValueTable,
  payrollFieldValueTable,
  penaltyFieldValueTable,
} from "@/db/schema";
import { Owner } from "./owner";

// Main response for GET /payroll-period/:periodId
export interface PayrollPeriodSummary {
  id: number;
  name: string;
  status: string;
  shopId: number;
  start_period: string;
  end_period: string;
  work_hours_per_day: number;
  workdays_per_month: number;
  finalized_at?: string | null;
  finalized_by?: string | null;
  finalizedByUser?: Owner | null;
  edited: boolean;
  employeeCount: number;
  totalBaseSalary: number;
  totalNet: number;
  totalEarning: number;
  totalDeduction: number;
  records: PayrollRecordSummary[];
}

// Each employee payroll record
export interface PayrollRecordSummary {
  id: number;
  baseSalary: number;
  sentMail: boolean;
  employee: {
    id: number;
    firstName: string;
    lastName: string;
    nickName: string;
    branch: string;
    branchEng: string;
    email: string;
    bankAccountNumber: string;
    bankAccountOwner: string;
    bankName: string;
    promtpay: string;
  };
  totals: TotalSalary;
  fields: InferSelectModel<typeof payrollFieldValueTable>[];
  ot: InferSelectModel<typeof otFieldValueTable>[];
  penalties: InferSelectModel<typeof penaltyFieldValueTable>[];
}
