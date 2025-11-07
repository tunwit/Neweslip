import {
  date,
  datetime,
  int,
  mysqlEnum,
  mysqlTable,
  serial,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/mysql-core";
import { shopsTable } from "./shopsTable";
import { branchesTable } from "./branchesTable";
import { relations } from "drizzle-orm";
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
  salary: int().notNull(),
  bankName: text().notNull(),
  bankAccountOwner: text().notNull(),
  bankAccountNumber: text().notNull(),
  promtpay: text(),
  shopId: int()
    .references(() => shopsTable.id)
    .notNull(),
  branchId: int()
    .references(() => branchesTable.id)
    .notNull(),
  status: mysqlEnum(EMPLOYEE_STATUS).default(EMPLOYEE_STATUS.ACTIVE).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull()
});

export const employeeRelations = relations(employeesTable, ({ one }) => ({
  branch: one(branchesTable, {
    fields: [employeesTable.branchId],
    references: [branchesTable.id],
  }),
}));
