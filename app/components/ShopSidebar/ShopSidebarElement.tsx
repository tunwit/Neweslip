import Link from "next/link";
import React from "react";

interface ShopSidebarElementProps {
    title:string;
}
export default function ShopSidebarElement({title}:ShopSidebarElementProps) {
  return (
    <Link href={'#'} className="flex justify-center items-center">
      <div className="bg-teal-400 w-9 h-9 text-center rounded-full flex items-center justify-center">
        {title.charAt(0)}
      </div>
    </Link>
  );
}
