"use client";
import useHamburger from "@/hooks/useHamburger";
import { Icon } from "@iconify/react/dist/iconify.js";
import { Avatar } from "@mui/joy";
import { useSession } from "next-auth/react";
import React from "react";

export default function Navbar() {
  const sidebarState = useHamburger((state) => state.toggle);
  const seesion = useSession();
  return (
    <nav className="flex justify-between items-center gap-5 bg-[#1f1f1f] h-20 w-full px-4">
      <div className="flex items-center gap-5">
        <button onClick={sidebarState}>
          <Icon
            icon={"material-symbols:menu-rounded"}
            className="text-white text-2xl"
          />
        </button>

        <span className="text-white text-xl font-semibold">E-slip</span>
      </div>

      <Avatar src={seesion.data?.user?.image!} />
    </nav>
  );
}
