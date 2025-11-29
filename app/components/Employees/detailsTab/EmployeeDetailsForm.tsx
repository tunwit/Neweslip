"use client";
import { FormControl, FormLabel } from "@mui/joy";
import React, { Suspense } from "react";
import BranchSelector from "../../../../widget/BranchSelector";
import { EmployeeWithShop } from "@/types/employee";
import {
  Controller,
  FormProvider,
  useForm,
  useFormContext,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  createEmployeeFormField,
  createEmployeeFormSchema,
} from "@/types/formField";
import GenderSelector from "@/widget/GenderSelector";
import normalizeNull from "@/utils/normallizeNull";
import { DatePicker } from "@mui/x-date-pickers";
import DatePickerLocalize from "@/widget/DatePickerLocalize";
import dayjs, { Dayjs } from "dayjs";
import BankSelector from "@/widget/BankSelector";
import { useZodForm, ZodForm } from "@/lib/useZodForm";
import { InputForm } from "@/widget/InputForm";
import { z } from "zod";

export default function EmployeeDetailsForm({
  employee,
}: {
  employee: EmployeeWithShop;
}) {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useFormContext<z.infer<typeof createEmployeeFormSchema>>() as ZodForm<
    typeof createEmployeeFormSchema
  >;

  const onSubmit = (data: createEmployeeFormField) => {
    console.log(data);
  };

  return (
    <>
      <form
        onSubmit={(e) => {
          handleSubmit(onSubmit)(e);
        }}
      >
        <div className="flex flex-col gap-3 ">
          <div className="bg-white rounded-md border border-gray-300 py-4 px-4">
            <p className="font-semibold mb-2">Personal Infomation</p>
            <div className="grid grid-cols-2 gap-y-4 gap-x-3">
              <InputForm control={control} name="position" label="Position" />
              <InputForm control={control} name="email" label="Email" />
              <InputForm
                control={control}
                name="firstName"
                label="First Name"
              />
              <InputForm control={control} name="lastName" label="Last Name" />
              <InputForm control={control} name="nickName" label="Nick Name" />
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
                  render={({ field }) => (
                    <Suspense>
                      <GenderSelector
                        gender={field.value}
                        onChange={field.onChange}
                      />
                    </Suspense>
                  )}
                />
              </FormControl>
              <InputForm
                control={control}
                name="phoneNumber"
                label="Phone Number"
              />
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
                      date={dayjs(field.value)}
                      onChange={(newvalue) =>
                        field.onChange(newvalue!.toDate())
                      }
                    />
                  )}
                />
              </FormControl>
            </div>
          </div>

          <div className="bg-white rounded-md border border-gray-300 py-4 px-4">
            <p className="font-semibold mb-2">Address</p>
            <div className="grid grid-cols-2 gap-y-4 gap-x-3">
              <InputForm
                control={control}
                name="address1"
                label="Address Line 1"
              />
              <InputForm
                control={control}
                name="address2"
                label="Address Line 2"
              />
              <InputForm
                control={control}
                name="address3"
                label="Address Line 3"
              />
            </div>
          </div>

          <div className="bg-white rounded-md border border-gray-300 py-4 px-4">
            <p className="font-semibold mb-2">Job Information</p>
            <div className="grid grid-cols-2 gap-y-4 gap-x-3">
              <InputForm
                control={control}
                name="salary"
                label="Base Salary"
                type="number"
              />
              <FormControl required>
                <FormLabel>
                  Date of Employ
                  {errors.dateEmploy && (
                    <p className="text-xs ml-2 font-normal text-red-500 italic">
                      {errors.dateEmploy.message}
                    </p>
                  )}
                </FormLabel>
                <Controller
                  control={control}
                  name="dateEmploy"
                  render={({ field }) => (
                    <DatePickerLocalize
                      date={dayjs(field.value)}
                      onChange={(newvalue) =>
                        field.onChange(newvalue!.toDate())
                      }
                    />
                  )}
                />
              </FormControl>
              <FormControl required>
                <FormLabel>
                  Branch{" "}
                  {errors.branchId && (
                    <p className="text-xs ml-2 font-normal text-red-500 italic">
                      {errors.branchId.message}
                    </p>
                  )}
                </FormLabel>
                <Controller
                  control={control}
                  name="branchId"
                  render={({ field }) => (
                    <Suspense>
                      <BranchSelector
                        branchId={field.value}
                        onChange={field.onChange}
                      />
                    </Suspense>
                  )}
                />
              </FormControl>
              <FormControl required>
                <FormLabel>
                  Bank Name
                  {errors.bankName && (
                    <p className="text-xs ml-2 font-normal text-red-500 italic">
                      {errors.bankName.message}
                    </p>
                  )}
                </FormLabel>
                <Controller
                  control={control}
                  name="bankName"
                  render={({ field }) => (
                    <BankSelector
                      bank={field.value}
                      onChange={field.onChange}
                    />
                  )}
                />
              </FormControl>
              <InputForm
                control={control}
                name="bankAccountNumber"
                label="Bank Account"
              />
              <InputForm
                control={control}
                name="bankAccountOwner"
                label="Bank Account Owner"
              />
              <InputForm control={control} name="promtpay" label="Promtpay" />
            </div>
          </div>
        </div>
      </form>
    </>
  );
}
