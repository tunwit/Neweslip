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
import React, { useEffect, useState } from "react";
import { Icon } from "@iconify/react/dist/iconify.js";
import { Employee } from "@/types/employee";
import PayrollsAllEmployeeTable from "./PayrollsAllEmployeeTable";
import data from "@/assets/employee";
import {
  useAllSelectKit,
  usePayrollSelectKit,
} from "../../../../../hooks/useCheckBox";
import { useSelectedEmployees } from "../hooks/useSelectedEmployee";

interface PayrollsAddEmployeeModal {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}
export default function PayrollsAddEmployeeModal({
  open,
  setOpen,
}: PayrollsAddEmployeeModal) {
  const { add } = useSelectedEmployees();

  const { checkboxs, checkedItem, uncheckall, setItem } = useAllSelectKit();

  const handlerConfirm = () => {
    add(checkedItem);
    setOpen(false);
    //Reset Checkbox when comfirm
    uncheckall();
    setItem([]);
  };

  return (
    <>
      <Modal open={open} onClose={() => setOpen(false)}>
        {/* <ModalOverflow> */}
        <ModalDialog>
          <div className="flex flex-col justify-center ">
            <div className="flex flex-row items-center gap-2">
              <p className="font-bold text-lg">Employees (30 people)</p>
              <p>{Object.values(checkboxs).filter((v) => v === true).length}</p>
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
                <Select
                  defaultValue="All"
                  sx={{ borderRadius: "4px", fontSize: "14px" }}
                >
                  <Option value="All">All</Option>
                  <Option value="Pakkret">Pakkret</Option>
                  <Option value="Ramintra">Ramintra</Option>
                  <Option value="Kallapapruk">Kallapapruk</Option>
                </Select>
              </div>
            </div>
            <div className="w-full border border-[#d4d4d4] rounded-sm max-h-[calc(100vh-300px)] overflow-x-auto overflow-y-auto shadow-sm">
              <PayrollsAllEmployeeTable />
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
