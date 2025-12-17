"use client";
import HambergerIcon from "@/assets/icons/HambergerIcon";
import useHamburger from "@/hooks/useHamburger";
import LangaugeSelector from "@/widget/LangaugeSelector";
import { UserButton, useSession } from "@clerk/nextjs";
import { Icon } from "@iconify/react/dist/iconify.js";
import { Avatar } from "@mui/joy";
import React from "react";

export default function Navbar() {
  const sidebarState = useHamburger((state) => state.toggle);
  const {session} = useSession();
  return (
    <nav className="flex justify-between items-center gap-5 bg-[#1f1f1f] h-20 w-full px-4">
      <div className="flex items-center gap-5">
        <button onClick={sidebarState}>
          <HambergerIcon className="text-white text-2xl" />
        </button>

        <span className="text-white text-xl font-semibold">E-slip</span>
      </div>

      <UserButton/>
      <LangaugeSelector/>
    </nav>
  );
}
