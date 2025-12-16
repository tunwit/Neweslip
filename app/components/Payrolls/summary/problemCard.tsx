import { PAYROLL_PROBLEM } from "@/types/enum/enum";
import { PayrollProblem } from "@/types/payrollProblem";
import { formatMetaMoney } from "@/utils/formmatter";
import { Icon } from "@iconify/react/dist/iconify.js";
import { useTranslations } from "next-intl";
import React from "react";

interface problemCardProps {
  issue: PayrollProblem;
}

const style = {
  [PAYROLL_PROBLEM.WARNNING]: {
    icon: "ion:warning-outline",
    bgColor: "bg-amber-50",
    textColor: "text-amber-700",
    borderColor: "border-amber-200",
  },
  [PAYROLL_PROBLEM.CRITICAL]: {
    icon: "mdi:forbid",
    bgColor: "bg-red-50",
    textColor: "text-red-700",
    borderColor: "border-red-200",
  },
};
export default function ProblemCard({ issue }: problemCardProps) {
  const t = useTranslations("summary_period.issues.code");
  return (
    <div
      className={`${style[issue.type].bgColor} ${style[issue.type].borderColor} p-4 border  rounded-md`}
    >
      <div className="flex flex-row items-center gap-3">
        <Icon
          icon={style[issue.type].icon}
          className={`${style[issue.type].textColor}`}
          fontSize={20}
        />
        <div>
          <p>
            {issue.employee.firstName} {issue.employee.lastName}
          </p>
          <p className="font-light text-xs">
            {t(issue.code, formatMetaMoney(issue.meta))}
          </p>
        </div>
      </div>
    </div>
  );
}
