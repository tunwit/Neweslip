"use server"
import { isOwner } from "@/lib/isOwner";
import { s3Client } from "@/s3/s3";
import { DeleteObjectCommand } from "@aws-sdk/client-s3";
import globalDrizzle from "@/db/drizzle";
import { eq } from "drizzle-orm";
import { shopFilesTable } from "@/db/schema/shopFilesTable";

export default async function deleteShopDocument(docId:number,key:string,shopId:number,userId:string){
   const ownerCheck = await isOwner(shopId, userId);
  if (!ownerCheck) throw new Error("Forbidden");
  
  try {
    await globalDrizzle.transaction(async (tx) => {
      await tx
        .delete(shopFilesTable)
        .where(eq(shopFilesTable.id, docId));

        const deleteCommand = new DeleteObjectCommand({
          Bucket:  process.env.S3_BUCKET,
          Key: key,
        });
        await s3Client.send(deleteCommand);
    });
  } catch (error) {
    console.error("Error renaming object:", error);
    throw error;
  }
}