
import { EMPLOYEE_STATUS } from "@/types/enum/enum";
import { Option, Select } from "@mui/joy";

interface StatusSelectorProps {
  status: EMPLOYEE_STATUS | null;
  onChange: (newvalue: EMPLOYEE_STATUS) => void;
  disable?: boolean
  isEnableAll?: boolean
}

export default function StatusSelector({
  status,
  onChange,
  disable = false,
  isEnableAll = false
}: StatusSelectorProps) {

  return (
        <Select
            disabled={disable}
              value={status ?? (isEnableAll ? null : EMPLOYEE_STATUS.ACTIVE)}
              sx={{ borderRadius: "4px", fontSize: "14px" }}
                onChange={(e, newvalue) => onChange(newvalue!)}
            >
             {isEnableAll && <Option value={null}>All</Option>}
              <Option value={EMPLOYEE_STATUS.ACTIVE}>Active</Option>
              <Option value={EMPLOYEE_STATUS.PARTTIME}>Part time</Option>
              <Option value={EMPLOYEE_STATUS.INACTIVE}>Inactive</Option>
            </Select>
  )}