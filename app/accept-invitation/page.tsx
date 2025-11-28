"use client"
import { RedirectToSignIn, SignedOut, SignOutButton, SignUp, useAuth, useSession, useSignIn, useSignUp, useUser } from "@clerk/nextjs";
import { redirect, usePathname, useSearchParams } from "next/navigation";
import { createShopOwner } from "../action/createShopOwner";
import { Button, FormControl, FormLabel, Input } from "@mui/joy";
import { useShopDetails } from "@/hooks/useShopDetails";
import { useEffect, useState } from "react";
import { FormSubmitHandler } from "react-hook-form";
import { isOwner } from "@/lib/isOwner";
import { clerkClient } from "@clerk/nextjs/server";
import { useInvitation } from "@/hooks/useInvitation";
import { getUserByEmail } from "../action/getUserByEmail";
import { acceptInvitation } from "../action/acceptInvitation";
import { showError } from "@/utils/showSnackbar";

export default function InvitaionPage() {
  const params = useSearchParams()
  const token = params.get("token")
  const method = params.get("method")
  const [isSubmitting,setIsSubmitting] = useState(false)
  const [alreadyOwner, setAlreadyOwner] = useState(false);
  const [wrongEmail, setWrongEmail] = useState(false);
  const { signUp } = useSignUp();
  const { signIn } = useSignIn();
const { data: invitationData, isLoading: loadingInvitation } = useInvitation(token);
  const { session, isSignedIn, isLoaded: sessionLoaded } = useSession();
  const { data: shopData, isLoading: loadingShop } = useShopDetails(invitationData?.data?.metaData?.shopId);
  const shopId = invitationData?.data?.metaData?.shopId
  
  const acceptHandler = async (e?: React.MouseEvent<HTMLAnchorElement,MouseEvent>) =>{
    e?.preventDefault();
    setIsSubmitting(true)
    if(!shopId) return
    if(!token) return 
    if(!invitationData?.data?.expiresAt) return
    if(new Date(invitationData?.data?.expiresAt) < new Date()) return
    if(isSignedIn){
      await createShopOwner(shopId,session.user.id)
      
      let success = false
      try{
        await acceptInvitation(token)
        success= true
      }catch(err){
        showError(`Cannot accept invitaion ${err}`)
      }
      if(success)redirect("/")
    }
    else{
      const exist = await getUserByEmail(invitationData.data?.email||"")
      if(exist.length > 0){
        await signIn?.authenticateWithRedirect({
        strategy: "oauth_google",
        redirectUrl: "/sso-callback",
        redirectUrlComplete: `${window.location.origin}/accept-invitation?token=${token}&method=auto`,
      });
      }else{
        await signUp?.authenticateWithRedirect({
        strategy:"oauth_google",
        redirectUrl:"/sso-callback",
        redirectUrlComplete:`${window.location.origin}/accept-invitation?token=${token}&method=auto`
      })
      }
    }  
  };

  useEffect(() => {
  if (isSignedIn && invitationData?.data) {
    const emailMatch = session.user.primaryEmailAddress?.emailAddress === invitationData.data.email;
    if (!emailMatch) {
      setWrongEmail(true);
    } else if (method === "auto") {
      acceptHandler(); // call here safely
    }
  }
    const ownerCheck = async () =>{
      if(! invitationData?.data?.metaData?.shopId || !session?.user.id) return
      const alreadyOwn = await isOwner(invitationData?.data?.metaData?.shopId,session?.user.id)
      setAlreadyOwner(alreadyOwn)
      
    }
    ownerCheck()
}, [isSignedIn, session, invitationData, method]);

  const loading = loadingInvitation || !sessionLoaded || loadingShop;
 
  if(!token) return <p>Invalid token</p>

  if (loading) {
    return (
      <div className="min-h-screen w-screen flex items-center justify-center">
        <p>Loading invitation...</p>
      </div>
    );
  }
  
  let content;
  if(!invitationData?.data){
    content = <div className="flex flex-col gap-3 items-center justify-center text-2xl font-bold text-gray-900 mb-2">
        <p className="text-2xl font-bold text-gray-900">Invitation not found</p>
        <p className="text-gray-500">Please contact supervisor</p>
      </div>
  }

  else if(new Date(invitationData?.data?.expiresAt) < new Date()){
    content = <div className="flex flex-col gap-3 items-center justify-center mb-2">
        <p className="text-2xl font-bold text-gray-900">Invitation Expired</p>
        <p className="text-gray-500">Please contact supervisor</p>
      </div>
  }
  else if(wrongEmail){
    content = <div className="flex flex-col gap-3 items-center justify-center mb-2">
        <p className="text-2xl font-bold text-gray-900">This invitation is ment for</p>
        <p className="text-gray-500">{invitationData?.data?.email}</p>
      </div>
  }
  else if(alreadyOwner){
     content = <div className="flex flex-col gap-3 items-center justify-center mb-2">
        <p className="text-2xl font-bold text-gray-900">You already own this shop</p>
      </div>
  }
  else {
    content = <><div className="text-center mb-5">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            You have been invited to shop
          </h1>
          
          <h2 className="text-4xl font-bold text-gray-900 mb-3">
            {shopData?.data?.name}
          </h2>
        </div>
        
        <div className="flex justify-center mb-6">
          <form className="flex flex-col gap-4"> 
           <FormControl>
              <Button disabled={isSubmitting} loading={isSubmitting} type="submit" onClick={(e) => acceptHandler(e)}>
                {isSubmitting? "Registering" : "Accept Invitation"}
              </Button>
            </FormControl>       
          </form>
        </div></>
  }
  

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-lg w-full bg-white rounded-lg shadow-lg p-8">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-blue-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
              />
            </svg>
          </div>
          {content}
          <div id="clerk-captcha" />
        <div className="pt-6 border-t border-gray-200">
          <p className="text-sm text-gray-600 text-center">
            Need help?{" "}
            <a href="/support" className="text-blue-600 hover:underline">
              Contact Support
            </a>
          </p>
        </div>
      </div>
    </div>
   
  );
}