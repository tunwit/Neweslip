"use server";

import { employeesTable } from "@/db/schema";
import globalDrizzle from "@/db/drizzle";
import { isOwner } from "@/lib/isOwner";
import { eq } from "drizzle-orm";
import { PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { s3Client } from "@/s3/s3";

function generateS3Key(employeeId: number, originalFileName: string) {
  const timestamp = Date.now();
  const sanitizedFileName = originalFileName.replace(/\s+/g, "_");
  return `avatar/emp/emp-${employeeId}/${timestamp}_${sanitizedFileName}`;
}

export async function changeEmployeeAvatar(
  file: File,
  employeeId: number,
  shopId: number,
  userId: string | null,
  oldKey?: string | null,
) {
  const ownerCheck = await isOwner(shopId, userId);
  if (!ownerCheck) {
    throw new Error("Forbidden");
  }

  const s3Key = generateS3Key(employeeId, file.name);
  const buffer = Buffer.from(await file.arrayBuffer());
  if (oldKey) {
    await s3Client.send(
      new DeleteObjectCommand({
        Bucket: process.env.S3_PUBLIC_BUCKET,
        Key: oldKey,
      }),
    );
  }

  await s3Client.send(
    new PutObjectCommand({
      Bucket: process.env.S3_PUBLIC_BUCKET,
      Key: s3Key,
      Body: buffer,
      ContentType: file.type,
    }),
  );

  try {
    await globalDrizzle.transaction(async (tx) => {
      await tx
        .update(employeesTable)
        .set({ avatar: s3Key })
        .where(eq(employeesTable.id, employeeId));
    });
  } catch (err) {
    await s3Client.send(
      new DeleteObjectCommand({
        Bucket: process.env.S3_PUBLIC_BUCKET,
        Key: s3Key,
      }),
    );

    throw err;
  }
}
