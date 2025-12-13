"use server"

import { s3Client } from "@/s3/s3";
import { GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

export async function getPresignedUrl(key: string, expiresIn = 3600,attachment=false) {
    try{
        const command = new GetObjectCommand({
            Bucket:  process.env.S3_BUCKET,
            Key: key,
           ...(attachment && { ResponseContentDisposition: `attachment; filename="${key}"` }),
        });
        const url = await getSignedUrl(s3Client, command, { expiresIn });
        return url;
    }catch(err){
        throw err
    }
  
}