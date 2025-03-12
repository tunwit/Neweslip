import React from "react";
import ShopSidebarElement from "./ShopSidebarElement";

const shops = [{ title: "Haris premium buffet" }, { title: "ตุ๊กแก" }];
export default function ShopSidebar() {
  return (
    <>
      <div className='flex flex-col h-screen bg-[#f2f6fc] text-black min-h-screen w-[5%] min-w-15 items-center gap-5 border-r border-[#d4d4d4] sticky top-0 left-0"'>
        <div className="text-xs text-[#797979] font-bold mt-10">
          <p>logo</p>
        </div>
        {shops.map((v, i) => {
          return <ShopSidebarElement key={i} title={v.title} />;
        })}
      </div>
    </>
  );
}
