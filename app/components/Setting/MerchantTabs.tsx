import { Tab, TabList, TabPanel, Tabs, tabClasses } from "@mui/joy";
import React from "react";
import Profilesetting from "./Merchant/Profile/Profilesetting";
import OwnersTable from "./Merchant/Owners/OwnersTable";
import BranchesTab from "./Merchant/Branches/BranchesTab";
import { useOTFields } from "@/hooks/useOTFields";

export default function MerchantTabs() {
  const { data } = useOTFields(1)
  
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
          <Tab>Profile</Tab>
          <Tab>Branches</Tab>
          <Tab>Owners</Tab>
          <Tab>Email Service</Tab>
        </TabList>
        <TabPanel value={0}>
          <Profilesetting/>
        </TabPanel>
        <TabPanel value={1}>
          <BranchesTab/>
        </TabPanel>
        <TabPanel value={2}>
          <OwnersTable/>
        </TabPanel>
        <TabPanel value={3}></TabPanel>
      </Tabs>
    </>
  );
}
