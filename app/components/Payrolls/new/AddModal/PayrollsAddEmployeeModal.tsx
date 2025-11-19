import {
  Button,
  Modal,
  ModalClose,
  ModalDialog,
  ModalOverflow,
  Option,
  Select,
  Typography,
} from "@mui/joy";
import React, { useEffect, useMemo, useState } from "react";
import { Icon } from "@iconify/react/dist/iconify.js";
import { Employee, EmployeeWithShop } from "@/types/employee";
import data from "@/assets/employee";
import { useSelectedEmployees } from "../hooks/useSelectedEmployee";
import BranchSelector from "@/widget/BranchSelector";
import { useCheckBox } from "@/hooks/useCheckBox";
import TableWithCheckBox from "@/widget/TableWIthCheckbox";
import { useEmployees } from "@/hooks/useEmployees";
import { getRandomPastelColor } from "@/utils/generatePastelColor";
import { createPayrollRecords } from "@/app/action/createPayrollRecord";
import { showError, showSuccess } from "@/utils/showSnackbar";
import { useQueryClient } from "@tanstack/react-query";

interface PayrollsAddEmployeeModal {
  periodId:number
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}
export default function PayrollsAddEmployeeModal({
  periodId,
  open,
  setOpen,
}: PayrollsAddEmployeeModal) {
  const methods = useCheckBox<number>("payrollAddEmployeeTable")
  const queryClient = useQueryClient();
  const {checked,uncheckall} = methods
  const { data,isLoading,isSuccess } = useEmployees({})
  
  const [selected,setSelected] = useState<EmployeeWithShop|null>(null)

  const handlerConfirm = async () => {
    try{
      await createPayrollRecords(checked,periodId)
      queryClient.invalidateQueries({queryKey:["payrollRecord"]})
      showSuccess(`Add employee success`)
      setOpen(false)
    }
    catch(err:any){
      let msg = err.message
      if(msg == "ER_DUP_ENTRY") msg = "You cannot add duplicate employee"
      showError(`Add employee failed \n ${msg}`) 
    }finally{
      uncheckall()
    }
  }

  return (
    <>
      <Modal open={open} onClose={() => setOpen(false)}>
        {/* <ModalOverflow> */}
        <ModalDialog>
          <div className="flex flex-col justify-center ">
            <div className="flex flex-row items-center gap-2">
              <p className="font-bold text-lg">Employees ({data?.data?.length} people)</p>
              {/* <p>{Object.values(checkboxs).filter((v) => v === true).length}</p> */}
              <p>selected</p>
            </div>

            <div className="flex flex-row gap-2 my-2">
              <div className="w-[80%]">
                <p className="text-black text-xs mb-1">Search Payrolls</p>
                <div className="flex flex-row items-center gap-1 bg-[#fbfcfe] py-[7px] px-2 rounded-sm border border-[#c8cfdb] shadow-xs">
                  <Icon
                    className="text-[#424242]"
                    icon={"material-symbols:search-rounded"}
                  />
                  <input
                    type="text"
                    placeholder="Search"
                    className="text-[#424242] font-light text-sm  w-full  focus:outline-none "
                  />
                </div>
              </div>

              <div className="w-[20%]">
                <p className="text-black text-xs mb-1">Brach</p>
                <BranchSelector branchId={-1} onChange={()=>{}} isEnableAll={true}/>
              </div>
            </div>
            <div className="w-full border border-[#d4d4d4] rounded-sm max-h-[calc(100vh-300px)] overflow-x-auto overflow-y-auto shadow-sm">
              <TableWithCheckBox data={data?.data}
                isLoading={isLoading}
                isSuccess={isSuccess}
                checkboxMethods={methods}
                setSelectedItem={setSelected}
                setOpen={setOpen}
                columns={[
                 
                  { key: "name", label: "Name",render: (row) => `${row.firstName} ${row.lastName}`},
                  { key: "nickName", label: "Nick Name",render: (row) => `${row.nickName}`, },
                  { key: "branch", label: "Branch",render: (row) => `${row.branch.name}`, },
    
                ]}/>

            </div>
            <div className="flex flex-row gap-2 ml-auto mt-2">
              <Button
                size="sm"
                variant="outlined"
                onClick={() => setOpen(false)}
              >
                Close
              </Button>
              <Button size="sm" onClick={() => handlerConfirm()}>
                Confirm
              </Button>
            </div>
          </div>
        </ModalDialog>
        {/* </ModalOverflow> */}
      </Modal>
    </>
  );
}
