import { payrollPeriodsTable } from "@/db/schema";
import { InferInsertModel, InferSelectModel } from "drizzle-orm";

export type PayrollPeriod = InferSelectModel<typeof payrollPeriodsTable> & {
  totalNet: number;
  count: number;
};
export type NewPayrollPeriod = InferInsertModel<typeof payrollPeriodsTable>;
