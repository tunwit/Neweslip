import { Icon } from "@iconify/react/dist/iconify.js";
import { signOut } from "next-auth/react";
import React from "react";

export default function SignOutButton() {
  return (
    <button
      className="text-red-900 flex flex-row items-center gap-2 justify-center"
      onClick={() => signOut()}
    >
      <p className="font-black">Sign Out</p>
      <Icon icon={"material-symbols:logout"} />
    </button>
  );
}
