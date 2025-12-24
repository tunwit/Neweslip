"use client";
import { Icon } from "@iconify/react/dist/iconify.js";
import { Button, FormControl, FormLabel } from "@mui/joy";
import React, { useRef, useState } from "react";
import dayjs from "dayjs";
import { Controller, useFormContext } from "react-hook-form";
import { z } from "zod";
import DatePickerLocalize from "@/widget/DatePickerLocalize";
import { InputForm } from "@/widget/InputForm";
import { ZodForm } from "@/lib/useZodForm";
import { createEmployeeFormSchema } from "@/types/formField";
import GenderSelector from "@/widget/GenderSelector";
import { GENDER } from "@/types/enum/enum";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import ChangableAvatar from "@/widget/ChangableAvatar";
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
  const router = useRouter();
  const t = useTranslations("employees");
  const tn = useTranslations("new_employees");

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
    router.back();
  };

  return (
    <>
      <FormControl>
        <div className="flex flex-col justify-center  items-center gap-2">
          <Controller
            control={control}
            name="avatar"
            render={({ field }) => (
              <ChangableAvatar
                editable
                size={100}
                src={field.value ? URL.createObjectURL(field.value) : undefined}
                onChange={(file) => field.onChange(file)}
                onRemove={() => field.onChange(undefined)}
              />
            )}
          />
          <p>Upload Photo</p>
        </div>
      </FormControl>
      <div className="grid grid-cols-4 gap-x-3 gap-y-5 mt-4 px-5">
        <div className="col-span-2">
          <InputForm
            control={control}
            name="firstName"
            label={t("fields.first_name")}
          />
        </div>

        <div className="col-span-2">
          <InputForm
            control={control}
            name="lastName"
            label={t("fields.last_name")}
          />
        </div>

        <div className="col-span-2">
          <InputForm
            control={control}
            name="nickName"
            label={t("fields.nickname")}
          />
        </div>

        <div className="col-span-1">
          <FormControl required>
            <FormLabel>
              {t("fields.gender")}
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
                  gender={field.value ? field.value : null}
                  onChange={(value) => field.onChange(value)}
                />
              )}
            />
          </FormControl>
        </div>

        <div className="col-span-1 ">
          <FormControl required>
            <FormLabel>
              {t("fields.date_of_birth")}
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
                  date={dayjs(field?.value)}
                  onChange={(newvalue) => field.onChange(newvalue!.toDate())}
                />
              )}
            />
          </FormControl>
        </div>

        <div className="col-span-2">
          <InputForm control={control} name="email" label={t("fields.email")} />
        </div>

        <div className="col-span-2">
          <InputForm
            control={control}
            name="phoneNumber"
            label={t("fields.phone_number")}
          />
        </div>
      </div>

      <div className="flex gap-3 flex-row-reverse mt-5">
        <Button onClick={() => handlerNext()} variant="soft">
          <p>{tn("action.next")}</p>
          <Icon className="text-lg" icon={"mingcute:right-line"} />
        </Button>
        <Button onClick={() => handlerBack()} variant="outlined">
          <p>{tn("action.previous")}</p>
        </Button>
      </div>
    </>
  );
}
