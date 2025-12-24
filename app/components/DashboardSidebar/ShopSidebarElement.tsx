import { createSlug } from "@/utils/createSlug";
import ChangableAvatar from "@/widget/ChangableAvatar";
import { Avatar } from "@mui/joy";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

interface ShopSidebarElementProps {
  id: number;
  title: string;
  selected?: boolean;
  avatar?: string;
}
export default function ShopSidebarElement({
  id,
  title,
  selected = false,
  avatar,
}: ShopSidebarElementProps) {
  const pathName = usePathname();
  const rest = pathName.split("/").slice(2).join("/");
  const url = `${process.env.NEXT_PUBLIC_CDN_URL}/${avatar}`;

  return (
    <Link
      href={`/${createSlug(title, String(id))}/${rest}`}
      className={`flex flex-row rounded-sm font-semibold gap-3 mr-3  py-2 px-[5%] items-center hover:bg-[#2b2b2b] ${selected ? "bg-[#313131] rounded-sm hover:bg-[#2b2b2b]" : ""}`}
    >
      <ChangableAvatar
        size={32}
        src={url}
        fallbackTitle={title.charAt(0)}
        editable={false}
      />
      <p className="truncate text-[#dedede] text-xs font-normal">{title}</p>
    </Link>
  );
}
