"use client";
import React from "react";
import DashboardButton from "./DashboardButton";
import { usePathname, useRouter } from "next/navigation";
import ShopSidebarElement from "./ShopSidebarElement";
import { Icon } from "@iconify/react/dist/iconify.js";
import { signOut, useSession } from "next-auth/react";
import { Button } from "@mui/joy";
import SignOutButton from "./SignOutButton";
import useHamburger from "@/hooks/useHamburger";

const shops = [{ title: "Haris premium buffet" }, { title: "ตุ๊กแก" }];

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
    icon: "ic:round-history",
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
    id: "settings",
    href: "/settings",
  },
];

export default function DashboardSidebar() {
  const pathname = usePathname().split("/");
  const shop = pathname[1];
  const page = pathname[2];

  const sidebarState = useHamburger((state) => state.open);
  const session = useSession();
  if (sidebarState) {
    return (
      <>
        <div className="flex flex-col bg-[#1f1f1f] text-black max-h-[calc(100vh-80px)] min-w-36 w-[15%] sticky top-0 left-0 shadow-2xl">
          <div className="pl-3 flex flex-col text-sm gap-1">
            {shops.map((v, i) => {
              return (
                <ShopSidebarElement
                  key={i}
                  title={v.title}
                  selected={v.title == "Haris premium buffet"}
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
          <div className="flex justify-center mt-5">
            {session && <SignOutButton />}
          </div>

          <span className="absolute bottom-5 text-center w-full text-[#797979] text-xs">
            v 0.0.1 @alpha
          </span>
        </div>
      </>
    );
  }
}
