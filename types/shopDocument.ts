import { employeeFilesTable } from "@/db/schema";
import { shopFilesTable } from "@/db/schema/shopFilesTable";
import { InferSelectModel } from "drizzle-orm";

export type ShopDocument = InferSelectModel<typeof shopFilesTable>

export type ShopDocumentWithUploader = ShopDocument & {
  uploadedByInfo?: {
    fullName: string;
    email?: string;
    imageUrl:string
  } | null;
};