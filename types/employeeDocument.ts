import { employeeFilesTable } from "@/db/schema";
import { InferSelectModel } from "drizzle-orm";

export type EmployeeDocument = InferSelectModel<typeof employeeFilesTable>

export type EmployeeDocumentWithUploader = EmployeeDocument & {
  uploadedByInfo?: {
    fullName: string;
    email?: string;
    imageUrl:string
  } | null;
};