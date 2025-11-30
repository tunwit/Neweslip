import { Icon } from "@iconify/react/dist/iconify.js"
import { Button, Modal, ModalClose, ModalDialog } from "@mui/joy"
import { Dispatch, SetStateAction } from "react"

interface ConfirmModalProps{
    title:string
    description:string
    open: boolean
    setOpen:Dispatch<SetStateAction<boolean>>
    onConfirm?: () => void | Promise<void>
    onCancel?: () => void | Promise<void>
}


export default function ConfirmModal({title,description,open,setOpen,onCancel,onConfirm}:ConfirmModalProps) {
    const handleCancel = async () => {
        if (onCancel) await onCancel()
        setOpen(false)
    }

    const handleConfirm = async () => {
        if (onConfirm) await onConfirm()
        setOpen(false)
    }
   return ( 
   <Modal  open={open} onClose={()=>setOpen(false)} >  
        <ModalDialog sx={{width:"30%", background: "#fafafa" }}>
            <ModalClose/>
            <section className="flex flex-col items-center">
                <div className="bg-red-200 w-fit p-4 rounded-full">
                    <Icon className="text-red-600" icon="jam:triangle-danger" fontSize={"40px"}/>
                </div>
                <h1 className="text-2xl font-semibold mt-4">{title}</h1>
                <p className="text-lg mt-2 opacity-50 text-center px-3">{description}</p>
            </section>
            <section className="flex gap-3 w-full justify-center mt-2">
                <Button sx={{width:"100%"}} variant="outlined" color="neutral" onClick={handleCancel}>Cancel</Button>
                <Button sx={{width:"100%"}} color="danger" onClick={handleConfirm}>Confirm</Button>
            </section>
        </ModalDialog>
    </Modal>)
        
}