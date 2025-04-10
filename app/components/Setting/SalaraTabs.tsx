import { Button, Tab, TabList, TabPanel, Tabs, tabClasses } from "@mui/joy";
import React from "react";
import IncomeTable from "./Salary/Income/IncomeTable";
import OTTable from "./Salary/OT/OTTable";
import DeductionTable from "./Salary/Deduction/DeductionTable";
import AbsentTable from "./Salary/Absent/AbsentTable";

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
        </TabPanel>
        <TabPanel value={1}>
          <DeductionTable />
        </TabPanel>
        <TabPanel value={2}>
          <OTTable />
        </TabPanel>
        <TabPanel value={3}>
          <AbsentTable />
        </TabPanel>
      </Tabs>
    </>
  );
}
