import {
  date,
  datetime,
  decimal,
  index,
  int,
  mysqlEnum,
  mysqlTable,
  mysqlView,
  serial,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/mysql-core";
import { shopsTable } from "./shopsTable";
import { branchesTable } from "./branchesTable";
import { isNull, relations } from "drizzle-orm";
import { EMPLOYEE_STATUS, GENDER } from "@/types/enum/enum";

export const employeesTable = mysqlTable("employees", {
  id: int().autoincrement().notNull().primaryKey(),
  firstName: text().notNull(),
  lastName: text().notNull(),
  nickName: text().notNull(),
  email: text().notNull(),
  position: varchar({ length: 20 }),
  dateOfBirth: date(),
  gender: mysqlEnum(GENDER).default(GENDER.FEMALE).notNull(),
  phoneNumber: varchar({ length: 11 }).notNull(),
  dateEmploy: date(),
  address1: varchar({ length: 255 }),
  address2: varchar({ length: 255 }),
  address3: varchar({ length: 255 }),
  avatar: varchar({ length: 255 }),
  salary:  decimal("salary", { precision: 10, scale: 2 }).notNull(),
  bankName: text().notNull(),
  bankAccountOwner: text().notNull(),
  bankAccountNumber: text().notNull(),
  promtpay: text(),
  shopId: int()
    .references(() => shopsTable.id)
    .notNull(),
  branchId: int()
    .references(() => branchesTable.id,{onDelete:"cascade"})
    .notNull(),
  status: mysqlEnum(EMPLOYEE_STATUS).default(EMPLOYEE_STATUS.ACTIVE).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
},
  (table) => ({
    branchIndex: index("employees_branch_idx").on(table.branchId),
    shopIndex: index("employees_shop_idx").on(table.shopId),
  }));

export const employeeRelations = relations(employeesTable, ({ one }) => ({
  branch: one(branchesTable, {
    fields: [employeesTable.branchId],
    references: [branchesTable.id],
  }),
}));