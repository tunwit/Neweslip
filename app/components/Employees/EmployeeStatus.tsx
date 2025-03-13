import { Icon } from "@iconify/react/dist/iconify.js";
import React from "react";

interface EmployeeStatusType {
  icon: string;
  text: string;
  bg: string;
  textColor: string;
}

const EmployeeStatuses: { [key: number]: EmployeeStatusType } = {
  1: {
    icon: "mdi:check-bold",
    text: "Active",
    bg: "bg-green-200",
    textColor: "text-green-950",
  },
  2: {
    icon: "maki:cross",
    text: "Inactive",
    bg: "bg-gray-200",
    textColor: "text-gray-950",
  },
  3: {
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
