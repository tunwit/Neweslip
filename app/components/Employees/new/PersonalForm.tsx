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
import DatePickerLocalize from "@/widget/DatePickerLocalize";
import { InputForm } from "@/widget/InputForm";
import { ZodControl, ZodForm } from "@/lib/useZodForm";
import { createEmployeeFormSchema } from "@/types/formField";
import GenderSelector from "@/widget/GenderSelector";
import { GENDER } from "@/types/enum/enum";
import { useRouter } from "next/navigation";
interface PersonalFormProps {
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
}

export default function PersonalForm({ setCurrentPage }: PersonalFormProps) {
  const {
    register,
    control,
    trigger,
    formState: { errors },
  } = useFormContext<z.infer<typeof createEmployeeFormSchema>>() as ZodForm<
    typeof createEmployeeFormSchema
  >;
  const fileRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | undefined>();
  const router = useRouter();

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
      setCurrentPage(1);
    }
  };

   const handlerBack = async () => {
      router.back()
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
          <InputForm control={control} name="firstName" label="First name" />
        </div>

        <div className="col-span-2">
          <InputForm control={control} name="lastName" label="Last name" />
        </div>

        <div className="col-span-2">
          <InputForm control={control} name="nickName" label="Nick name" />
        </div>

        <div className="col-span-1">
          <FormControl required>
            <FormLabel>
              Gender
              {errors.gender && (
                <p className="text-xs ml-2 font-normal text-red-500 italic">
                  {errors.gender.message}
                </p>
              )}
            </FormLabel>
            <Controller
              control={control}
              name="gender"
              defaultValue={GENDER.MALE}
              render={({ field }) => (
                <GenderSelector
                  gender={field.value}
                  onChange={(value) => field.onChange(value)}
                />
              )}
            />
          </FormControl>
        </div>

        <div className="col-span-1 ">
          <FormControl required>
            <FormLabel>
              Date of Birth
              {errors.dateOfBirth && (
                <p className="text-xs ml-2 font-normal text-red-500 italic">
                  {errors.dateOfBirth.message}
                </p>
              )}
            </FormLabel>
            <Controller
              control={control}
              name="dateOfBirth"
              render={({ field }) => (
                <DatePickerLocalize
                  onChange={(newvalue) => field.onChange(newvalue!.toDate())}
                />
              )}
            />
          </FormControl>
        </div>

        <div className="col-span-2">
          <InputForm control={control} name="email" label="Email" />
        </div>

        <div className="col-span-2">
          <InputForm
            control={control}
            name="phoneNumber"
            label="Phone Number"
          />
        </div>
      </div>

      <div className="flex gap-3 flex-row-reverse mt-5">
        <Button onClick={() => handlerNext()} variant="soft">
          <p>Next</p>
          <Icon className="text-lg" icon={"mingcute:right-line"} />
        </Button>
        <Button onClick={() => handlerBack()} variant="outlined">
          <p>Back</p>
        </Button>
      </div>
    </>
  );
}
