import {
  otFieldValueTable,
  payrollFieldValueTable,
  penaltyFieldValueTable,
} from "@/db/schema";
import { InferSelectModel } from "drizzle-orm";

export interface RecordDetails {
  payrollRecordId: number;
  employeeId: number;
  salary: string;
  periodId: number;
  salaryValues: InferSelectModel<typeof payrollFieldValueTable>[];
  otValues: InferSelectModel<typeof otFieldValueTable>[];
  penaltyValues: InferSelectModel<typeof penaltyFieldValueTable>[];
  note?: string;
  totals: {
    totalSalaryIncome: number;
    totalSalaryDeduction: number;
    totalOT: number;
    totalPenalty: number;
    totalEarning: number;
    totalDeduction: number;
    net: number;
  };
}
