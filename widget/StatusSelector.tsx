import { EMPLOYEE_STATUS } from "@/types/enum/enum";
import { Option, Select } from "@mui/joy";
import { useTranslations } from "next-intl";

interface StatusSelectorProps {
  status: EMPLOYEE_STATUS | null;
  onChange: (newvalue: EMPLOYEE_STATUS) => void;
  disable?: boolean;
  isEnableAll?: boolean;
}

export default function StatusSelector({
  status,
  onChange,
  disable = false,
  isEnableAll = false,
}: StatusSelectorProps) {
  const t = useTranslations("employees.filters");
  return (
    <Select
      disabled={disable}
      value={status ?? (isEnableAll ? null : EMPLOYEE_STATUS.ACTIVE)}
      sx={{ borderRadius: "4px", fontSize: "14px" }}
      onChange={(e, newvalue) => onChange(newvalue!)}
    >
      {isEnableAll && <Option value={null}>{t("status.all")}</Option>}
      <Option value={EMPLOYEE_STATUS.ACTIVE}>{t("status.active")}</Option>
      <Option value={EMPLOYEE_STATUS.PARTTIME}>{t("status.parttime")}</Option>
      <Option value={EMPLOYEE_STATUS.INACTIVE}>{t("status.inactive")}</Option>
    </Select>
  );
}
