"use server";

import { shopsTable } from "@/db/schema";
import globalDrizzle from "@/db/drizzle";
import { isOwner } from "@/lib/isOwner";
import { DeleteObjectCommand } from "@aws-sdk/client-s3";
import { s3Client } from "@/s3/s3";
import { eq } from "drizzle-orm";

export async function deleteShopAvatar(
  key: string,
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
        .update(shopsTable)
        .set({
          avatar: null,
        })
        .where(eq(shopsTable.id, shopId));

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
