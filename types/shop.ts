import { employeesTable, shopsTable } from "@/db/schema";
import { InferColumnsDataTypes, InferInsertModel, InferModel, InferSelectModel } from "drizzle-orm";

//Full schema from DB
export type Shop = InferSelectModel<typeof shopsTable>

export type NewShop = InferInsertModel<typeof shopsTable>
