import { int, json, mysqlEnum, mysqlTable, timestamp, varchar } from "drizzle-orm/mysql-core";
import { INVITATION_STATUS } from "@/types/enum/enum";
export const invitationsTable = mysqlTable("invitations", {
  id: int("id").autoincrement().notNull().primaryKey(),
  token: varchar("token", { length: 100 }).notNull().unique(),
  redirectUrl: varchar("redirect_url", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull(),
  metaData: json("metadata").$type<{
    shopId: number;
  }>(),
  status: mysqlEnum(INVITATION_STATUS).default(INVITATION_STATUS.PENDING),
  acceptedAt: timestamp("accepted_at"),
  createdBy: varchar("created_by", { length: 255 }).notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  updatedAt: timestamp("updated_at").onUpdateNow(),
  createdAt: timestamp("created_at").defaultNow(),
});
