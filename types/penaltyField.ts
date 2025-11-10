import { penaltyFieldsTable } from "@/db/schema";
import { InferInsertModel, InferSelectModel } from "drizzle-orm";

export type PenaltyField = InferSelectModel<typeof penaltyFieldsTable>

export type NewPenaltyField = InferInsertModel<typeof penaltyFieldsTable>
