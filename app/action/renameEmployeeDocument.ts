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

export async function renameEmployeeDocument(
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
    await globalDrizzle.transaction(async (tx) => {
      await tx
        .update(employeeFilesTable)
        .set({
          key: newKey,
          fileName: newFileName,
        })
        .where(eq(employeeFilesTable.id, docId));

      try {
        const copyCommand = new CopyObjectCommand({
          Bucket: "eslip",
          CopySource: `eslip/${oldKey}`,
          Key: newKey,
        });
        await s3Client.send(copyCommand);

        const deleteCommand = new DeleteObjectCommand({
          Bucket: "eslip",
          Key: oldKey,
        });
        await s3Client.send(deleteCommand);
      } catch (error) {
        throw new Error("S3 operation failed, rolling back DB");
      }
    });
  } catch (error) {
    console.error("Error renaming object:", error);
    throw error;
  }
}
