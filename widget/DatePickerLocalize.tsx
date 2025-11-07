import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { Dayjs } from "dayjs";

interface DatePickerProps {
  date?: Dayjs | null
  disable?: boolean
  onChange: (newvalue: Dayjs | null) => void;
}

export default function DatePickerLocalize({date=null,disable,onChange}:DatePickerProps){
    return (
        <>
          <LocalizationProvider
                          dateAdapter={AdapterDayjs}
                          adapterLocale="th"
                        >
                          <DatePicker
                            value={date}
                            disabled={disable}
                            onChange={onChange}
                            slotProps={{
                              textField: {
                                sx: {
                                  "& .MuiInputBase-root": {
                                    height: "36px",
                                    borderRadius: 1.5,
                                  },
                                },
                              },
                            }}
                          />
          </LocalizationProvider>
        </>
    )
}