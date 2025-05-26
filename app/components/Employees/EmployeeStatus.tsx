import DotIcon from "@/assets/icons/DotIcon";
import { Icon } from "@iconify/react/dist/iconify.js";
import React from "react";

interface EmployeeStatusType {
  text: string;
  textColor: string;
  bgColor: string;
  icon: string;
}

const EmployeeStatuses: { [key: string]: EmployeeStatusType } = {
  ACTIVE: {
    text: "Active",
    textColor: "text-green-700",
    bgColor: "bg-green-100",
    icon: "mdi:check-circle",
  },
  INACTIVE: {
    text: "Inactive",
    textColor: "text-red-700",
    bgColor: "bg-red-100",
    icon: "mdi:close-circle",
  },
  PARTTIME: {
    text: "Part Time",
    textColor: "text-purple-700",
    bgColor: "bg-purple-100",
    icon: "mdi:clock-outline",
  },
};

interface EmployeeStatusProps {
  status: keyof typeof EmployeeStatuses;
  id: string;
}

export default function EmployeeStatus({ status, id }: EmployeeStatusProps) {
  const statusInfo = EmployeeStatuses[status];

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
        {statusInfo.text}
      </span>
    </div>
  );
}
