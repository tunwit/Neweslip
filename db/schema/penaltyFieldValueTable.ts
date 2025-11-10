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
import { relations } from "drizzle-orm";
import { payrollRecordsTable } from "./payrollRecordsTable";
import { otFieldsTable } from "./otFieldsTable";
import { penaltyFieldsTable } from "./penaltyFieldsTable";

export const penaltyFieldValueTable = mysqlTable("penalty_field_value", {
  id: int().autoincrement().notNull().primaryKey(),
  payrollRecordId: int().references(() => payrollRecordsTable.id, { onDelete : "cascade"}),
  penaltyFieldId: int().references(() => penaltyFieldsTable.id, { onDelete : "cascade"}),
  value: decimal({ precision: 10, scale: 2 }).default("0.00").notNull(),
  amount: decimal({ precision: 10, scale: 2 }).default("0.00").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const penaltyFieldValueRelations = relations(
  penaltyFieldValueTable,
  ({ one, many }) => ({
    payrollRecord: one(payrollRecordsTable, {
      fields: [penaltyFieldValueTable.payrollRecordId],
      references: [payrollRecordsTable.id],
    }),
    payrollField: one(penaltyFieldsTable, {
      fields: [penaltyFieldValueTable.penaltyFieldId],
      references: [penaltyFieldsTable.id],
    }),
  }),
);
