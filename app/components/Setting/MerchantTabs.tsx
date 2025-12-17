import { Tab, TabList, TabPanel, Tabs, tabClasses } from "@mui/joy";
import React from "react";
import Profilesetting from "./Merchant/Profile/Profilesetting";
import OwnersTable from "./Merchant/Owners/OwnersTable";
import BranchesTab from "./Merchant/Branches/BranchesTab";
import EmailsTab from "./Merchant/Emails/EmailsTab";
import { useTranslations } from "next-intl";

export default function MerchantTabs() {
  const t = useTranslations("setting.tabs.merchant")
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
          <Tab>{t("tabs.overview.label")}</Tab>
          <Tab>{t("tabs.branches.label")}</Tab>
          <Tab>{t("tabs.owners.label")}</Tab>
          <Tab>{t("tabs.email_service.label")}</Tab>
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
        <TabPanel value={3}>
          <EmailsTab/>
        </TabPanel>
      </Tabs>
    </>
  );
}
