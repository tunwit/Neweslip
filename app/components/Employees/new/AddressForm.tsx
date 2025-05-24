import { addressSchema } from "@/schemas/createEmployeeForm/addressForm";
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
import React from "react";
import { useFormContext } from "react-hook-form";
import { z } from "zod";
interface AddressFormProps {
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
}

export default function AddressForm({ setCurrentPage }: AddressFormProps) {
  type FormField = z.infer<typeof addressSchema>;
  const { register, trigger } = useFormContext<FormField>();
  const handlerNext = async () => {
    const valid = await trigger([
      "addressLine1",
      "addressLine2",
      "addressLine3",
    ]);
    if (valid) {
      console.log(valid);
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
        <div className="col-span-1">
          <FormControl required>
            <FormLabel>addressLine 1</FormLabel>
            <Input
              type="text"
              sx={{ "--Input-focusedThickness": 0 }}
              size="md"
              placeholder="addressLine 1"
              {...register("addressLine1")}
            />
          </FormControl>
        </div>

        <div className="col-span-1">
          <FormControl required>
            <FormLabel>addressLine 2</FormLabel>
            <Input
              type="text"
              sx={{ "--Input-focusedThickness": 0 }}
              size="md"
              placeholder="addressLine 2"
              {...register("addressLine2")}
            />
          </FormControl>
        </div>

        <div className="col-span-1">
          <FormControl required>
            <FormLabel>addressLine 3</FormLabel>
            <Input
              type="text"
              sx={{ "--Input-focusedThickness": 0 }}
              size="md"
              placeholder="addressLine 3"
              {...register("addressLine3")}
            />
          </FormControl>
        </div>
      </div>

      <div className="flex justify-end items-center mt-2 gap-3 mr-5">
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
