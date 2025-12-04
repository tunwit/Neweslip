import { PAYROLL_PROBLEM } from "@/types/enum/enum";
import { Icon } from "@iconify/react/dist/iconify.js";
import React from "react";

interface problemCardProps {
  type: PAYROLL_PROBLEM;
  employeeName: string;
  message: string;
}

const style = {
  [PAYROLL_PROBLEM.WARNNING]: {
    icon: "ion:warning-outline",
    textColor: "bg-amber-50",
    borderColor: "border-amber-200",
  },
  [PAYROLL_PROBLEM.CRITICAL]: {
    icon: "mdi:forbid",
    textColor: "bg-red-50",
    borderColor: "border-red-200",
  },
};
export default function ProblemCard({
  type,
  employeeName,
  message,
}: problemCardProps) {
  return (
    <div
      className={`${style[type].textColor} ${style[type].borderColor} p-4 border  rounded-md`}
    >
      <div className="flex flex-row items-center gap-3">
        <Icon
          icon={style[type].icon}
          className={`${style[type].textColor}`}
          fontSize={20}
        />
        <div>
          <p>{employeeName}</p>
          <p className="font-light text-xs">{message}</p>
        </div>
      </div>
    </div>
  );
}
