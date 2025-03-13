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

interface AddressFormProps {
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
}

export default function AddressForm({ setCurrentPage }: AddressFormProps) {
  const handlerNext = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setCurrentPage(2);
  };

  const handlerPrevious = (
    e: React.MouseEvent<HTMLAnchorElement, MouseEvent>,
  ) => {
    e.preventDefault();
    setCurrentPage(0);
  };
  return (
    <>
      <form onSubmit={(e) => handlerNext(e)}>
        <div className="grid grid-cols-4 gap-x-3 gap-y-5 mt-4 px-5">
          <div className="col-span-1">
            <FormControl required>
              <FormLabel>House Number</FormLabel>
              <Input
                type="text"
                sx={{ "--Input-focusedThickness": 0 }}
                size="md"
                placeholder="house number"
              />
            </FormControl>
          </div>

          <div className="col-span-2">
            <FormControl required>
              <FormLabel>Village</FormLabel>

              <Input
                type="text"
                sx={{ "--Input-focusedThickness": 0 }}
                size="md"
                placeholder="village"
              />
            </FormControl>
          </div>

          <div className="col-span-1">
            <FormControl required>
              <FormLabel>Sub Distract (Tambon)</FormLabel>

              <Input
                type="text"
                sx={{ "--Input-focusedThickness": 0 }}
                size="md"
                placeholder="sub distract"
              />
            </FormControl>
          </div>

          <div className="col-span-1">
            <FormControl required>
              <FormLabel>Distract (Amphoe)</FormLabel>
              <Input
                type="text"
                sx={{ "--Input-focusedThickness": 0 }}
                size="md"
                placeholder="distract"
              />
            </FormControl>
          </div>

          <div className="col-span-1">
            <FormControl required>
              <FormLabel>Province</FormLabel>
              <Input
                type="text"
                sx={{ "--Input-focusedThickness": 0 }}
                size="md"
                placeholder="province"
              />
            </FormControl>
          </div>

          <div className="col-span-1">
            <FormControl required>
              <FormLabel>Zipcode</FormLabel>
              <Input
                type="text"
                sx={{ "--Input-focusedThickness": 0 }}
                size="md"
                placeholder="zipcode"
              />
            </FormControl>
          </div>
        </div>

        <div className="flex justify-end items-center mt-2 gap-3 mr-5">
          <Button onClick={(e) => handlerPrevious(e)} variant="outlined">
            <Icon className="text-lg" icon={"mingcute:left-line"} />
            <p>Previous</p>
          </Button>
          <Button type="submit" variant="soft">
            <p>Next</p>
            <Icon className="text-lg" icon={"mingcute:right-line"} />
          </Button>
        </div>
      </form>
    </>
  );
}
