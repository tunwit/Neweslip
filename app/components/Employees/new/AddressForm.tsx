import { addressSchema } from "@/schemas/createEmployeeForm/addressForm";
import { createEmployeeFormSchema } from "@/types/formField";
import { InputForm } from "@/widget/InputForm";
import { Icon } from "@iconify/react/dist/iconify.js";
import {
  Button,
  FormControl,
  FormLabel,
  Input,
  Option,
  Select,
} from "@mui/joy";
import React from "react";
import { useFormContext } from "react-hook-form";
import { z } from "zod";
interface AddressFormProps {
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
}

export default function AddressForm({ setCurrentPage }: AddressFormProps) {
  const { register, trigger ,control } = useFormContext<z.infer<typeof createEmployeeFormSchema>>() as ZodForm<typeof createEmployeeFormSchema>;
  const handlerNext = async () => {
    const valid = await trigger([
      "address1",
      "address2",
      "address3",
    ]);
    if (valid) {
      setCurrentPage(2);
    }
  };

  const handlerPrevious = (
    e: React.MouseEvent<HTMLAnchorElement, MouseEvent>,
  ) => {
    e.preventDefault();
    setCurrentPage(0);
  };

  return (
    <>
      <div className="grid grid-cols-4 gap-x-3 gap-y-5 mt-4 px-5">
        <div className="col-span-4">
          <InputForm
            control={control}
            name="address1"
            label="Address Line 1"
            />
        </div>

        <div className="col-span-4">
          <InputForm
            control={control}
            name="address2"
            label="Address Line 2"
            />
        </div>

        <div className="col-span-4">
          <InputForm
            control={control}
            name="address3"
            label="Address Line 3"
            />
        </div>
      </div>

      <div className="flex justify-end items-center mt-5 gap-3 mr-5">
        <Button onClick={(e) => handlerPrevious(e)} variant="outlined">
          <Icon className="text-lg" icon={"mingcute:left-line"} />
          <p>Previous</p>
        </Button>
        <Button onClick={() => handlerNext()} variant="soft">
          <p>Next</p>
          <Icon className="text-lg" icon={"mingcute:right-line"} />
        </Button>
      </div>
    </>
  );
}
