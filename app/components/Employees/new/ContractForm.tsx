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
import React, { Suspense, useEffect } from "react";
import { log } from "util";
import BankSelector from "./BankSelector";
import BranchSelector from "./BranchSelector";
import { useSnackbar } from "@/hooks/useSnackBar";
import { createEmployee } from "@/lib/api/createEmployee";
import { Controller, useFormContext } from "react-hook-form";
import { z } from "zod";
import { contractSchema } from "@/schemas/createEmployeeForm/contractForm";

interface ContractFormProps {
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
}

export default function ContractForm({ setCurrentPage }: ContractFormProps) {
  type FormField = z.infer<typeof contractSchema>;
  const {
    register,
    control,
    formState: { errors, isSubmitting, isSubmitSuccessful },
  } = useFormContext<FormField>();

  const handlerPrevious = (
    e: React.MouseEvent<HTMLAnchorElement, MouseEvent>,
  ) => {
    e.preventDefault();
    setCurrentPage(1);
  };

  useEffect(() => {
    console.log(isSubmitting);
  }, [isSubmitting]);
  return (
    <>
      <div className="grid grid-cols-4 gap-x-3 gap-y-5 mt-4 px-5">
        <div className="col-span-2">
          <FormControl required>
            <FormLabel>
              Base salary
              {errors.salary && (
                <p className="text-xs ml-2 font-normal text-red-900 italic">
                  {errors.salary.message}
                </p>
              )}
            </FormLabel>
            <Input
              type="number"
              sx={{ "--Input-focusedThickness": 0 }}
              size="md"
              placeholder="salary"
              {...register("salary", { valueAsNumber: true })}
            />
          </FormControl>
        </div>

        <div className="col-span-2">
          <FormControl required>
            <FormLabel>
              Position
              {errors.position && (
                <p className="text-xs ml-2 font-normal text-red-900 italic">
                  {errors.position.message}
                </p>
              )}
            </FormLabel>
            <Input
              type="text"
              sx={{ "--Input-focusedThickness": 0 }}
              size="md"
              placeholder="position"
              {...register("position")}
            />
          </FormControl>
        </div>

        <div className="col-span-1 ">
          <FormControl required>
            <FormLabel>
              Date of Employment
              {errors.dateEmploy && (
                <p className="text-xs ml-2 font-normal text-red-900 italic">
                  {errors.dateEmploy.message}
                </p>
              )}
            </FormLabel>
            <Controller
              control={control}
              name="dateEmploy"
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

        <div className="col-span-1 ">
          <FormControl required>
            <FormLabel>
              Bank
              {errors.bankName && (
                <p className="text-xs ml-2 font-normal text-red-900 italic">
                  {errors.bankName.message}
                </p>
              )}
            </FormLabel>
            <Controller
              control={control}
              name="bankName"
              render={({ field }) => <BankSelector onChange={field.onChange} />}
            />
          </FormControl>
        </div>

        <div className="col-span-2">
          <FormControl required>
            <FormLabel>
              Bank Account
              {errors.bankAccountNumber && (
                <p className="text-xs ml-2 font-normal text-red-900 italic">
                  {errors.bankAccountNumber.message}
                </p>
              )}
            </FormLabel>
            <Input
              type="text"
              sx={{ "--Input-focusedThickness": 0 }}
              size="md"
              placeholder="Bank Account"
              {...register("bankAccountNumber")}
            />
          </FormControl>
        </div>
        <div className="col-span-2">
          <FormControl required>
            <FormLabel>
              Account Owner
              {errors.bankAccountOwner && (
                <p className="text-xs ml-2 font-normal text-red-900 italic">
                  {errors.bankAccountOwner.message}
                </p>
              )}
            </FormLabel>
            <Input
              type="text"
              sx={{ "--Input-focusedThickness": 0 }}
              size="md"
              placeholder="Account Owner"
              {...register("bankAccountOwner")}
            />
          </FormControl>
        </div>

        <div className="col-span-2">
          <FormControl>
            <FormLabel>
              Promtpay (Phone ,ID)
              {errors.promtpay && (
                <p className="text-xs ml-2 font-normal text-red-900 italic">
                  {errors.promtpay.message}
                </p>
              )}
            </FormLabel>
            <Input
              type="text"
              sx={{ "--Input-focusedThickness": 0 }}
              size="md"
              placeholder="promtpay"
              {...register("promtpay")}
            />
          </FormControl>
        </div>
        <div className="col-span-2">
          <FormControl required>
            <FormLabel>
              Branch{" "}
              {errors.branchId && (
                <p className="text-xs ml-2 font-normal text-red-900 italic">
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
                    value={field.value}
                    onChange={field.onChange}
                  />
                </Suspense>
              )}
            />
          </FormControl>
        </div>
        <div className="col-span-2">
          <FormControl required>
            <FormLabel>
              Status
              {errors.status && (
                <p className="text-xs ml-2 font-normal text-red-900 italic">
                  {errors.status.message}
                </p>
              )}
            </FormLabel>
            <Controller
              control={control}
              name="status"
              defaultValue="ACTIVE"
              render={({ field }) => (
                <Select
                  defaultValue={"ACTIVE"}
                  value={field.value}
                  onChange={(e, newvalue) => field.onChange(newvalue!)}
                >
                  <Option value="ACTIVE">Active</Option>
                  <Option value="PARTTIME">Part time</Option>
                  <Option value="INACTIVE">Inactive</Option>
                </Select>
              )}
            />
          </FormControl>
        </div>
      </div>

      <div className="flex justify-end items-center mt-2 gap-3 mr-5">
        <Button onClick={(e) => handlerPrevious(e)} variant="outlined">
          <Icon className="text-lg" icon={"mingcute:left-line"} />
          <p>Previous</p>
        </Button>
        <Button
          type="submit"
          variant="solid"
          loading={isSubmitting}
          loadingPosition="start"
          disabled={isSubmitting || isSubmitSuccessful}
        >
          <p>Save</p>
          <Icon className="text-lg" icon={"mingcute:right-line"} />
        </Button>
      </div>
    </>
  );
}
