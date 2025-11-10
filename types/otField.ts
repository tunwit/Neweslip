import { otFieldsTable } from "@/db/schema";
import { InferInsertModel, InferSelectModel } from "drizzle-orm";

export type OtField = InferSelectModel<typeof otFieldsTable>

export type NewOtField = InferInsertModel<typeof otFieldsTable>
