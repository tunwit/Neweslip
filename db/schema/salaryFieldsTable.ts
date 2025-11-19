import { int, mysqlEnum, mysqlTable, primaryKey, uniqueIndex, varchar } from "drizzle-orm/mysql-core";
import { shopsTable } from "./shopsTable";
import { relations } from "drizzle-orm";
import { SALARY_FIELD_DEFINATION_TYPE, SALARY_FIELD_STATUS } from "@/types/enum/enum";

export const salaryFieldsTable = mysqlTable(
  "salary_fields",
  {
    id: int().autoincrement().notNull().primaryKey(),
    shopId: int()
        .references(()=>shopsTable.id, { onDelete : "cascade"})
        .notNull(),
    name: varchar({ length:50 }).notNull(),
    nameEng: varchar({ length:50 }).notNull(),
    type: mysqlEnum(SALARY_FIELD_DEFINATION_TYPE).default(SALARY_FIELD_DEFINATION_TYPE.INCOME).notNull(),
    formular: varchar({ length:255 }),
    isActive: mysqlEnum(SALARY_FIELD_STATUS).default(SALARY_FIELD_STATUS.ACTIVE).notNull()
  },
    (t) => ({
    salaryFieldNameIdUnique: uniqueIndex("salary_field_name_id_unique").on(
      t.name,
      t.id
    ),
  })
);

export const salaryFieldsRelations = relations(salaryFieldsTable, ({ one, many }) => ({
  shopId: one(shopsTable,{
    fields: [salaryFieldsTable.shopId],
    references: [shopsTable.id]
  })
}));