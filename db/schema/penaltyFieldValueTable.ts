import {
  date,
  decimal,
  index,
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
import { PENALTY_METHOD, PENALTY_TYPE } from "@/types/enum/enum";

export const penaltyFieldValueTable = mysqlTable("penalty_field_value", {
  id: int().autoincrement().notNull().primaryKey(),
  payrollRecordId: int().references(() => payrollRecordsTable.id, { onDelete : "cascade"}),
  name: varchar({ length:50 }).notNull(),
  nameEng: varchar({ length:50 }).notNull(),
  type: mysqlEnum(PENALTY_TYPE).default(PENALTY_TYPE.BASEDONSALARY).notNull(),
  method: mysqlEnum(PENALTY_METHOD).default(PENALTY_METHOD.HOURLY).notNull(),
  rateOfPay: decimal({ precision: 10, scale: 2 }), // rate for constant
  value: decimal({ precision: 10, scale: 2 }).default("0.00").notNull(),
  amount: decimal({ precision: 10, scale: 2 }).default("0.00").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
},(table) => {
    return {
      payrollRecordIndex: index("payroll_record_idx").on(table.payrollRecordId),
    };
  });

export const penaltyFieldValueRelations = relations(
  penaltyFieldValueTable,
  ({ one, many }) => ({
    payrollRecord: one(payrollRecordsTable, {
      fields: [penaltyFieldValueTable.payrollRecordId],
      references: [payrollRecordsTable.id],
    }),
  }),
);
