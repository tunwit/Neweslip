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
import { otFieldsTable } from "./otFieldsTable";

export const otFieldValueTable = mysqlTable("ot_field_value", {
  id: int().autoincrement().notNull().primaryKey(),
  payrollRecordId: int().references(() => payrollRecordsTable.id, { onDelete : "cascade"}),
  otFieldId: int().references(() => otFieldsTable.id, { onDelete : "cascade"}),
  value: decimal({ precision: 10, scale: 2 }).default("0.00").notNull(),
  amount: decimal({ precision: 10, scale: 2 }).default("0.00").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const otFieldValueRelations = relations(
  otFieldValueTable,
  ({ one, many }) => ({
    payrollRecord: one(payrollRecordsTable, {
      fields: [otFieldValueTable.payrollRecordId],
      references: [payrollRecordsTable.id],
    }),
    otField: one(otFieldsTable, {
      fields: [otFieldValueTable.otFieldId],
      references: [otFieldsTable.id],
    }),
  }),
);
