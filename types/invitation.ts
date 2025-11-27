import { invitationsTable } from "@/db/schema/invitationsTable";
import {  InferInsertModel, InferSelectModel } from "drizzle-orm";

export type Invitation = InferSelectModel<typeof invitationsTable>
export type NewInvitation = InferInsertModel<typeof invitationsTable>

