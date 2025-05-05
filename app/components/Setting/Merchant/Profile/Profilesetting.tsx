import { Avatar, Input } from "@mui/joy";
import React from "react";

export default function Profilesetting() {
  return (
    <>
      <div className="flex flex-col w-full justify-center items-center gap-3">
        <div className="w-40 h-40">
          <Avatar variant="outlined" sx={{width:"100%",height:"100%"}}>H</Avatar>
        </div>
        <p className="font-semibold">Haris premium buffet</p>
        {/* <input defaultValue={"Haris premium buffet"} className="w-fit"/> */}
      </div>
    </>
  );
}
