import {
  Button,
  Modal,
  ModalClose,
  ModalDialog,
  ModalOverflow,
  Tab,
  tabClasses,
  Table,
  TabList,
  TabPanel,
  Tabs,
} from "@mui/joy";
import React from "react";
import PayrollIncomeTable from "./details/PayrollIncomeTable";
import PayrollDeductionTable from "./details/PayrollDeductionTable";
import PayrollOTAbsentTable from "./details/PayrollOTAbsentTable";

interface PayrollEditEmployeeModalProps {
  name: string;
  amount: number;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function PayrollEditEmployeeModal({
  name,
  amount,
  open,
  setOpen,
}: PayrollEditEmployeeModalProps) {
  const doneHandler = () => {
    setOpen(false);
  };
  return (
    <>
      <Modal open={open}>
        <ModalDialog sx={{ background: "#fafafa" }}>
          <p>Salary Details</p>
          <p className="text-3xl font-bold">{name}</p>
          <div className="gap-5 bg-white p-4 rounded-sm shadow-sm w-full">
            <Tabs aria-label="Basic tabs" defaultValue={0}>
              <TabList
                disableUnderline
                sx={{
                  [`& .${tabClasses.root}`]: {
                    fontSize: "sm",
                    fontWeight: "lg",
                    [`&[aria-selected="true"]`]: {
                      bgcolor: "background.surface",
                    },
                    [`&.${tabClasses.focusVisible}`]: {
                      outlineOffset: "-4px",
                    },
                  },
                }}
              >
                <Tab color="success">Income</Tab>
                <Tab color="danger">Deduction</Tab>
                <Tab color="neutral">Overtime / Absent</Tab>
              </TabList>
              <TabPanel value={0}>
                <PayrollIncomeTable amount={amount} />
              </TabPanel>
              <TabPanel value={1}>
                <PayrollDeductionTable />
              </TabPanel>
              <TabPanel value={2}>
                <PayrollOTAbsentTable />
              </TabPanel>
            </Tabs>
            {/* 
              
              <div>
                <p className="font-bold">Deduction</p>
                <div className="grid grid-cols-2 gap-4">
                  <p>เบิก</p>
                  <input className="focus:outline-none bg-gray-200 rounded-sm w-20 px-1" />

                  <p>ประกันสังคม</p>
                  <input className="focus:outline-none bg-gray-200 rounded-sm w-20 px-1" />

                  <p>จ่ายเงินกู้</p>
                  <input className="focus:outline-none bg-gray-200 rounded-sm w-20 px-1" />

                  <p>หนี้</p>
                  <input className="focus:outline-none bg-gray-200 rounded-sm w-20 px-1" />

                  <p>สาย</p>
                  <input className="focus:outline-none bg-gray-200 rounded-sm w-20 px-1" />

                  <p>ลา</p>
                  <input className="focus:outline-none bg-gray-200 rounded-sm w-20 px-1" />
                </div>
              </div>
              <div>
              [OT (day),OT (hour),OT (x3),ขาด,สาย,ลาป่วย,ลากิจ,ลาพักร้อน]
                <p className="font-bold">Details</p>
                <div className="grid grid-cols-2 gap-y-3 gap-x-2">
                  <p>Base salary</p>
                  <input className="focus:outline-none bg-gray-200 rounded-sm w-20 px-1" />

                  <p>Position fee</p>
                  <input className="focus:outline-none bg-gray-200 rounded-sm w-20 px-1" />

                  <p>OT (day)</p>
                  <input className="focus:outline-none bg-gray-200 rounded-sm w-20 px-1" />

                  <p>OT (hour)</p>
                  <input className="focus:outline-none bg-gray-200 rounded-sm w-20 px-1" />

                  <p>OT (x3)</p>
                  <input className="focus:outline-none bg-gray-200 rounded-sm w-20 px-1" />

                  <p>เบี้ยขยัน</p>
                  <input className="focus:outline-none bg-gray-200 rounded-sm w-20 px-1" />

                  <p>สวัสดิการ</p>
                  <input className="focus:outline-none bg-gray-200 rounded-sm w-20 px-1" />

                  <p>ยอดเป้า</p>
                  <input className="focus:outline-none bg-gray-200 rounded-sm w-20 px-1" />

                  <p>โบนัส</p>
                  <input className="focus:outline-none bg-gray-200 rounded-sm w-20 px-1" />
                </div>
              </div> */}
          </div>
          <Button
            onClick={() => {
              doneHandler();
            }}
          >
            Done
          </Button>
        </ModalDialog>
      </Modal>
    </>
  );
}
