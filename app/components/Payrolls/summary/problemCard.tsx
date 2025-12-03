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
    color: "amber",
  },
  [PAYROLL_PROBLEM.CRITICAL]: {
    icon: "mdi:forbid",
    color: "red",
  },
};
export default function ProblemCard({
  type,
  employeeName,
  message,
}: problemCardProps) {
  return (
    <div
      className={`bg-${style[type].color}-50 p-4 border border-${style[type].color}-200 rounded-md`}
    >
      <div className="flex flex-row items-center gap-3">
        <Icon
          icon={style[type].icon}
          className={`text-${style[type].color}-500`}
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
