import { payrollRecordsTable } from "@/db/schema"
import { InferInsertModel } from "drizzle-orm"

export interface PayrollRecord {
    id: number
    updatedAt: Date
    createdAt: Date
    employee: {
        id: number
        firstName: string
        lastName: string
        nickName: string
        branch: string
        branchEng: string
        salary: number
    }
}

export type NewPayrollRecord = InferInsertModel<typeof payrollRecordsTable>