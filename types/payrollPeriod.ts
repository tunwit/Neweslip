import { payrollPeriodsTable } from "@/db/schema";
import { InferInsertModel, InferSelectModel } from "drizzle-orm";

export type PayrollPeriod = InferSelectModel<typeof payrollPeriodsTable>
export type NewPayrollPeriod = InferInsertModel<typeof payrollPeriodsTable>
