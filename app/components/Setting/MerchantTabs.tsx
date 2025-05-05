import { Tab, TabList, TabPanel, Tabs, tabClasses } from "@mui/joy";
import React from "react";
import Profilesetting from "./Merchant/Profile/Profilesetting";
import OwnersTable from "./Merchant/Owners/OwnersTable";

export default function MerchantTabs() {
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
          <Tab>Owners</Tab>
          <Tab>Email Service</Tab>
        </TabList>
        <TabPanel value={0}>
          <Profilesetting/>
        </TabPanel>
        <TabPanel value={1}>
          <OwnersTable/>
        </TabPanel>
        <TabPanel value={2}></TabPanel>
      </Tabs>
    </>
  );
}
