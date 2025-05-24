import Link from "next/link";
import React from "react";

interface ShopSidebarElementProps {
  title: string;
  selected?: boolean;
}
export default function ShopSidebarElement({
  title,
  selected = false,
}: ShopSidebarElementProps) {
  return (
    <Link
      href={"#"}
      className={`flex flex-row rounded-sm font-semibold gap-3 mr-3  py-2 px-[5%] items-center hover:bg-[#2b2b2b] ${selected ? "bg-[#313131] rounded-sm hover:bg-[#2b2b2b]" : ""}`}
    >
      <div className="bg-amber-400   aspect-square w-8 h-8 text-center rounded-full flex items-center justify-center">
        {title.charAt(0) || ""}
      </div>
      <p className="truncate text-[#dedede] text-xs">{title}</p>
    </Link>
  );
}
