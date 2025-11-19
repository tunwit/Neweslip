import { decimal, int, mysqlEnum, mysqlTable, primaryKey, timestamp, uniqueIndex, varchar } from "drizzle-orm/mysql-core";
import { shopsTable } from "./shopsTable";
import { relations } from "drizzle-orm";
import { OT_METHOD, OT_TYPE, SALARY_FIELD_DEFINATION_TYPE } from "@/types/enum/enum";

export const otFieldsTable = mysqlTable(
  "ot_fields",
  {
    id: int().autoincrement().notNull().primaryKey(),
    shopId: int()
        .references(()=>shopsTable.id, { onDelete : "cascade"})
        .notNull(),
    name: varchar({ length:50 }).notNull(),
    nameEng: varchar({ length:50 }).notNull(),
    type: mysqlEnum(OT_TYPE).default(OT_TYPE.BASEDONSALARY).notNull(),
    method: mysqlEnum(OT_METHOD).default(OT_METHOD.HOURLY).notNull(),
    rate: decimal({ precision: 10, scale: 2 }).notNull(),
    rateOfPay: decimal({ precision: 10, scale: 2 }).default("0"), // rate for constant
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
    (t) => ({
    salaryFieldNameIdUnique: uniqueIndex("salary_field_name_id_unique").on(
      t.name,
      t.id
    ),
  })
);

export const otFieldsRelations = relations(otFieldsTable, ({ one, many }) => ({
  shopId: one(shopsTable,{
    fields: [otFieldsTable.shopId],
    references: [shopsTable.id]
  })
}));