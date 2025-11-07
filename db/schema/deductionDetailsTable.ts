import { int, mysqlTable, text } from "drizzle-orm/mysql-core";
import { shopsTable } from "./shopsTable";
import { relations } from "drizzle-orm";

export const deductionDetailsTable = mysqlTable("deduction_details", {
  id: int().autoincrement().notNull().primaryKey(),
  fieldNameTh: text("field_name_th").notNull(),
  fieldNameEng: text("field_name_eng"),
  shopId: int()
    .references(() => shopsTable.id)
    .notNull(),
});

export const deductionDetailRelations = relations(
  deductionDetailsTable,
  ({ one }) => ({
    shop: one(shopsTable, {
      fields: [deductionDetailsTable.id],
      references: [shopsTable.id],
    }),
  })
);
