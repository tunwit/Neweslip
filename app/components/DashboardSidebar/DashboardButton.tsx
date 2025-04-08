import { Icon } from "@iconify/react/dist/iconify.js";
import Link from "next/link";
import React from "react";

interface DashboardButtonProps {
  title: string;
  icon: string;
  selected?: boolean;
  id: string;
  href: string;
}

export default function DashboardButton({
  title,
  icon,
  selected = false,
  id,
  href,
}: DashboardButtonProps) {
  return (
    <>
      <Link href={href}>
        <div
          className={`flex flex-row rounded-sm font-semibold gap-3 mr-3  py-2 pl-1 items-center hover:bg-[#2b2b2b] ${selected ? "bg-[#d9a241] rounded-sm " : ""}`}
        >
          <Icon
            className={`text-[#7a7a7a] text-lg ${selected ? "text-[#363636]" : ""}`}
            icon={icon}
            inline
          />
          <p className={`text-[#7a7a7a] ${selected ? "text-[#363636]" : ""}`}>
            {title}
          </p>
        </div>
      </Link>
    </>
  );
}
