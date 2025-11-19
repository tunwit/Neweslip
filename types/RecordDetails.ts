import { otFieldValueTable, payrollFieldValueTable, penaltyFieldValueTable } from "@/db/schema";
import { InferSelectModel } from "drizzle-orm";

export interface RecordDetails{
    payrollRecordId : number,
    employeeId: number,
    periodId: number,
    salaryValues : InferSelectModel<typeof payrollFieldValueTable>[],
    otValues: InferSelectModel<typeof otFieldValueTable>[],
    penaltyValues: InferSelectModel<typeof penaltyFieldValueTable>[],
}