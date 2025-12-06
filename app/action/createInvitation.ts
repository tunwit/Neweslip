"use server";
import globalDrizzle from "@/db/drizzle";
import { isOwner } from "@/lib/isOwner";
import { invitationsTable } from "@/db/schema/invitationsTable";
import { generateToken } from "@/lib/generateToken";
import { sendMail } from "@/lib/emailService";
import { invitationEmailTemplate } from "@/lib/invitationEmailTemplate";
import { shopsTable } from "@/db/schema";
import { eq } from "drizzle-orm";
import { EmailAddress } from "@clerk/backend";

export async function createInvitation(email:string,redirectUrl:string,shopId:number,userId:string) {
  const ownerCheck = await isOwner(shopId,userId);
  if (!ownerCheck) {
    throw new Error("Forbidden");
  }
  try {
    const token = generateToken()
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    await globalDrizzle.insert(invitationsTable).values({
      token,
      redirectUrl,
      email,
      metaData:{
        shopId:shopId
      },
      createdBy:userId,
      expiresAt: expiresAt,
    });

    const [shop] = await globalDrizzle
      .select()
      .from(shopsTable)
      .where(
        eq(shopsTable.id,shopId)
      ).limit(1)
    
      if(shop.SMTPHost && shop.emailAddress && shop.SMTPPort && shop.SMTPSecure && shop.emailPassword && shop.emailName){
            await sendMail({
            host: shop.SMTPHost,
            port:shop.SMTPPort,
            secure:shop.SMTPSecure,
            username:shop.emailAddress,
            password:shop.emailPassword,
            senderAddress:shop.emailAddress,
            emailName:shop.emailName,
            email:email,
            subject:"Invitation to join shop",
            html:invitationEmailTemplate({
              shopName:shop.name,
              inviteUrl:`${process.env.NEXT_PUBLIC_APP_URL}/accept-invitation?token=${token}`,
              invitedEmail:email
            })
          })
      }

    return {success:true,token};
  } catch (err) {
    console.log(err);
    
    return {success:false};
  }
}
