"use server";
import globalDrizzle from "@/db/drizzle";
import { isOwner } from "@/lib/isOwner";
import { invitationsTable } from "@/db/schema/invitationsTable";
import { generateToken } from "@/lib/generateToken";

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
    return {success:true,token};
  } catch (err) {
    console.log(err);
    
    return {success:false};
  }
}
