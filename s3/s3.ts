import { S3Client } from "@aws-sdk/client-s3";


export const s3Client = new S3Client({
  region: "auto",
  credentials:{
    accessKeyId: process.env.S3_ACCESS_KEY_ID!,
    secretAccessKey:process.env.S3_SECRET_KEY!,
  },
  endpoint:process.env.S3_ENDPOINT
});
