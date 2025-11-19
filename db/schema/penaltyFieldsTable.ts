import { decimal, int, mysqlEnum, mysqlTable, primaryKey, timestamp, uniqueIndex, varchar } from "drizzle-orm/mysql-core";
import { shopsTable } from "./shopsTable";
import { relations } from "drizzle-orm";
import { OT_METHOD, OT_TYPE, PENALTY_METHOD, PENALTY_TYPE, SALARY_FIELD_DEFINATION_TYPE } from "@/types/enum/enum";

export const penaltyFieldsTable = mysqlTable(
  "penalty_fields",
  {
    id: int().autoincrement().notNull().primaryKey(),
    shopId: int()
        .references(()=>shopsTable.id, { onDelete : "cascade"})
        .notNull(),
    name: varchar({ length:50 }).notNull(),
    nameEng: varchar({ length:50 }).notNull(),
    type: mysqlEnum(PENALTY_TYPE).default(PENALTY_TYPE.BASEDONSALARY).notNull(),
    method: mysqlEnum(PENALTY_METHOD).default(PENALTY_METHOD.HOURLY).notNull(),
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

export const penaltyFieldsRelations = relations(penaltyFieldsTable, ({ one, many }) => ({
  shopId: one(shopsTable,{
    fields: [penaltyFieldsTable.shopId],
    references: [shopsTable.id]
  })
}));