import { relations } from "drizzle-orm";
import { int, mysqlTable, serial, varchar } from "drizzle-orm/mysql-core";
import { branchesTable } from "./branchesTable";
import { shopOwnerTable } from "./shopOwnerTable";
import { incomeDetailsTable } from "./incomeDetailsTable";
import { deductionDetailsTable } from "./deductionDetailsTable";
import { absentDetailsTable } from "./absentDetailsTable";
import { otDetailsTable } from "./otDetailsTable";

export const shopsTable = mysqlTable("shops", {
  id: int().autoincrement().notNull().primaryKey(),
  name: varchar({ length: 50 }).notNull().unique(),
  avatar: varchar({ length: 255 }),
});

export const shopRelations = relations(shopsTable, ({ many }) => ({
  branches: many(branchesTable),
  owners: many(shopOwnerTable),
  incomedetails: many(incomeDetailsTable),
  deductiondetails: many(deductionDetailsTable),
  absentdetails: many(absentDetailsTable),
  otdetails: many(otDetailsTable),
}));
