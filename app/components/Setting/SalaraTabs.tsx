import { Button, Tab, TabList, TabPanel, Tabs, tabClasses } from "@mui/joy";
import React from "react";
import IncomeTable from "./Salary/IncomeTable";
import OTTable from "./Salary/OTTable";
import DeductionTable from "./Salary/DeductionTable";

export default function SalaraTabs() {
  return (
    <>
      {" "}
      <Tabs aria-label="Basic tabs" defaultValue={0} orientation="vertical">
        <TabList
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
          <Tab>Income</Tab>
          <Tab>Deduction</Tab>
          <Tab>OT</Tab>
          <Tab>Absent</Tab>
        </TabList>
        <TabPanel value={0}>
          <IncomeTable />
          <div className="mt-2">
            <Button>Add Income</Button>
          </div>
        </TabPanel>
        <TabPanel value={1}>
          <DeductionTable/>
          <div className="mt-2">
            <Button>Add Deduction</Button>
          </div>
        </TabPanel>
        <TabPanel value={2}>
          <OTTable />
          <div className="mt-2">
            <Button>Add OT</Button>
          </div>
        </TabPanel>
        <TabPanel value={3}>
          <b>Forth</b> tab panel
        </TabPanel>
      </Tabs>
    </>
  );
}
