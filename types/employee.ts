import { employeesTable } from "@/db/schema";
import { Shop } from "./shop"

import { InferColumnsDataTypes, InferInsertModel, InferModel, InferSelectModel } from "drizzle-orm";
import { Branch } from "./branch";

//Full schema from DB
export type Employee = InferSelectModel<typeof employeesTable>

export type NewEmployee = InferInsertModel<typeof employeesTable>

export type EmployeeWithShop = Omit<Employee, "shopId"|"branchId"> & {
  shop: Shop
  branch: Omit<Branch,"shopId">
}

