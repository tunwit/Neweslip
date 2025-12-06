import {
  int,
  mysqlTable,
  serial,
  uniqueIndex,
  varchar,
} from "drizzle-orm/mysql-core";
import { shopsTable } from "./shopsTable";
import { relations } from "drizzle-orm";
import { employeesTable } from "./employeesTable";
export const branchesTable = mysqlTable(
  "branches",
  {
    id: int().autoincrement().notNull().primaryKey(),
    name: varchar({ length: 50 }).notNull(),
    nameEng: varchar({ length: 50 }).notNull(),
    address: varchar({ length: 255 }).notNull().default("-"),
    shopId: int()
      .notNull()
      .references(() => shopsTable.id, { onDelete: "cascade" })
      .notNull(),
  },
  (table) => [uniqueIndex("name_shopId").on(table.shopId, table.name)],
);

export const branchRelations = relations(branchesTable, ({ one, many }) => ({
  shop: one(shopsTable, {
    fields: [branchesTable.shopId],
    references: [shopsTable.id],
  }),
  employees: many(employeesTable),
}));
