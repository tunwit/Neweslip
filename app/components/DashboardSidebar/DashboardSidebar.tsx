"use client";
import React, { useEffect } from "react";
import DashboardButton from "./DashboardButton";
import { usePathname, useRouter } from "next/navigation";
import ShopSidebarElement from "./ShopSidebarElement";
import { Icon } from "@iconify/react/dist/iconify.js";
import { Button } from "@mui/joy";
import useHamburger from "@/hooks/useHamburger";
import { useShop } from "@/hooks/useShop";
import { createSlug } from "@/utils/createSlug";
import UsersIcon from "@/assets/icons/UsersIcon";
import MoneyIcon from "@/assets/icons/MoneyIcon";
import HistoryIcon from "@/assets/icons/HistoryIcon";
import TemplateIcon from "@/assets/icons/TemplateIcon";
import SettingIcon from "@/assets/icons/SettingIcon";
import { useSession } from "@clerk/nextjs";

interface Shop {
    id: number;
    name: string;
    avatar: string | null;
}
const DashboardRails = [
  {
    title: "Employees",
    icon: UsersIcon,
    id: "employees",
    href: "/employees",
  },
  {
    title: "Payrolls",
    icon: MoneyIcon,
    id: "payrolls",
    href: "/payrolls",
  },
  {
    title: "Records",
    icon: HistoryIcon,
    id: "records",
    href: "/records",
  },
];

const ConfigureRails = [
  {
    title: "Template",
    icon: TemplateIcon,
    id: "template",
    href: "/template",
  },
  {
    title: "Setting",
    icon: SettingIcon,
    id: "settings",
    href: "/settings",
  },
];

export default function DashboardSidebar() {
  const pathname = usePathname().split("/");
  const shopSlug = pathname[1];
  const page = pathname[2];
  const sidebarState = useHamburger((state) => state.open);
  const { data, isPending } = useShop();

    return (
      <>
        <div style={{ width: sidebarState ? "100%" : "0%"}}  className="transition-all duration-300 flex flex-col bg-[#1f1f1f] text-black max-h-[calc(100vh-80px)]  max-w-60 w-56 sticky top-0 left-0 shadow-2xl overflow-clip">
          <div className="pl-3 flex flex-col text-sm gap-1">
            {Array.isArray(data?.data) &&
              data?.data.map((shop: Shop, i: number) => {
                const slug = createSlug(shop.name, String(shop.id));

                return (
                  <ShopSidebarElement
                    key={shop.id}
                    title={shop.name}
                    selected={shopSlug == slug}
                  />
                );
              })}
          </div>
          <div className="my-5 px-3">
            <hr className="border-t border-[#747474] h-[2px]" />
          </div>

          <p className="pl-4 text-xs text-[#797979] font-bold mb-4">
            DASHBOARD
          </p>
          <div className="pl-3 flex flex-col text-sm gap-1">
            {DashboardRails.map((v, i) => {
              return (
                <DashboardButton
                  key={i}
                  title={v.title}
                  icon={v.icon}
                  id={v.id}
                  selected={page == v.id}
                  href={`/${shopSlug}${v.href}`}
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
                  href={`/${shopSlug}${v.href}`}
                />
              );
            })}
          </div>
          <span className="absolute bottom-5 text-center w-full text-[#797979] text-xs">
            v 0.0.1 @alpha
          </span>
        </div>
      </>
    );
  }

