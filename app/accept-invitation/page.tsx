"use client"
import { RedirectToSignIn, SignedOut, SignUp, useAuth, useSession, useSignIn, useSignUp, useUser } from "@clerk/nextjs";
import { redirect, usePathname, useSearchParams } from "next/navigation";
import { createShopOwner } from "../action/createShopOwner";
import { Button, FormControl, FormLabel, Input } from "@mui/joy";
import { useShopDetails } from "@/hooks/useShopDetails";
import { useEffect, useState } from "react";
import { FormSubmitHandler } from "react-hook-form";
import { isOwner } from "@/lib/isOwner";
import { clerkClient } from "@clerk/nextjs/server";

export default function InvitaionPage() {
  const params = useSearchParams()
  const clerkStatus = params.get("__clerk_status")
  const clerkTicket = params.get("__clerk_ticket")
  const shopId = params.get("shopId")

  if (clerkStatus === "complete" || !clerkTicket || !shopId) {
    redirect("/");
  }

  const {signUp, setActive} = useSignUp()
  const { signIn } = useSignIn();
  const {user} = useUser()
  const {isSignedIn} = useAuth()
  const {session} = useSession()

  const [firstName,setFirstName] = useState("")
  const [lastName,setLastName] = useState("")
  const [isSubmitting,setIsSubmitting] = useState(false)
  const [alreadyOwner, setAlreadyOwner] = useState(false);


  const {data} = useShopDetails(Number(shopId))

  if (clerkStatus === "complete" || !clerkTicket || !shopId) {
      redirect("/");
  }
  useEffect(() => {
    setAlreadyOwner(false)
    const checkOwnership = async () => {
      
      if (clerkStatus === "sign_in" && user) {
        
        const result = await isOwner(Number(shopId), user.id);
        console.log(result);
        
        if (result) {
          setAlreadyOwner(true)
        }
      }
    };

    checkOwnership();
  }, [clerkStatus, user, shopId]);


const acceptHandler = async (e) =>{
  e.preventDefault();

  setIsSubmitting(true)
  
  if(!signUp || !clerkTicket) return
  let successfulSignUp = false;
  
  
  try {
      if(clerkStatus === "sign_up"){
        const attemp = await signUp.create({
          strategy: "ticket",
          ticket:clerkTicket,
          firstName: firstName,
          lastName: lastName
        });
        if(attemp.status==="complete" && attemp.createdUserId){
          await setActive({ session: attemp.createdSessionId })
          await createShopOwner(Number(shopId),attemp.createdUserId)
        }else{
          redirect("/")
        }
      }else{
        if(signIn){
          const attemp = await signIn.create({
          strategy: "ticket",
          ticket: clerkTicket,
          });
          if(attemp.status === "complete" && attemp.createdSessionId ){
            await setActive({ session: attemp.createdSessionId });  
          }
        }
      }
      successfulSignUp = true
      
    } catch (error) {
      console.error("Clerk sign-up authentication failed:", error);
    }finally{
      setIsSubmitting(false)
    }

    
    if(successfulSignUp) redirect("/")
  };

  // Add a useEffect to handle the sign-in completion
  useEffect(() => {
    const handleSignInComplete = async () => {
      if (clerkStatus === "sign_in" && user && session && !alreadyOwner) {
        try {
          await createShopOwner(Number(shopId), user.id);
          redirect("/");
        } catch (error) {
          console.error("Failed to create shop owner:", error);
        }
      }
    };

    handleSignInComplete();
  }, [user, session, clerkStatus, shopId, alreadyOwner]);
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gray-50 px-4">
      <div id="clerk-captcha" />
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
          {!alreadyOwner ? <><div className="text-center mb-5">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            You have been invited to shop
          </h1>
          
          <h2 className="text-4xl font-bold text-gray-900 mb-3">
            {data?.data?.name}
          </h2>
          
          <p className="text-gray-600">
            Fill in to accept this invitation
          </p>
        </div>
        
        <div className="flex justify-center mb-6">
          <form className="flex flex-col gap-4">
            <div hidden={clerkStatus==="sign_in"}>
              <FormControl>
                <FormLabel>First name</FormLabel>
                <Input onChange={(e)=>setFirstName(e.target.value)} required/>
              </FormControl>
              <FormControl>
                <FormLabel>Last name</FormLabel>
                <Input onChange={(e)=>setLastName(e.target.value)} required/>
              </FormControl>
            </div>
            
            <FormControl>
              <Button disabled={isSubmitting} loading={isSubmitting} type="submit" onClick={(e) => acceptHandler(e)}>
                {isSubmitting? "Registering" : "Accept Invitation"}
              </Button>
            </FormControl>
          </form>
          
        </div></> : 
        <div className="text-center mb-5">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            You already own this shop
          </h1>
        </div>}
        
        
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