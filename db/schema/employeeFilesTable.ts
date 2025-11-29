import { int, json, mysqlTable, timestamp, varchar } from "drizzle-orm/mysql-core";
import { employeesTable } from "./employeesTable";

export const employeeFilesTable = mysqlTable("employee_files", {
  id: int().autoincrement().notNull().primaryKey(),
  employeeId: int("employee_id")
    .notNull()
    .references(() => employeesTable.id, { onDelete: "cascade" }),
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