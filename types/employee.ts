import { employeesTable } from "@/db/schema";
import { Shop } from "./type.shop";

import {
  InferColumnsDataTypes,
  InferInsertModel,
  InferModel,
  InferSelectModel,
} from "drizzle-orm";
import { Branch } from "./type.branch";

//Full schema from DB
export type Employee = InferSelectModel<typeof employeesTable>;

export type NewEmployee = Omit<
  InferInsertModel<typeof employeesTable>,
  "avatar"
> & {
  avatar?: File;
};

export type EmployeeWithShop = Omit<Employee, "shopId" | "branchId"> & {
  shop: Shop;
  branch: Omit<Branch, "shopId">;
};
