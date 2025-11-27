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

export default function OwnersTable() {
  const { id:shopId } = useCurrentShop()
  const { user} = useUser()
  const { data, isLoading,isSuccess } = useOwners(shopId!)
  const [open,setOpen] = useState(false)
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
    <>
    <InvitationModal open={open} setOpen={setOpen}/>
    <h1 className="font-medium text-3xl">Owners</h1>
      <div className="-mt-6">
        <div className="flex flex-row-reverse">
          <Button
            disabled={checked ? checked.length === 0 : true}
            variant="plain"
            onClick={handleDelete}
          >
            <p className="underline font-medium">delete</p>
          </Button>
        </div>
          <TableWithCheckBox data={data?.data}
            isLoading={isLoading}
            isSuccess={isSuccess}
            checkboxMethods={checkboxMethods}
            setOpen={setOpen}
            columns={[
              { key: "firstName", label: "",width:"5%",render:(r:Owner)=>{
                return <div className="bg-red-200   aspect-square w-7 h-7 text-center rounded-full flex items-center justify-center">
                  <p className="text-xs">{r.firstName?.charAt(0)}</p>
                </div>
              } },
              { key: "fullName", label: "Name" },
              { key: "email", label: "Email" },
            ]}/>
        <div className="mt-2">
          <Button onClick={()=>setOpen(true)}>Add Owner</Button>
        </div>
      </div>
    </>
  );
}
