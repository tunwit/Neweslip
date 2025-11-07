import {
  float,
  int,
  mysqlEnum,
  mysqlTable,
  text,
} from "drizzle-orm/mysql-core";
import { shopsTable } from "./shopsTable";
import { relations } from "drizzle-orm";

const methodEnum = mysqlEnum(["daily", "hourly"]);
const typeEnum = mysqlEnum(["base on salary", "constant"]);

export const otDetailsTable = mysqlTable("ot_details", {
  id: int().autoincrement().notNull().primaryKey(),
  fieldNameTh: text("field_name_th").notNull(),
  fieldNameEng: text("field_name_eng"),
  otRate: float("ot_rate").notNull(),
  method: methodEnum,
  type: typeEnum,
  rop: int(),
  shopId: int()
    .references(() => shopsTable.id)
    .notNull(),
});

export const otDetailRelations = relations(otDetailsTable, ({ one }) => ({
  shop: one(shopsTable, {
    fields: [otDetailsTable.id],
    references: [shopsTable.id],
  }),
}));
