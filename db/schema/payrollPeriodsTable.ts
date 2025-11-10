import { date, int, mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";
import { shopsTable } from "./shopsTable";
import { relations } from "drizzle-orm";
import { PAY_PERIOD_STATUS } from "@/types/enum/enum";
import { payrollRecordsTable } from "./payrollRecordsTable";

export const payrollPeriodsTable = mysqlTable("payroll_periods", {
  id: int().autoincrement().notNull().primaryKey(),
  shopId: int()
    .references(() => shopsTable.id, { onDelete : "cascade"})
    .notNull(),
  name: varchar({ length: 50 }).notNull(),
  start_date: date().notNull(),
  end_date: date().notNull(),
  status: mysqlEnum(PAY_PERIOD_STATUS).default(PAY_PERIOD_STATUS.DRAFT).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow(),
});

export const payrollPeriodsRelations = relations(payrollPeriodsTable, ({ one, many }) => ({
  shop: one(shopsTable,{
    fields: [payrollPeriodsTable.shopId],
    references: [shopsTable.id]
  }),
  records: many(payrollRecordsTable),
}));

