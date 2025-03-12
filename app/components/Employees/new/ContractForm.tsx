"use client";
import { Icon } from "@iconify/react/dist/iconify.js";
import {
  Button,
  FormControl,
  FormLabel,
  Input,
  Option,
  Select,
} from "@mui/joy";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { usePathname, useRouter } from "next/navigation";
import React from "react";
import { log } from "util";
import BankSelector from "./BankSelector";

interface ContractFormProps {
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
}

export default function ContractForm({ setCurrentPage }: ContractFormProps) {
  const rounter = useRouter();
  const pathname = usePathname().split("/");
  const page = pathname[2];
  const shop = pathname[1];
  const handlerSave = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("hi");

    rounter.push(`/${shop}/${page}`);
  };

  const handlerPrevious = (
    e: React.MouseEvent<HTMLAnchorElement, MouseEvent>,
  ) => {
    e.preventDefault();
    setCurrentPage(1);
  };
  return (
    <>
      <form onSubmit={(e) => handlerSave(e)}>
        <div className="grid grid-cols-4 gap-x-3 gap-y-5 mt-4 px-5">
          <div className="col-span-2">
            <FormControl required>
              <FormLabel>Base salary</FormLabel>
              <Input
                type="number"
                sx={{ "--Input-focusedThickness": 0 }}
                size="md"
                placeholder="salary"
              />
            </FormControl>
          </div>

          <div className="col-span-2">
            <FormControl required>
              <FormLabel>Position</FormLabel>
              <Input
                type="text"
                sx={{ "--Input-focusedThickness": 0 }}
                size="md"
                placeholder="position"
              />
            </FormControl>
          </div>

          <div className="col-span-1 ">
            <FormControl required>
              <FormLabel>Dath Employ</FormLabel>
              <LocalizationProvider
                dateAdapter={AdapterDayjs}
                adapterLocale="th"
              >
                <DatePicker
                  slotProps={{
                    textField: {
                      sx: {
                        "& .MuiInputBase-root": {
                          height: "36px",
                          borderRadius: 1.5,
                        }, // Adjust input height
                      },
                    },
                  }}
                />
              </LocalizationProvider>
            </FormControl>
          </div>

          <div className="col-span-1 ">
            <FormControl required>
              <FormLabel>Bank</FormLabel>
              <BankSelector />
            </FormControl>
          </div>

          <div className="col-span-2">
            <FormControl required>
              <FormLabel>ฺBank Account</FormLabel>
              <Input
                type="text"
                sx={{ "--Input-focusedThickness": 0 }}
                size="md"
                placeholder="ฺBank Account"
              />
            </FormControl>
          </div>
          <div className="col-span-2">
            <FormControl required>
              <FormLabel>Account Owner</FormLabel>
              <Input
                type="text"
                sx={{ "--Input-focusedThickness": 0 }}
                size="md"
                placeholder="account Owner"
              />
            </FormControl>
          </div>

          <div className="col-span-2">
            <FormControl required>
              <FormLabel>Promtpay (Phone ,ID)</FormLabel>
              <Input
                type="text"
                sx={{ "--Input-focusedThickness": 0 }}
                size="md"
                placeholder="promtpay"
              />
            </FormControl>
          </div>
        </div>

        <div className="flex justify-end items-center mt-2 gap-3 mr-5">
          <Button onClick={(e) => handlerPrevious(e)} variant="outlined">
            <Icon className="text-lg" icon={"mingcute:left-line"} />
            <p>Previous</p>
          </Button>
          <Button type="submit" variant="solid">
            <p>Save</p>
            <Icon className="text-lg" icon={"mingcute:right-line"} />
          </Button>
        </div>
      </form>
    </>
  );
}
