"use server";

import { isOwner } from "@/lib/isOwner";
import { clerkClient, Invitation } from "@clerk/nextjs/server";


export async function createInvitation(emailAddress:string,shopId:number,userId:string|null) {
  const ownerCheck = await isOwner(shopId,userId);
  if (!ownerCheck) {
    throw new Error("Forbidden");
  }

  try{
    const client = await clerkClient()
    
    const invitaion = await client.invitations.createInvitation({
        emailAddress:emailAddress.trim(),
        notify:true,
        redirectUrl:`${process.env.NEXT_PUBLIC_URL}/accept-invitation?shopId=${shopId}`,
        ignoreExisting:true,
        publicMetadata:{
            shopId:shopId
        }
    })
    
    return {
        error: false,
        data: JSON.parse(JSON.stringify(invitaion)) as Invitation
    };

  }catch (err){
    return {
        error: true,
        message: JSON.parse(JSON.stringify(err.errors[0])),
    }
  }
  
}
