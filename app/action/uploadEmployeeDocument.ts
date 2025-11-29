// app/action/uploadEmployeeDocument.ts (SERVER ACTION)

"use server";
import { employeeFilesTable } from "@/db/schema";
import globalDrizzle from "@/db/drizzle";
import { isOwner } from "@/lib/isOwner";
import { s3Client } from "@/s3/s3";
import { DeleteObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";

function generateS3Key(employeeId: number, originalFileName: string) {
  const timestamp = Date.now();
  const sanitizedFileName = originalFileName.replace(/\s+/g, "_");
  return `emp-${employeeId}/${timestamp}_${sanitizedFileName}`;
}

interface FileUploadResult {
  fileName: string;
  success: boolean;
  error?: string;
}

export async function uploadEmployeeDocuments(
  files: File[],
  tag: string = "others",
  employeeId: number,
  shopId: number,
  userId: string | null,
) {
  const ownerCheck = await isOwner(shopId, userId);
  if (!ownerCheck) throw new Error("Forbidden");

  const results: FileUploadResult[] = [];

  for (const file of files) {
    const s3Key = generateS3Key(employeeId, file.name);
    const resultObj: FileUploadResult = { fileName: file.name, success: false };

    try {
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      // 1. Upload to S3
      const putCommand = new PutObjectCommand({
        Bucket: "eslip",
        Key: s3Key,
        Body: buffer, // Standard Buffer upload (no streaming needed)
        ContentType: file.type,
      });

      await s3Client.send(putCommand);

      // 2. Insert into Database
      await globalDrizzle.transaction(async (tx) => {
        await tx.insert(employeeFilesTable).values({
          employeeId,
          key: s3Key,
          fileName: file.name,
          tag,
          mimeType: file.type,
          size: file.size,
          uploadedBy: userId,
          metadata: {},
        });
      });

      resultObj.success = true;
      results.push(resultObj);
    } catch (error) {
      // Clean up S3 object if DB insertion failed
      try {
        await s3Client.send(new DeleteObjectCommand({ Bucket: "eslip", Key: s3Key }));
      } catch (deleteErr) {
        console.error("Failed to delete S3 object after failed upload/DB insertion", deleteErr);
      }
      
      // Capture the error message for the client
      resultObj.error = error instanceof Error ? error.message : "An unknown error occurred";
      results.push(resultObj);
    }
  }

  return results;
}