import DotIcon from "@/assets/icons/DotIcon";
import { EMPLOYEE_STATUS } from "@/types/enum/enum";
import { Icon } from "@iconify/react/dist/iconify.js";
import { useTranslations } from "next-intl";
import React from "react";

interface EmployeeStatusType {
  textKey: string;
  textColor: string;
  bgColor: string;
  icon: string;
}

const EmployeeStatuses: { [key: string]: EmployeeStatusType } = {
  ACTIVE: {
    textKey: "active",
    textColor: "text-green-700",
    bgColor: "bg-green-100",
    icon: "mdi:check-circle",
  },
  INACTIVE: {
    textKey: "inactive",
    textColor: "text-red-700",
    bgColor: "bg-red-100",
    icon: "mdi:close-circle",
  },
  PARTTIME: {
    textKey: "parttime",
    textColor: "text-purple-700",
    bgColor: "bg-purple-100",
    icon: "mdi:clock-outline",
  },
};

export default function EmployeeStatusBadge({
  status,
}: {
  status: EMPLOYEE_STATUS;
}) {
  const statusInfo = EmployeeStatuses[status];
  const t = useTranslations("employees");
  if (!statusInfo) return null;

  return (
    <div
      className={`flex items-center gap-2 px-3 py-1 rounded-full ${statusInfo.bgColor} w-fit`}
    >
      <Icon
        icon={statusInfo.icon}
        className={`${statusInfo.textColor} text-lg`}
      />
      <span className={`text-sm font-semibold ${statusInfo.textColor}`}>
        {t(`filters.status.${statusInfo.textKey}`)}
      </span>
    </div>
  );
}
