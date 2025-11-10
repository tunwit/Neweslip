import {
  date,
  decimal,
  int,
  mysqlEnum,
  mysqlTable,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/mysql-core";
import { shopsTable } from "./shopsTable";
import { relations } from "drizzle-orm";
import { PAY_PERIOD_STATUS } from "@/types/enum/enum";
import { payrollRecordsTable } from "./payrollRecordsTable";
import { salaryFieldsTable } from "./salaryFieldsTable";

export const payrollFieldValueTable = mysqlTable("payroll_field_value", {
  id: int().autoincrement().notNull().primaryKey(),
  payrollRecordId: int().references(() => payrollRecordsTable.id, { onDelete : "cascade"}),
  salaryFieldId: int().references(() => salaryFieldsTable.id, { onDelete : "cascade"}),
  value: decimal({ precision: 10, scale: 2 }).default("0.00").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const payrollFieldValuesRelations = relations(
  payrollFieldValueTable,
  ({ one, many }) => ({
    payrollRecord: one(payrollRecordsTable, {
      fields: [payrollFieldValueTable.payrollRecordId],
      references: [payrollRecordsTable.id],
    }),
    salaryField: one(salaryFieldsTable, {
      fields: [payrollFieldValueTable.salaryFieldId],
      references: [salaryFieldsTable.id],
    }),
  }),
);
