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
import React, { useRef, useState } from "react";

interface PersonalFormProps {
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
}

export default function PersonalForm({ setCurrentPage }: PersonalFormProps) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | undefined>();
  const handlerNext = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setCurrentPage(1);
  };
  const handleClick = () => {
    fileRef.current?.click();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <>
      <form onSubmit={(e) => handlerNext(e)}>
        <FormControl>
          <input
            type="file"
            ref={fileRef}
            accept="image/*"
            style={{ display: "none" }}
            onChange={(e) => handleChange(e)}
          />
          <div className="flex flex-col justify-center  items-center gap-2">
            <div onClick={() => handleClick()} className="cursor-pointer">
              {preview ? (
                <img
                  src={preview}
                  alt="Profile"
                  className="w-20 h-20 rounded-full object-cover shadow"
                />
              ) : (
                <div className="w-20 h-20 aspect-square bg-gray-100 rounded-full border border-2 border-dashed flex items-center justify-center">
                  <Icon icon={"solar:user-bold"} className="text-3xl" />
                </div>
              )}
            </div>

            <p>Upload Photo</p>
          </div>
        </FormControl>
        <div className="grid grid-cols-4 gap-x-3 gap-y-5 mt-4 px-5">
          <div className="col-span-2">
            <FormControl required>
              <FormLabel>First name</FormLabel>
              <Input
                type="text"
                sx={{ "--Input-focusedThickness": 0 }}
                size="md"
                placeholder="first name"
              />
            </FormControl>
          </div>

          <div className="col-span-2">
            <FormControl required>
              <FormLabel>Last name</FormLabel>
              <Input
                type="text"
                sx={{ "--Input-focusedThickness": 0 }}
                size="md"
                placeholder="last name"
              />
            </FormControl>
          </div>

          <div className="col-span-2">
            <FormControl required>
              <FormLabel>Nick name</FormLabel>
              <Input
                type="text"
                sx={{ "--Input-focusedThickness": 0 }}
                size="md"
                placeholder="nickname "
              />
            </FormControl>
          </div>

          <div className="col-span-1">
            <FormControl required>
              <FormLabel>Gender</FormLabel>
              <Select defaultValue={"male"}>
                <Option value="male">Male</Option>
                <Option value="female">Female</Option>
                <Option value="others">Others</Option>
              </Select>
            </FormControl>
          </div>

          <div className="col-span-1 ">
            <FormControl required>
              <FormLabel>Dath of Birth</FormLabel>
              <Input
                type="date"
                sx={{ "--Input-focusedThickness": 0 }}
                size="md"
                placeholder="nickname "
              />
              {/* <LocalizationProvider
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
              </LocalizationProvider> */}
            </FormControl>
          </div>

          <div className="col-span-2">
            <FormControl required>
              <FormLabel>Email</FormLabel>
              <Input
                type="email"
                sx={{ "--Input-focusedThickness": 0 }}
                size="md"
                placeholder="email "
              />
            </FormControl>
          </div>

          <div className="col-span-2">
            <FormControl required>
              <FormLabel>Phone</FormLabel>
              <Input
                type="tel"
                sx={{ "--Input-focusedThickness": 0 }}
                size="md"
                placeholder="phone number "
              />
            </FormControl>
          </div>
        </div>

        <div className=" text-right mr-5 mt-2">
          <Button type="submit" variant="soft">
            <p>Next</p>
            <Icon className="text-lg" icon={"mingcute:right-line"} />
          </Button>
        </div>
      </form>
    </>
  );
}
