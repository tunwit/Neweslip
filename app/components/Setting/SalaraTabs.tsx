import { Button, Tab, TabList, TabPanel, Tabs, tabClasses } from "@mui/joy";
import React from "react";
import OTTable from "./Salary/OT/OTTable";
import IncomeTab from "./Salary/Income/IncomeTab";
import DeductionTab from "./Salary/Deduction/DeductionTab";
import OTTab from "./Salary/OT/OTTab";
import PenaltyTab from "./Salary/Penalty/PenaltyTab";
import { useQueryClient } from "@tanstack/react-query";

export default function SalaraTabs() {
  const queryClient = useQueryClient()
  queryClient.prefetchQuery({queryKey:["salaryFields"]})
  queryClient.prefetchQuery({queryKey:["OTFields"]})
  queryClient.prefetchQuery({queryKey:["penaltyFields"]})

  return (
    <>
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
          <Tab>Penalty</Tab>
        </TabList>
        <TabPanel value={0}>
          <IncomeTab />
        </TabPanel>
        <TabPanel value={1}>
          <DeductionTab />
        </TabPanel>
        <TabPanel value={2}>
          <OTTab />
        </TabPanel>
        <TabPanel value={3}>
          <PenaltyTab />
        </TabPanel>
      </Tabs>
    </>
  );
}
