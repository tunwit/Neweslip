import { int, mysqlTable, text } from "drizzle-orm/mysql-core";
import { shopsTable } from "./shopsTable";
import { relations } from "drizzle-orm";

export const incomeDetailsTable = mysqlTable("income_details", {
  id: int().autoincrement().notNull().primaryKey(),
  fieldNameTh: text("field_name_th").notNull(),
  fieldNameEng: text("field_name_eng"),
  shopId: int()
    .references(() => shopsTable.id)
    .notNull(),
});

export const incomeDetailRelations = relations(
  incomeDetailsTable,
  ({ one }) => ({
    shop: one(shopsTable, {
      fields: [incomeDetailsTable.id],
      references: [shopsTable.id],
    }),
  })
);
