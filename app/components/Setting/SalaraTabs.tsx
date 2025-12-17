import { Button, Tab, TabList, TabPanel, Tabs, tabClasses } from "@mui/joy";
import IncomeTab from "./Salary/Income/IncomeTab";
import DeductionTab from "./Salary/Deduction/DeductionTab";
import OTTab from "./Salary/OT/OTTab";
import { useQueryClient } from "@tanstack/react-query";
import DisplayOnlyTab from "./Salary/DisplayOnly/DIsplayOnlyTab";
import PenaltyTab from "./Salary/Penalty/PenaltyTab";
import { useTranslations } from "next-intl";

export default function SalaraTabs() {
  const queryClient = useQueryClient();
  const tr = useTranslations("record")
  queryClient.prefetchQuery({ queryKey: ["salaryFields"] });
  queryClient.prefetchQuery({ queryKey: ["OTFields"] });
  queryClient.prefetchQuery({ queryKey: ["penaltyFields"] });

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
          <Tab>{tr("fields.earning")}</Tab>
          <Tab>{tr("fields.deduction")}</Tab>
          <Tab>{tr("fields.overtime")}</Tab>
          <Tab>{tr("fields.penalties")}</Tab>
          <Tab>{tr("fields.displayonly")}</Tab>
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
        <TabPanel value={4}>
          <DisplayOnlyTab />
        </TabPanel>
      </Tabs>
    </>
  );
}
