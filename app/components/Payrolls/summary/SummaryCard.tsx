import {
  OT_METHOD,
  PENALTY_METHOD,
  SALARY_FIELD_DEFINATION_TYPE,
} from "@/types/enum/enum";
import { PayrollRecordSummary } from "@/types/payrollPeriodSummary";
import { moneyFormat } from "@/utils/formmatter";
import { Icon } from "@iconify/react/dist/iconify.js";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import SalaryBreakdown from "@/widget/SalaryBreakdown";

interface SummaryCardProps {
  record: PayrollRecordSummary;
}

const unitMap = {
  [PENALTY_METHOD.DAILY]: "day(s)",
  [PENALTY_METHOD.HOURLY]: "hour(s)",
  [PENALTY_METHOD.PERMINUTE]: "minute(s)",
};

export default function SummaryCard({ record }: SummaryCardProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="space-y-4">
      <div className="hover:shadow bg-white rounded-lg border border-gray-200 overflow-hidden">
        {/* Employee Header */}
        <div
          className="bg-gray-50 px-6 py-4 border-b border-gray-200 grid grid-cols-[1fr_auto] gap-4 items-center cursor-pointer"
          onClick={() => setExpanded(!expanded)}
        >
          <div className="grid grid-cols-[auto_1fr] gap-4 items-center">
            <div className="w-12 h-12 rounded-full bg-orange-300 flex items-center justify-center text-white font-bold text-lg">
              {record.employee.firstName.charAt(0)}
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                {record.employee.firstName} {record.employee.lastName}
              </h3>
              <div className="grid grid-cols-[auto_auto] gap-3 mt-1 w-fit">
                <p className="text-sm text-gray-600">
                  {record.employee.nickName}
                </p>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  {record.employee.branch}
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-[1fr_auto] gap-5 items-center">
            <div className="text-right">
              <p className="text-sm text-gray-500 uppercase mb-1">Net Salary</p>
              <p className="text-2xl font-semibold text-gray-900">
                ฿ {moneyFormat(record.totals.net)}
              </p>
            </div>
            <Icon
              icon="mingcute:down-line"
              fontSize={30}
              className={`transition-transform duration-300 ${expanded ? "rotate-180" : ""}`}
            />
          </div>
        </div>

        {/* Salary Breakdown */}
        <AnimatePresence initial={false}>
          {expanded && (
            <motion.div
              key="content"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
            >
              <SalaryBreakdown record={record} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
