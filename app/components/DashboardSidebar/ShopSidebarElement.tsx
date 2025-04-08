import Link from "next/link";
import React from "react";

interface ShopSidebarElementProps {
  title: string;
}
export default function ShopSidebarElement({ title }: ShopSidebarElementProps) {
  return (
    <Link href={"#"} className="flex gap-3 items-center py-1">
      <div className="bg-amber-400   aspect-square w-8 h-8 text-center rounded-full flex items-center justify-center">
        {title.charAt(0)}
      </div>
      <p className="truncate text-[#dedede] text-xs">{title}</p>
    </Link>
  );
}
