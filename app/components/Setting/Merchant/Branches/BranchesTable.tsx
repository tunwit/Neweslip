import { useBranch } from "@/hooks/useBranch";
import { useCheckBox } from "@/hooks/useCheckBox";
import { Branch } from "@/types/branch";
import { ApiResponse } from "@/types/response";
import { Icon } from "@iconify/react/dist/iconify.js";
import { Button, Checkbox, IconButton, Table } from "@mui/joy";
import React, { Dispatch, SetStateAction } from "react";

interface BranchesTableProps {
  data: ApiResponse<Branch[]> | undefined;
  isLoading: boolean;
  isSuccess: boolean;
  setSelectedBranch: Dispatch<SetStateAction<Branch|null>>
  setOpen: Dispatch<SetStateAction<boolean>>
}

export default function BranchesTable({data, isLoading, isSuccess, setSelectedBranch,setOpen}:BranchesTableProps) {
  const {toggle, isChecked, checkall, uncheckall, isAllChecked, isSomeChecked} = useCheckBox("allBranchTable")

  const handleAllCheckbox = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!data?.data) return;
    if (e.currentTarget.checked) {
      checkall(data.data.map((v) => v.id));
    } else {
      uncheckall();
    }
  };
  return (
    <>
        <div className="border border-[#d8d8d8] w-auto rounded-md px-1 max-h-[calc(100vh-350px)] overflow-auto">
          <Table stickyHeader hoverRow variant="plain">
            <thead>
              <tr>
                <th className="w-[5%]">
                  <Checkbox
                    checked={isAllChecked(data?.data?.length ?? 0)}
                    indeterminate={isSomeChecked(data?.data?.length ?? 0)}
                    onChange={handleAllCheckbox}
                  />
                </th>
                <th className="font-medium">Name</th>
                <th className="font-medium w-[5%]"></th>
              </tr>
            </thead>
            <tbody>
                
              {isLoading &&
                <tr className="text-center">
                  <td colSpan={2}>Loading...</td>
                </tr>
                }
                {isSuccess && data?.data?.map((branch) => (
                  <tr>
                    <td>
                      <Checkbox
                          checked={isChecked(branch.id)}
                          onChange={(e) => {
                            toggle(branch.id);
                          }}
                          />
                    </td>
                    <td>{branch.name}</td>
                    <td className="cursor-pointer" onClick={()=>{setSelectedBranch(branch);setOpen(true)}}>
                      <Icon icon={"ic:baseline-edit"} className="text-xl" />
                    </td>
                  </tr>
                ))}
              
            </tbody>
          </Table>
        </div>
    </>
  );
}
