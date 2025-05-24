import { Icon } from "@iconify/react/dist/iconify.js";
import React from "react";

interface EmployeeStatusType {
  icon: string;
  text: string;
  bg: string;
  textColor: string;
}

const EmployeeStatuses: { [key: string]: EmployeeStatusType } = {
  ACTIVE: {
    icon: "mdi:check-bold",
    text: "Active",
    bg: "bg-green-200",
    textColor: "text-green-950",
  },
  INACTIVE: {
    icon: "maki:cross",
    text: "Inactive",
    bg: "bg-gray-200",
    textColor: "text-gray-950",
  },
  PARTTIME: {
    icon: "tabler:clock",
    text: "Part Time",
    bg: "bg-amber-200",
    textColor: "text-amber-950",
  },
};

interface EmployeeStatusProps {
  status: number;
}

export default function EmployeeStatus({ status }: EmployeeStatusProps) {
  const statusInfo = EmployeeStatuses[status] || {};
  return (
    <>
      <div
        className={`flex flex-row justify-center items-center gap-1 px-2 py-[1px] rounded-2xl w-fit ${statusInfo.bg}`}
      >
        <Icon className={statusInfo.textColor} icon={statusInfo.icon} />
        <p className={`font-semibold ${statusInfo.textColor}`}>
          {statusInfo.text}
        </p>
      </div>
    </>
  );
}
