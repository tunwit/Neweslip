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
import { useLocale, useTranslations } from "next-intl";
import { getLocalizedName } from "@/lib/getLocalizedName";
import ChangableAvatar from "@/widget/ChangableAvatar";
import { EntryWithTotalDTO } from "@/types/type.entry";

interface SummaryCardProps {
  entry: EntryWithTotalDTO;
}

export default function SummaryCard({ entry }: SummaryCardProps) {
  const [expanded, setExpanded] = useState(false);
  const t = useTranslations("record");
  const locale = useLocale();
  return (
    <div className="space-y-4">
      <div className="hover:shadow bg-white rounded-lg border border-gray-200 overflow-hidden">
        {/* Employee Header */}
        <div
          className="bg-gray-50 px-6 py-4 border-b border-gray-200 grid grid-cols-[1fr_auto] gap-4 items-center cursor-pointer"
          onClick={() => setExpanded(!expanded)}
        >
          <div className="grid grid-cols-[auto_1fr] gap-4 items-center">
            <ChangableAvatar
              src={entry.employee.avatar ?? ""}
              fallbackTitle={entry.employee.snapshot.firstName.charAt(0)}
              editable={false}
            />
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                {entry.employee.snapshot.firstName}{" "}
                {entry.employee.snapshot.lastName}
              </h3>
              <div className="grid grid-cols-[auto_auto] gap-3 mt-1 w-fit">
                <p className="text-sm text-gray-600">
                  {entry.employee.snapshot.nickName}
                </p>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  {getLocalizedName(entry.employee.snapshot.branch, locale)}
                </span>
              </div>
            </div>
          </div>

          <div className="flex gap-5 items-center">
            <span
              hidden={!entry.paidAt}
              className="flex text-green-600 text-xs gap-1 items-center self-baseline-last bg-green-100 px-2 py-1 rounded-lg border border-green-600"
            >
              <Icon icon="ic:outline-paid" /> {t("fields.paid")}
            </span>
            <div className="text-right">
              <p className="text-sm text-gray-500 uppercase mb-1">
                {t("fields.net")}
              </p>
              <p className="text-2xl font-semibold text-gray-900">
                ฿ {moneyFormat(entry.netPay)}
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
              <SalaryBreakdown entryId={entry.id} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
