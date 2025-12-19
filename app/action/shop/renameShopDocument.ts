// app/action/uploadEmployeeDocument.ts (SERVER ACTION)

"use server";
import { employeeFilesTable } from "@/db/schema";
import globalDrizzle from "@/db/drizzle";
import { isOwner } from "@/lib/isOwner";
import { s3Client } from "@/s3/s3";
import {
  CopyObjectCommand,
  DeleteObjectCommand,
  PutObjectCommand,
  RenameObjectCommand,
} from "@aws-sdk/client-s3";
import { eq } from "drizzle-orm";
import { shopFilesTable } from "@/db/schema/shopFilesTable";

export async function renameShopDocument(
  docId: number,
  newFileName: string,
  oldKey: string,
  newKey: string,
  shopId: number,
  userId: string,
) {
  const ownerCheck = await isOwner(shopId, userId);
  if (!ownerCheck) throw new Error("Forbidden");
  try {
    await s3Client.send(
      new CopyObjectCommand({
        Bucket: process.env.S3_BUCKET,
        CopySource: encodeURIComponent(`${process.env.S3_BUCKET}/${oldKey}`),
        Key: newKey,
      }),
    );

    await globalDrizzle.transaction(async (tx) => {
      await tx
        .update(shopFilesTable)
        .set({
          key: newKey,
          fileName: newFileName,
        })
        .where(eq(shopFilesTable.id, docId));
    });

    await s3Client.send(
      new DeleteObjectCommand({
        Bucket: process.env.S3_BUCKET,
        Key: oldKey,
      }),
    );
  } catch (error) {
    console.error("Error renaming object:", error);
    throw error;
  }
}
