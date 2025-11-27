import { createSlug } from "@/utils/createSlug";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

interface ShopSidebarElementProps {
  id: number
  title: string;
  selected?: boolean;
}
export default function ShopSidebarElement({
  id,
  title,
  selected = false,
}: ShopSidebarElementProps) {
  const pathName = usePathname()
  const rest = pathName.split("/").slice(2).join("/");
  
  return (
    <Link
      href={`/${createSlug(title,String(id))}/${rest}`}
      className={`flex flex-row rounded-sm font-semibold gap-3 mr-3  py-2 px-[5%] items-center hover:bg-[#2b2b2b] ${selected ? "bg-[#313131] rounded-sm hover:bg-[#2b2b2b]" : ""}`}
    >
      <div className="bg-amber-400   aspect-square w-8 h-8 text-center rounded-full flex items-center justify-center">
        {title.charAt(0) || ""}
      </div>
      <p className="truncate text-[#dedede] text-xs">{title}</p>
    </Link>
  );
}
