import { Autocomplete, Option, Select } from "@mui/joy";
import React from "react";

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
export default function BankSelector() {
  return (
    <>
      <Autocomplete
        sx={{ "--Input-focusedThickness": 0 }}
        options={bank}
        defaultValue={"ไทยพาณิชย์"}
      ></Autocomplete>
    </>
  );
}
