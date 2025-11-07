import { int, mysqlEnum, mysqlTable, text } from "drizzle-orm/mysql-core";
import { shopsTable } from "./shopsTable";
import { relations } from "drizzle-orm";

const methodEnum = mysqlEnum(["per minute", "daily", "hourly"]);
const typeEnum = mysqlEnum(["base on salary", "constant"]);

export const absentDetailsTable = mysqlTable("absent_details", {
  id: int().autoincrement().notNull().primaryKey(),
  fieldNameTh: text("field_name_th").notNull(),
  fieldNameEng: text("field_name_eng"),
  method: methodEnum.notNull(),
  type: typeEnum.notNull(),
  rod: int(),
  shopId: int()
    .references(() => shopsTable.id)
    .notNull(),
});

export const absentDetailRelations = relations(
  absentDetailsTable,
  ({ one }) => ({
    shop: one(shopsTable, {
      fields: [absentDetailsTable.id],
      references: [shopsTable.id],
    }),
  })
);
