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
import React, { useEffect, useRef, useState } from "react";
import { Dayjs } from "dayjs";
import { Controller, useFormContext } from "react-hook-form";
import { personalSchema } from "@/schemas/createEmployeeForm/personalForm";
import { z } from "zod";
interface PersonalFormProps {
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
}

export default function PersonalForm({ setCurrentPage }: PersonalFormProps) {
  type FormField = z.infer<typeof personalSchema>;
  const {
    register,
    control,
    trigger,
    formState: { errors },
  } = useFormContext<FormField>();
  const fileRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | undefined>();
  const handlerNext = async () => {
    const valid = await trigger([
      "firstName",
      "lastName",
      "nickName",
      "gender",
      "dateOfBirth",
      "email",
      "phoneNumber",
    ]);
    if (valid) {
      console.log(valid);
      setCurrentPage(1);
    }
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
      <FormControl>
        <input type="file" ref={fileRef} accept="image/*" />
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
            <FormLabel>
              First name
              {errors.firstName && (
                <p className="text-xs ml-2 font-normal text-red-900 italic">
                  {errors.firstName.message}
                </p>
              )}
            </FormLabel>

            <Input
              type="text"
              sx={{ "--Input-focusedThickness": 0 }}
              size="md"
              placeholder="first name"
              {...register("firstName")}
            />
          </FormControl>
        </div>

        <div className="col-span-2">
          <FormControl required>
            <FormLabel>
              Last name{" "}
              {errors.lastName && (
                <p className="text-xs ml-2 font-normal text-red-900 italic">
                  {errors.lastName.message}
                </p>
              )}
            </FormLabel>

            <Input
              type="text"
              sx={{ "--Input-focusedThickness": 0 }}
              size="md"
              placeholder="last name"
              {...register("lastName")}
            />
          </FormControl>
        </div>

        <div className="col-span-2">
          <FormControl required>
            <FormLabel>
              Nick name
              {errors.nickName && (
                <p className="text-xs ml-2 font-normal text-red-900 italic">
                  {errors.nickName.message}
                </p>
              )}
            </FormLabel>
            <Input
              type="text"
              sx={{ "--Input-focusedThickness": 0 }}
              size="md"
              placeholder="nickname"
              {...register("nickName")}
            />
          </FormControl>
        </div>

        <div className="col-span-1">
          <FormControl required>
            <FormLabel>
              Gender
              {errors.gender && (
                <p className="text-xs ml-2 font-normal text-red-900 italic">
                  {errors.gender.message}
                </p>
              )}
            </FormLabel>
            <Controller
              control={control}
              name="gender"
              defaultValue="male"
              render={({ field }) => (
                <Select
                  {...field}
                  value={field.value}
                  onChange={(_, value) => field.onChange(value)} // MUI Joy gives value in second param
                >
                  <Option value="male">Male</Option>
                  <Option value="female">Female</Option>
                  <Option value="others">Others</Option>
                </Select>
              )}
            />
          </FormControl>
        </div>

        <div className="col-span-1 ">
          <FormControl required>
            <FormLabel>
              Date of Birth
              {errors.dateOfBirth && (
                <p className="text-xs ml-2 font-normal text-red-900 italic">
                  {errors.dateOfBirth.message}
                </p>
              )}
            </FormLabel>
            <Controller
              control={control}
              name="dateOfBirth"
              render={({ field }) => (
                <LocalizationProvider
                  dateAdapter={AdapterDayjs}
                  adapterLocale="th"
                >
                  <DatePicker
                    onChange={(newvalue) => field.onChange(newvalue!.toDate())}
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
              )}
            />
          </FormControl>
        </div>

        <div className="col-span-2">
          <FormControl required>
            <FormLabel>
              Email
              {errors.email && (
                <p className="text-xs ml-2 font-normal text-red-900 italic">
                  {errors.email.message}
                </p>
              )}
            </FormLabel>
            <Input
              type="email"
              sx={{ "--Input-focusedThickness": 0 }}
              size="md"
              placeholder="email"
              {...register("email")}
            />
          </FormControl>
        </div>

        <div className="col-span-2">
          <FormControl required>
            <FormLabel>
              Phone
              {errors.phoneNumber && (
                <p className="text-xs ml-2 font-normal text-red-900 italic">
                  {errors.phoneNumber.message}
                </p>
              )}
            </FormLabel>
            <Input
              type="tel"
              sx={{ "--Input-focusedThickness": 0 }}
              size="md"
              placeholder="phone number"
              {...register("phoneNumber")}
            />
          </FormControl>
        </div>
      </div>

      <div className=" text-right mr-5 mt-2">
        <Button onClick={() => handlerNext()} variant="soft">
          <p>Next</p>
          <Icon className="text-lg" icon={"mingcute:right-line"} />
        </Button>
      </div>
    </>
  );
}
