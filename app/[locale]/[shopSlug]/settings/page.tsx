"use client";
import Image from "next/image";
import Button from "@mui/joy/Button";
import { Icon } from "@iconify/react/dist/iconify.js";
import Select from "@mui/joy/Select";
import Option from "@mui/joy/Option";
import EmployeesTable from "@/app/components/Employees/EmployeesTable";
import dayjs from "dayjs";
import { Checkbox, Tab, TabList, TabPanel, Tabs, tabClasses } from "@mui/joy";
import { Add } from "@mui/icons-material";
import { useRouter } from "next/navigation";
import MerchantTabs from "@/app/components/Setting/MerchantTabs";
import { useCurrentShop } from "@/hooks/shop/useCurrentShop";
import SalaraTabs from "@/app/components/Setting/SalaraTabs";
import { useTranslations } from "next-intl";

export default function Page() {
  const rounter = useRouter();
  const { name } = useCurrentShop();
  const tBreadcrumb = useTranslations("breadcrumb");
  const t = useTranslations("setting");

  return (
    <main className="w-full bg-white font-medium overflow-scroll">
      <title>Setting - Mitr</title>
      <div className="mx-10 flex flex-col min-h-screen ">
        <div className="flex flex-row text-[#424242] text-xs mt-10">
          <p>
            {name} {">"} {tBreadcrumb("configure")} {">"}&nbsp;
          </p>
          <p className="text-blue-800">{tBreadcrumb("setting")}</p>
        </div>
        <div className="my-5 flex flex-row justify-between">
          <p className="text-black text-4xl font-bold">{t("label")}</p>
        </div>

        <Tabs aria-label="Basic tabs" defaultValue={0}>
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
            <Tab>{t("tabs.merchant.label")}</Tab>
            <Tab>{t("tabs.salary.label")}</Tab>
            <Tab>{t("tabs.slip.label")}</Tab>
          </TabList>
          <TabPanel value={0}>
            <MerchantTabs />
          </TabPanel>
          <TabPanel value={1}>
            <SalaraTabs />
          </TabPanel>
          <TabPanel value={2}>
            <b>Third</b> tab panel
          </TabPanel>
        </Tabs>
      </div>
    </main>
  );
}
