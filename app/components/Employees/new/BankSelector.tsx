import { Autocomplete, Option, Select } from "@mui/joy";
import React from "react";
import { ControllerRenderProps } from "react-hook-form";

const bank = [
  "กรุงเทพ",
  "กรุงไทย",
  "กรุงศรีอยุธยา",
  "กสิกรไทย",
  "เกียรตินาคินภัทร",
  "ซีไอเอ็มบี ไทย",
  "ทหารไทยธนชาต",
  "ทิสโก้",
  "ไทยเครดิต",
  "ไทยพาณิชย์",
  "ยูโอบี",
  "แลนด์ แอนด์ เฮ้าส์",
  "สแตนดาร์ดชาร์เตอร์ด (ไทย)",
  "ไอซีบีซี (ไทย)",
  "ธนาคารแห่งประเทศจีน (ไทย)",
];

interface BankSelectorProps {
  onChange: (newvalue: string) => void;
}
export default function BankSelector({ onChange }: BankSelectorProps) {
  return (
    <>
      <Autocomplete
        onChange={(e, newValue) => onChange(newValue ?? "")}
        sx={{ "--Input-focusedThickness": 0 }}
        options={bank}
      ></Autocomplete>
    </>
  );
}
