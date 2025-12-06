import { int, json, mysqlTable, timestamp, varchar } from "drizzle-orm/mysql-core";
import { employeesTable } from "./employeesTable";
import { shopsTable } from "./shopsTable";

export const shopFilesTable = mysqlTable("shop_files", {
  id: int().autoincrement().notNull().primaryKey(),
  shopId: int("shop_id")
    .notNull()
    .references(() => shopsTable.id, { onDelete: "cascade" }),
  key: varchar("key", { length: 500 }).notNull(),
  fileName: varchar("file_name", { length: 255 }).notNull(),
  tag: varchar("tag", { length: 100 }),
  mimeType: varchar("mime_type", { length: 100 }),
  size: int("size"),
  uploadedBy: varchar("uploaded_by",{length: 255}),
  metadata: json("metadata"), 
  uploadedAt: timestamp("uploaded_at").onUpdateNow(),
  createdAt: timestamp("created_at").defaultNow(),
});