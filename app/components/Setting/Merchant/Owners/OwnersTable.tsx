import { useCurrentShop } from "@/hooks/useCurrentShop";
import { useOwners } from "@/hooks/useOwners";
import { Icon } from "@iconify/react/dist/iconify.js";
import { Button, IconButton, Table } from "@mui/joy";
import React from "react";

export default function OwnersTable() {
  const { id } = useCurrentShop()
  const { data, isLoading } = useOwners(id!)
  
  
  return (
    <>
      <div>
        <div className="border border-[#d8d8d8] w-auto rounded-md px-1 max-h-[calc(100vh-350px)] overflow-auto">
          <Table stickyHeader hoverRow variant="plain" noWrap>
            <thead>
              <tr>
                <th className="font-medium w-[5%]"></th>
                <th className="font-medium">Name</th>
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
                  <tr>
                    <td>
                      <div className="bg-red-200   aspect-square w-7 h-7 text-center rounded-full flex items-center justify-center">
                        <p className="text-xs">{o.firstName?.charAt(0)}</p>
                      </div>
                    </td>
                    <td>{o.fullName}</td>
                    <td>
                        <IconButton/>
                    </td>
                  </tr>
                ))}
            </tbody>
          </Table>
        </div>
        <div className="mt-2">
          <Button>Add Owner</Button>
        </div>
      </div>
    </>
  );
}
