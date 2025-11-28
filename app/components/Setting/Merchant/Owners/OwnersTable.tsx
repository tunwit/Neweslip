import { useCurrentShop } from "@/hooks/useCurrentShop";
import { useOwners } from "@/hooks/useOwners";
import { Icon } from "@iconify/react/dist/iconify.js";
import { Button, IconButton, Table } from "@mui/joy";
import React, { useState } from "react";
import InvitationModal from "./InvitationModal";
import TableWithCheckBox from "@/widget/TableWIthCheckbox";
import { useCheckBox } from "@/hooks/useCheckBox";
import { Owner } from "@/types/owner";
import { useUser } from "@clerk/nextjs";
import { deleteShopOwner } from "@/app/action/deleteShopOwner";
import { showError, showSuccess } from "@/utils/showSnackbar";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import ConfirmModal from "@/widget/ConfirmModal";

export default function OwnersTable() {
  const { id:shopId } = useCurrentShop()
  const { user} = useUser()
  const { data, isLoading,isSuccess } = useOwners(shopId!)
  const [open,setOpen] = useState(false)
  const [openConfirm,setOpenConfirm] = useState(false)
  const checkboxMethods = useCheckBox<string>("ownerTable")
  const {checked ,uncheckall} =checkboxMethods
  const router = useRouter()
  const queryClient = useQueryClient()
  
  const handleDelete = async () => {
      try {
        if (!shopId) return;
        uncheckall()
        await deleteShopOwner(checked, shopId, user?.id || null);
        showSuccess("Delete owners success");
        queryClient.invalidateQueries({ queryKey: ["owners"] });
        
        router.refresh()
      } catch (err) {
        showError(`Delete owners failed \n${err}`);
      }
    };
  return (
    <div className="-mt-4">
    <ConfirmModal
        title="Delete" 
        description={`This action will cause these user not able to access this shop\nAre you sure to continue?`} 
        open={openConfirm} 
        setOpen={()=>setOpenConfirm(!openConfirm)} 
        onConfirm={handleDelete}
        onCancel={()=>setOpenConfirm(false)}/>

    <InvitationModal open={open} setOpen={setOpen}/>
    <h1 className="font-medium text-3xl">Owners</h1>
      <div className="-mt-6">
        <div className="flex flex-row-reverse">
          <Button
            disabled={checked ? checked.length === 0 : true}
            variant="plain"
            onClick={()=>setOpenConfirm(true)}
          >
            <p className="underline font-medium">delete</p>
          </Button>
        </div>
          <TableWithCheckBox data={data?.data}
            isLoading={isLoading}
            isSuccess={isSuccess}
            checkboxMethods={checkboxMethods}
            setOpen={setOpen}
            editColumn={false}
            columns={[
              { key: "firstName", label: "",width:"5%",render:(r:Owner)=>{
                return <div className="bg-red-200   aspect-square w-7 h-7 text-center rounded-full flex items-center justify-center">
                  <p className="text-xs">{r.firstName?.charAt(0)}</p>
                </div>
              } },
              { key: "fullName", label: "Name" ,render:(r)=>{
                return <p>{r.fullName} {user?.primaryEmailAddress?.emailAddress === r.email && "( you )"}</p>
              }},
              { key: "email", label: "Email" },
            ]}/>
        <div className="mt-4 flex gap-4">
          <Button onClick={()=>setOpen(true)}>Invite Owner</Button>
          {/* <Button onClick={()=>setOpen(true)} variant="outlined" color="danger">Leave Shop</Button> */}
        </div>
      </div>
    </div>
  );
}
