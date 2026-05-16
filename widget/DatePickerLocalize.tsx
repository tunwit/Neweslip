import { DatePicker } from "@mui/x-date-pickers";
import { Dayjs } from "dayjs";

interface DatePickerProps {
  date?: Dayjs | null;
  disable?: boolean;
  onChange: (newvalue: Dayjs | null) => void;
}

export default function DatePickerLocalize({
  date = null,
  disable,
  onChange,
}: DatePickerProps) {
  return (
    <>
      <DatePicker
        value={date ?? null}
        disabled={disable}
        onChange={onChange}
        format="DD/MM/YYYY"
        slotProps={{
          textField: {
            size: "small",
          },
        }}
      />
    </>
  );
}
