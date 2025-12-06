import { relations } from "drizzle-orm";
import { boolean, decimal, int, mysqlTable, serial, varchar } from "drizzle-orm/mysql-core";
import { branchesTable } from "./branchesTable";
import { shopOwnerTable } from "./shopOwnerTable";
import { salaryFieldsTable } from "./salaryFieldsTable";

export const shopsTable = mysqlTable("shops", {
  id: int().autoincrement().notNull().primaryKey(),
  name: varchar({ length: 50 }).notNull().unique(),
  avatar: varchar({ length: 255 }),
  taxId: varchar({ length: 13 }).notNull().default("-"),

  work_hours_per_day: decimal({ precision: 4, scale: 2 }).default("8.0"), 
  workdays_per_month: decimal({ precision: 4, scale: 2 }).default("22.0"),

  SMTPHost: varchar({ length: 50 }).default("smtp.gmail.com"),
  SMTPPort: int().default(465),
  SMTPSecure: boolean().default(true),
  emailName: varchar({ length: 255 }),
  emailAddress: varchar({ length: 255 }),
  emailPassword: varchar({ length: 255 }),
});

export const shopRelations = relations(shopsTable, ({ many }) => ({
  branches: many(branchesTable),
  owners: many(shopOwnerTable),
  salaryFields: many(salaryFieldsTable),
}));
