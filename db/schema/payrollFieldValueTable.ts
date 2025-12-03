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
import {
  PAY_PERIOD_STATUS,
  SALARY_FIELD_DEFINATION_TYPE,
} from "@/types/enum/enum";
import { payrollRecordsTable } from "./payrollRecordsTable";
import { salaryFieldsTable } from "./salaryFieldsTable";

export const payrollFieldValueTable = mysqlTable(
  "payroll_field_value",
  {
    id: int().autoincrement().notNull().primaryKey(),
    payrollRecordId: int().references(() => payrollRecordsTable.id, {
      onDelete: "cascade",
    }),
    name: varchar({ length: 50 }).notNull(),
    nameEng: varchar({ length: 50 }).notNull(),
    type: mysqlEnum(SALARY_FIELD_DEFINATION_TYPE)
      .default(SALARY_FIELD_DEFINATION_TYPE.INCOME)
      .notNull(),
    formular: varchar({ length: 255 }),
    amount: decimal({ precision: 10, scale: 2 }).default("0.00").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => {
    return {
      payrollRecordIndex: index("payroll_record_idx").on(table.payrollRecordId),
    };
  },
);

export const payrollFieldValuesRelations = relations(
  payrollFieldValueTable,
  ({ one, many }) => ({
    payrollRecord: one(payrollRecordsTable, {
      fields: [payrollFieldValueTable.payrollRecordId],
      references: [payrollRecordsTable.id],
    }),
  }),
);
