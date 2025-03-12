"use client";
import React from "react";
import List from "@mui/joy/List";
import ListItem from "@mui/joy/ListItem";
import ListItemButton from "@mui/joy/ListItemButton";
import ListItemDecorator from "@mui/joy/ListItemDecorator";
import { Icon } from "@iconify/react";
import DashboardButton from "./DashboardButton";
import { usePathname, useRouter } from "next/navigation";

const DashboardRails = [
  {
    title: "Employees",
    icon: "mdi:users",
    id: "employees",
    href: "/employees",
  },
  {
    title: "Payrolls",
    icon: "tdesign:money-filled",
    id: "payrolls",
    href: "/payrolls",
  },
  {
    title: "Records",
    icon: "vaadin:records",
    id: "records",
    href: "/records",
  },
];

const ConfigureRails = [
  {
    title: "Template",
    icon: "tdesign:template-filled",
    id: "template",
    href: "/template",
  },
  {
    title: "Setting",
    icon: "tdesign:setting-1-filled",
    id: "setting",
    href: "/settings",
  },
];

export default function DashboardSidebar({
  params,
}: {
  params: Promise<{ shopId: string }>;
}) {
  const pathname = usePathname().split("/");
  const page = pathname[2];
  const shop = pathname[1];

  return (
    <>
      <div className="flex flex-col bg-[#f2f6fc] text-black h-screen min-w-36  border-r border-[#d4d4d4] sticky top-0 left-0">
        <p className="pl-4 text-xs text-[#797979] font-bold mt-10 mb-4">
          DASHBOARD
        </p>
        <div className="pl-3 flex flex-col text-sm gap-1">
          {DashboardRails.map((v, i) => {
            console.log(`/${shop}${v.href}`);
            return (
              <DashboardButton
                key={i}
                title={v.title}
                icon={v.icon}
                id={v.id}
                selected={page == v.id}
                href={`/${shop}${v.href}`}
              />
            );
          })}
        </div>

        <p className="pl-4 text-xs text-[#797979] font-bold mt-10 mb-4">
          CONFIGURE
        </p>
        <div className="pl-3 flex flex-col text-sm gap-1">
          {ConfigureRails.map((v, i) => {
            return (
              <DashboardButton
                key={i}
                title={v.title}
                icon={v.icon}
                id={v.id}
                selected={page == v.id}
                href={`/${shop}${v.href}`}
              />
            );
          })}
        </div>
      </div>
    </>
  );
}
