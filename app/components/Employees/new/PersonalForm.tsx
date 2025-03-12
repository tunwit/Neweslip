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

interface PersonalFormProps{
    setCurrentPage: React.Dispatch<React.SetStateAction<number>>
}


export default function PersonalForm({setCurrentPage}:PersonalFormProps) {
    const handlerNext = (e:React.FormEvent<HTMLFormElement>) => {
            e.preventDefault();
            setCurrentPage(1);
    }
  return (
    <>
      <form onSubmit={(e)=>handlerNext(e)}>
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
              <Select defaultValue={'male'}>
                <Option value="male">Male</Option>
                <Option value="female">Female</Option>
                <Option value="others">Others</Option>
              </Select>
            </FormControl>
          </div>

          <div className="col-span-1 ">
            <FormControl required>
              <FormLabel>Dath of Birth</FormLabel>
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
