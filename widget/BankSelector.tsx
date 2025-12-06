import {
  Autocomplete,
  AutocompleteOption,
  ListItemContent,
  ListItemDecorator,
} from "@mui/joy";
import Image from "next/image";
import React from "react";

const banks = [
  { label: "กรุงเทพ", code: "bb" },
  { label: "กรุงไทย", code: "kt" },
  { label: "กรุงศรีอยุธยา", code: "ks" },
  { label: "กสิกรไทย", code: "kb" },
  { label: "ซีไอเอ็มบี ไทย", code: "cimb" },
  { label: "ทหารไทยธนชาต", code: "ttb" },
  { label: "ทิสโก้", code: "tc" },
  { label: "ไทยเครดิต", code: "tcd" },
  { label: "ไทยพาณิชย์", code: "scb" },
  { label: "ยูโอบี", code: "uob" },
  { label: "ไอซีบีซี (ไทย)", code: "icbc" },
  { label: "ออมสิน", code: "gsb" },

];

interface BankSelectorProps {
  bank?:string
  onChange: (newValue: string) => void;
  disable?:boolean
}

export default function BankSelector({ bank,onChange,disable=false }: BankSelectorProps) {
  const selectedBank = banks.find((b) => b.label === bank) ?? null;
  return (
    <Autocomplete
    disabled={disable}
      value={selectedBank}
      options={banks}
      freeSolo={true}

      onChange={(_, newValue) => {
        if (typeof newValue === "string") {
          onChange(newValue); 
        } else if (newValue && "label" in newValue) {
          onChange(newValue.label); 
        } else {
          onChange(""); // cleared
        }
      }}
      sx={{ "--Input-focusedThickness": 0 }}
      startDecorator={
        selectedBank ?
        <Image
              unoptimized={true}
              loading="lazy"
              width="20"
              height="20"
              src={`/bankIcons/${selectedBank?.code}.png`}
              alt="bank logo"
            />
            :<></>
      }
      renderOption={(props, bank) => (
        <AutocompleteOption {...props}>
          <ListItemDecorator>
            <Image
              unoptimized={true}
              loading="lazy"
              width="20"
              height="20"
              src={`/bankIcons/${bank.code}.png`}
              alt="bank logo"
            />
          </ListItemDecorator>
          <ListItemContent sx={{ fontSize: "sm" }}>
            {bank.label}
          </ListItemContent>
        </AutocompleteOption>
      )}
    />
  );
}
