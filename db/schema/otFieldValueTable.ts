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
import { shopsTable } from "./shopsTable";
import { relations } from "drizzle-orm";
import { OT_METHOD, OT_TYPE, PAY_PERIOD_STATUS } from "@/types/enum/enum";
import { payrollRecordsTable } from "./payrollRecordsTable";
import { salaryFieldsTable } from "./salaryFieldsTable";
import { otFieldsTable } from "./otFieldsTable";

export const otFieldValueTable = mysqlTable("ot_field_value", {
  id: int().autoincrement().notNull().primaryKey(),
  payrollRecordId: int().references(() => payrollRecordsTable.id, { onDelete : "cascade"}),
  name: varchar({ length:50 }).notNull(),
  nameEng: varchar({ length:50 }).notNull(),
  type: mysqlEnum(OT_TYPE).default(OT_TYPE.BASEDONSALARY).notNull(),
  method: mysqlEnum(OT_METHOD).default(OT_METHOD.HOURLY).notNull(),
  rate: decimal({ precision: 10, scale: 2 }).notNull(),
  rateOfPay: decimal({ precision: 10, scale: 2 }), // rate for constant
  value: decimal({ precision: 10, scale: 2 }).default("0.00").notNull(),
  amount: decimal({ precision: 10, scale: 2 }).default("0.00").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
},(table) => {
    return {
      payrollRecordIndex: index("payroll_record_idx").on(table.payrollRecordId),
    };
  },);

export const otFieldValueRelations = relations(
  otFieldValueTable,
  ({ one, many }) => ({
    payrollRecord: one(payrollRecordsTable, {
      fields: [otFieldValueTable.payrollRecordId],
      references: [payrollRecordsTable.id],
    }),
  }),
);
