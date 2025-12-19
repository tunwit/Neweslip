"use server"
import { isOwner } from "@/lib/isOwner";
import { s3Client } from "@/s3/s3";
import { DeleteObjectCommand } from "@aws-sdk/client-s3";
import globalDrizzle from "@/db/drizzle";
import { employeeFilesTable } from "@/db/schema";
import { eq } from "drizzle-orm";

export default async function deleteEmployeeDocument(docId:number,key:string,shopId:number,userId:string){
   const ownerCheck = await isOwner(shopId, userId);
  if (!ownerCheck) throw new Error("Forbidden");
  
  try {
    await globalDrizzle.transaction(async (tx) => {
      await tx
        .delete(employeeFilesTable)
        .where(eq(employeeFilesTable.id, docId));

        const deleteCommand = new DeleteObjectCommand({
          Bucket: process.env.S3_BUCKET,
          Key: key,
        });
        await s3Client.send(deleteCommand);
    });
  } catch (error) {
    console.error("Error renaming object:", error);
    throw error;
  }
}