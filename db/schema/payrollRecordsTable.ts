import { date, decimal, int, mysqlEnum, mysqlTable, primaryKey, text, timestamp, uniqueIndex, varchar } from "drizzle-orm/mysql-core";
import { shopsTable } from "./shopsTable";
import { relations } from "drizzle-orm";
import { PAY_PERIOD_STATUS } from "@/types/enum/enum";
import { payrollPeriodsTable } from "./payrollPeriodsTable";
import { employeesTable } from "./employeesTable";

export const payrollRecordsTable = mysqlTable("payroll_records", {
  id: int().autoincrement().notNull().primaryKey(),
  payrollPeriodId: int()
    .references(() => payrollPeriodsTable.id, { onDelete : "cascade"})
    .notNull(),
  employeeId: int()
    .references(() => employeesTable.id, { onDelete : "cascade"})
    .notNull(),
  salary: decimal("salary", { precision: 10, scale: 2 }).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow(),
},(t) => ({
    payrollPeriodEmployeeUnique: uniqueIndex("payroll_period_employee_unique").on(
        t.payrollPeriodId,
        t.employeeId
    )
}));

export const payrollRecordRelations = relations(payrollRecordsTable, ({ one, many }) => ({
  employee: one(employeesTable,{
    fields: [payrollRecordsTable.employeeId],
    references: [employeesTable.id]
  }),
  payrollRecord: one(payrollPeriodsTable,{
    fields: [payrollRecordsTable.payrollPeriodId],
    references: [payrollPeriodsTable.id]
  }),
}));
