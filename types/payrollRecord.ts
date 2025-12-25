import { payrollRecordsTable } from "@/db/schema";
import { InferInsertModel } from "drizzle-orm";
import { TotalSalary } from "./totalSalary";

export interface PayrollRecord {
  id: number;
  periodId: number;
  updatedAt: Date;
  createdAt: Date;
  baseSalry: number;
  employee: {
    id: number;
    firstName: string;
    lastName: string;
    nickName: string;
    branch: {
      name: string;
      nameEng: string;
    };
  };
  note?: string;
  totals: TotalSalary;
}

export type NewPayrollRecord = InferInsertModel<typeof payrollRecordsTable>;
