import { InferInsertModel, InferSelectModel } from "drizzle-orm";
import { SALARY_FIELD_DEFINATION_TYPE } from "./enum/enum";
import { salaryFieldsTable } from "@/db/schema";

export type SalaryField = InferSelectModel<typeof salaryFieldsTable>

export type NewSalaryField = InferInsertModel<typeof salaryFieldsTable>

export type SalaryFieldGrouped = Record<keyof typeof SALARY_FIELD_DEFINATION_TYPE, SalaryField[]>;
