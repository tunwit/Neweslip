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
import PayrollOTAbsentTable from "./details/PayrollOTTable";
import PayrollOTTable from "./details/PayrollOTTable";
import PayrollAbsentTable from "./details/PayrollAbsentTable";

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
                <Tab color="neutral">Overtime</Tab>
                <Tab color="neutral">Absent</Tab>

              </TabList>
              <TabPanel value={0}>
                <PayrollIncomeTable amount={amount} />
              </TabPanel>
              <TabPanel value={1}>
                <PayrollDeductionTable />
              </TabPanel>
              <TabPanel value={2}>
                <PayrollOTTable />
              </TabPanel>
              <TabPanel value={3}>
                <PayrollAbsentTable />
              </TabPanel>
            </Tabs>
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
