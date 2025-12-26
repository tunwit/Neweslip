import nodemailer from "nodemailer";
import globalDrizzle from "@/db/drizzle";
import { eq } from "drizzle-orm";
import { shopsTable } from "@/db/schema";
export const buildTransporter = async (shopId: number) => {
  const [shop] = await globalDrizzle
    .select({
      SMTPHost: shopsTable.SMTPHost,
      SMTPPort: shopsTable.SMTPPort,
      SMTPSecure: shopsTable.SMTPSecure,
      emailAddress: shopsTable.emailAddress,
      emailPassword: shopsTable.emailPassword,
    })
    .from(shopsTable)
    .where(eq(shopsTable.id, shopId));

  if (
    shop.SMTPHost === null ||
    shop.SMTPPort === null ||
    shop.SMTPSecure === null ||
    shop.emailAddress === null ||
    shop.emailPassword === null
  )
    return null;
  return nodemailer.createTransport({
    host: shop.SMTPHost,
    port: shop.SMTPPort,
    secure: shop.SMTPSecure,
    auth: {
      user: shop.emailAddress,
      pass: shop.emailPassword,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });
};
