import { createInvitation } from "@/app/action/createInvitation";
import { useCurrentShop } from "@/hooks/useCurrentShop";
import { useUser } from "@clerk/nextjs";
import { Icon } from "@iconify/react/dist/iconify.js";
import { Button, FormControl, FormLabel, Input, Modal, ModalClose, ModalDialog } from "@mui/joy";
import { Dispatch, SetStateAction, useRef, useState } from "react";
import QRCode from 'qrcode'
import { getShortLink } from "@/app/action/getShortLink";
import { NewInvitation } from "@/types/invitation";
import { showError } from "@/utils/showSnackbar";
import { isOwner } from "@/lib/isOwner";
import { getUserByEmail } from "@/app/action/getUserByEmail";

interface InvitationModalProps{
    open: boolean
    setOpen: Dispatch<SetStateAction<boolean>>
}
export default function InvitationModal({open,setOpen}:InvitationModalProps) {
    const [email,setEmail] = useState("")
    const [isSubmitting,setIsSubmitting] = useState(false)
    const {id:shopId} = useCurrentShop()
    const [invitaionUrl,setInvitationUrl] = useState<string | undefined>("")
    const [isCopied,setIscopied] = useState(false)
    const [error,setError] = useState("")

    const canvas = useRef(null);
    const [isShortenComplete,setIsShortenComplete] = useState(false)

    const user = useUser()



    const generateHandler = async() =>{
        if(!shopId || !user.user) return
        setIsSubmitting(true)
        setError("")
    
        try{
            const userByEmail = await getUserByEmail(email)
            const alreadyOwn = await isOwner(shopId,userByEmail[0]?.id)

            if(alreadyOwn){
                setError("This user is already own this shop")  
                return
            }
            const invitation = await createInvitation(email,"/accept-invitation",shopId,user.user?.id)
            
            if(!invitation.success){
                showError("create invitaion failed")
                return
            }
            const url = `${window.origin}/accept-invitation?token=${invitation.token}`
            setInvitationUrl(url)
            
            QRCode.toCanvas(canvas.current, url,{
                 width: 200,
                margin: 2, 
            }, function (error:unknown) {
                if (error) console.error(error)
            })
        
        }catch (err){
            console.log(err);        
        }finally{
            setIsSubmitting(false)
            setIscopied(false)
        }
    }

    const copyHandler = () =>{
        if(!invitaionUrl) return
        setIscopied(true)
        navigator.clipboard.writeText(invitaionUrl)
    }

   return ( 
   <Modal open={open} onClose={()=>setOpen(false)} >  
        <ModalDialog sx={{ background: "#fafafa" }}>
            <ModalClose/>
            <section className="border-b pb-3 border-gray-400">
                <h1 className="font-bold text-xl">Invitation</h1>
                <p className="opacity-60">Invite new owner to this shop</p>
            </section>

            <section>
                <FormControl>
                    <FormLabel>Email</FormLabel>
                    <Input placeholder="example@gmail.com" 
                    onChange={(e)=>{setEmail(e.target.value)}}
                    endDecorator={
                        <Button disabled={isSubmitting || email===""} loading={isSubmitting} onClick={generateHandler} size="sm">generate</Button>
                    }/>
                    {error && <p className="text-red-700">{error}</p>}
                </FormControl>
            </section>
            <section hidden={!invitaionUrl || isSubmitting}>
                <FormControl >
                    <div className="flex items-center justify-center my-5">
                         {/* <div hidden={isShortenComplete} className="w-[200px] h-[200px] flex justify-center items-center rounded-md border border-gray-400 text-sm">Cannot generate QR code</div> */}
                         <canvas  ref={canvas} className="rounded-md border border-gray-400"/>
                    </div>
                    
                    <FormLabel>Invitaion Link</FormLabel>
                    <div className="flex flex-row gap-2">
                        <Input placeholder="example@gmail.com" 
                        value={invitaionUrl}
                        />
                        <Button sx={
                            {paddingRight:2.5}
                        } startDecorator={
                                isCopied ? <Icon icon={"material-symbols:check-rounded"} fontSize={"15px"}/> : 
                                <Icon icon={"mynaui:clipboard"} fontSize={"15px"}/>
                            } onClick={copyHandler} size="sm">copy</Button>
                    </div>
                    
                </FormControl>
            </section>
        </ModalDialog>
    </Modal>)
        
}