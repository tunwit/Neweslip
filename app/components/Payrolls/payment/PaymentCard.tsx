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
import { Building2, QrCode } from "lucide-react";

interface SummaryCardProps {
  record: PayrollRecordSummary;
}

const unitMap = {
  [PENALTY_METHOD.DAILY]: "day(s)",
  [PENALTY_METHOD.HOURLY]: "hour(s)",
  [PENALTY_METHOD.PERMINUTE]: "minute(s)",
};

export default function PaymentCard({ record }: SummaryCardProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="space-y-4">
      <div className="hover:shadow bg-white rounded-lg border border-gray-200 overflow-hidden">
        {/* Employee Header */}
        <div
          className="bg-white px-6 py-4 border-b border-gray-200 grid grid-cols-[1fr_auto] gap-4 items-center cursor-pointer"
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
              <span className="flex items-center gap-2">
                <p className="text-xs text-gray-600">SCB • 123-4-56789-0</p>
                <p className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  {record.employee.branch}
                </p>
              </span>
            </div>
          </div>

          <div className="grid grid-cols-[1fr_auto] gap-5 items-center">
            <div className="text-right">
              <p className="text-xs text-gray-500 uppercase mb-1">Net Salary</p>
              <p className="text-xl font-semibold text-gray-900">
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
              <div className="p-6 grid grid-cols-2 gap-6 bg-gray-50">
                <div className="space-y-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Building2 className="w-5 h-5 text-blue-600" />
                    <h4 className="font-semibold text-gray-900">
                      Bank Transfer Details
                    </h4>
                  </div>

                  <div className="bg-white rounded-lg p-4 space-y-3">
                    <div>
                      <label className="text-xs text-gray-600 uppercase tracking-wide">
                        Bank Name
                      </label>
                      <div className="flex items-center justify-between mt-1">
                        <p className="font-medium text-gray-900">scb</p>
                      </div>
                    </div>

                    <div>
                      <label className="text-xs text-gray-600 uppercase tracking-wide">
                        Account Number
                      </label>
                      <div className="flex items-center justify-between mt-1">
                        <p className="font-mono font-medium text-gray-900">
                          asdasd
                        </p>
                        <button
                          //   onClick={(e) => {
                          //     e.stopPropagation();
                          //     handleCopy(
                          //       employee.accountNumber,
                          //       `bank-${employee.id}`,
                          //     );
                          //   }}
                          className="p-1.5 hover:bg-gray-100 rounded transition-colors"
                        >
                          {/* {copiedId === `bank-${employee.id}` ? (
                            <Check className="w-4 h-4 text-green-600" />
                          ) : (
                            <Copy className="w-4 h-4 text-gray-400" />
                          )} */}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="text-xs text-gray-600 uppercase tracking-wide">
                        Account Name
                      </label>
                      <p className="font-medium text-gray-900 mt-1">
                        {record.employee.firstName}
                      </p>
                    </div>

                    <div>
                      <label className="text-xs text-gray-600 uppercase tracking-wide">
                        Amount
                      </label>
                      <div className="flex items-center justify-between mt-1">
                        <p className="font-mono font-bold text-lg text-gray-900">
                          ฿ZXZXZX
                        </p>
                        <button
                          //   onClick={(e) => {
                          //     e.stopPropagation();
                          //     handleCopy(
                          //       employee.amount.toString(),
                          //       `amount-${employee.id}`,
                          //     );
                          //   }}
                          className="p-1.5 hover:bg-gray-100 rounded transition-colors"
                        >
                          {/* {copiedId === `amount-${employee.id}` ? (
                            <Check className="w-4 h-4 text-green-600" />
                          ) : (
                            <Copy className="w-4 h-4 text-gray-400" />
                          )} */}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-2 mb-3">
                    <QrCode className="w-5 h-5 text-purple-600" />
                    <h4 className="font-semibold text-gray-900">PromptPay</h4>
                  </div>

                  <div className="bg-white rounded-lg p-4 space-y-3">
                    <div className="flex justify-center py-4">
                      <div className="w-48 h-48 bg-gradient-to-br from-purple-100 to-pink-100 rounded-lg flex items-center justify-center">
                        <div className="text-center">
                          <QrCode className="w-24 h-24 text-purple-600 mx-auto mb-2" />
                          <p className="text-xs text-purple-700 font-medium">
                            QR Code Placeholder
                          </p>
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="text-xs text-gray-600 uppercase tracking-wide">
                        PromptPay ID
                      </label>
                      <div className="flex items-center justify-between mt-1">
                        <div>
                          <p className="font-mono font-medium text-gray-900">
                            aa15651515
                          </p>
                          <p className="text-xs text-gray-500 mt-0.5">
                            {/* {employee.promptpayType === "mobile"
                              ? "Mobile Number"
                              : "Citizen ID"} */}
                          </p>
                        </div>
                        <button
                          //   onClick={(e) => {
                          //     e.stopPropagation();
                          //     handleCopy(
                          //       employee.promptpayId,
                          //       `pp-${employee.id}`,
                          //     );
                          //   }}
                          className="p-1.5 hover:bg-gray-100 rounded transition-colors"
                        >
                          {/* {copiedId === `pp-${employee.id}` ? (
                            <Check className="w-4 h-4 text-green-600" />
                          ) : (
                            <Copy className="w-4 h-4 text-gray-400" />
                          )} */}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
