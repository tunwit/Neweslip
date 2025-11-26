import { useCurrentShop } from "@/hooks/useCurrentShop";
import { useOwners } from "@/hooks/useOwners";
import { Icon } from "@iconify/react/dist/iconify.js";
import { Button, IconButton, Table } from "@mui/joy";
import React, { useState } from "react";
import InvitationModal from "./InvitationModal";

export default function OwnersTable() {
  const { id } = useCurrentShop()
  const { data, isLoading } = useOwners(id!)
  const [open,setOpen] = useState(false)
  
  
  return (
    <>
    <InvitationModal open={open} setOpen={setOpen}/>
      <div>
        <div className="border border-[#d8d8d8] w-auto rounded-md px-1 max-h-[calc(100vh-350px)] overflow-auto">
          <Table stickyHeader hoverRow variant="plain" noWrap>
            <thead>
              <tr>
                <th className="font-medium w-[5%]"></th>
                <th className="font-medium">Name</th>
                <th className="font-medium">Email</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
                {isLoading &&  (
                  <tr className="text-center">
                    <td colSpan={3}>
                      <p>Loading...</p>
                    </td>
                  </tr>
                )}
                {!isLoading && data?.data?.map((o)=> (
                  <tr key={o.id}>
                    <td>
                      <div className="bg-red-200   aspect-square w-7 h-7 text-center rounded-full flex items-center justify-center">
                        <p className="text-xs">{o.firstName?.charAt(0)}</p>
                      </div>
                    </td>
                    <td>{o.fullName}</td>
                    <td>{o.email}</td>
                    <td>
                        <IconButton/>
                    </td>
                  </tr>
                ))}
            </tbody>
          </Table>
        </div>
        <div className="mt-2">
          <Button onClick={()=>setOpen(true)}>Add Owner</Button>
        </div>
      </div>
    </>
  );
}
