"use server";

import { employeesTable, shopsTable } from "@/db/schema";
import globalDrizzle from "@/db/drizzle";
import { isOwner } from "@/lib/isOwner";
import { PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { s3Client } from "@/s3/s3";
import { eq } from "drizzle-orm";

export async function deleteEmployeeAvatar(
  key: string,
  employeeId: number,
  shopId: number,
  userId: string | null,
) {
  const ownerCheck = await isOwner(shopId, userId);
  if (!ownerCheck) {
    throw new Error("Forbidden");
  }
  try {
    await globalDrizzle.transaction(async (tx) => {
      await tx
        .update(employeesTable)
        .set({
          avatar: null,
        })
        .where(eq(employeesTable.id, employeeId));

      const deleteCommand = new DeleteObjectCommand({
        Bucket: process.env.S3_PUBLIC_BUCKET,
        Key: key,
      });
      await s3Client.send(deleteCommand);
    });
  } catch (error) {
    console.error("Error delete object:", error);
    throw error;
  }
}
