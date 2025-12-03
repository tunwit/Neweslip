import { OT_METHOD, PENALTY_METHOD, SALARY_FIELD_DEFINATION_TYPE } from "@/types/enum/enum";
import { PayrollRecordSummary } from "@/types/payrollPeriodSummary";
import { moneyFormat } from "@/utils/formmatter";
import { Icon } from "@iconify/react/dist/iconify.js";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

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
      <div className="shadow bg-white rounded-lg border border-gray-200 overflow-hidden">
        {/* Employee Header */}
        <div
          className="bg-gray-100 px-6 py-4 border-b border-gray-200 grid grid-cols-[1fr_auto] gap-4 items-center cursor-pointer"
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
              <div className="p-6">
                <div className="grid grid-cols-3 gap-8">
                  {/* Base Salary */}
                  <div>
                    <h4 className="text-sm font-semibold text-gray-700 uppercase mb-3">
                      Base Salary
                    </h4>
                    <table className="w-full">
                      <tbody>
                        <tr>
                          <td className="text-sm text-gray-600 py-1">
                            Base Salary
                          </td>
                          <td className="font-medium text-gray-900 text-right py-1">
                            ฿ {moneyFormat(record.baseSalary)}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  {/* Earnings */}
                  <div>
                    <h4 className="text-sm font-semibold text-green-700 uppercase mb-3">
                      Earnings
                    </h4>
                    <table className="w-full">
                      <tbody>
                        {record.fields
                          .filter(
                            (field) =>
                              field.type ===
                              SALARY_FIELD_DEFINATION_TYPE.INCOME,
                          )
                          .map((field) => (
                            <tr key={field.id}>
                              <td className="text-sm text-gray-600 py-1">
                                {field.name}
                              </td>
                              <td className="font-medium text-green-600 text-right py-1">
                                {moneyFormat(field.amount)}
                              </td>
                            </tr>
                          ))}
                        <tr className="border-t border-gray-200">
                          <td className="text-sm font-semibold text-gray-700 pt-3 py-1">
                            Total Earning
                          </td>
                          <td className="font-bold text-green-600 text-right pt-3 py-1">
                            {moneyFormat(record.totals.totalSalaryIncome)}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  {/* Deductions */}
                  <div>
                    <h4 className="text-sm font-semibold text-red-700 uppercase mb-3">
                      Deductions
                    </h4>
                    <table className="w-full">
                      <tbody>
                        {record.fields
                          .filter(
                            (field) =>
                              field.type ===
                              SALARY_FIELD_DEFINATION_TYPE.DEDUCTION,
                          )
                          .map((field) => (
                            <tr key={field.id}>
                              <td className="text-sm text-gray-600 py-1">
                                {field.name}
                              </td>
                              <td className="font-medium text-red-600 text-right py-1">
                                {moneyFormat(field.amount)}
                              </td>
                            </tr>
                          ))}
                        <tr className="border-t border-gray-200">
                          <td className="text-sm font-semibold text-gray-700 pt-3 py-1">
                            Total Deduction
                          </td>
                          <td className="font-bold text-red-600 text-right pt-3 py-1">
                            {moneyFormat(record.totals.totalSalaryDeduction)}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  {/* Overtimes */}
                  <div>
                    <h4 className="text-sm font-semibold text-blue-700 uppercase mb-3">
                      Overtimes
                    </h4>
                    <table className="w-full">
                      <tbody>
                        {record.ot.map((overtime) => (
                          <tr key={overtime.id}>
                            <td className="text-sm text-gray-600 py-1 w-[60%]">
                              {overtime.name}
                            </td>
                            <td className="text-sm text-gray-600 text-center py-1 w-[20%]">
                              <span className="flex flex-row gap-2">
                                <p>{Number(overtime.value).toFixed(0)}</p>
                                <p>
                                  {overtime.method === OT_METHOD.DAILY
                                    ? "day (s)"
                                    : "hour (s)"}
                                </p>
                              </span>
                            </td>
                            <td className="font-medium text-blue-600 text-right py-1">
                              {moneyFormat(overtime.amount)}
                            </td>
                          </tr>
                        ))}
                        <tr className="border-t border-gray-200">
                          <td
                            colSpan={2}
                            className="text-sm font-semibold text-gray-700 pt-3 py-1"
                          >
                            Total Overtimes
                          </td>
                          <td className="font-bold text-blue-600 text-right pt-3 py-1">
                            {moneyFormat(record.totals.totalOT)}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  {/* Penalties */}
                  <div>
                    <h4 className="text-sm font-semibold text-amber-700 uppercase mb-3">
                      Penalties
                    </h4>
                    <table className="w-full">
                      <tbody>
                        {record.penalties.map((penalty) => (
                          <tr key={penalty.id}>
                            <td className="text-sm text-gray-600 py-1 w-[60%]">
                              {penalty.name}
                            </td>
                            <td className="text-sm text-gray-600 text-center py-1 w-[20%]">
                              <span className="flex flex-row gap-2">
                                <p>{Number(penalty.value).toFixed(0)}</p>
                                <p>
                                  {unitMap[penalty.method]}
                                </p>
                              </span>
                            </td>
                            <td className="font-medium text-amber-600 text-right py-1">
                              {penalty.amount}
                            </td>
                          </tr>
                        ))}
                        <tr className="border-t border-gray-200">
                          <td colSpan={2} className="text-sm font-semibold text-gray-700 pt-3 py-1">
                            Total Penalties
                          </td>
                          <td className="font-bold text-amber-600 text-right pt-3 py-1">
                            {moneyFormat(record.totals.totalPenalty)}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  {/* Display Only */}
                  <div>
                    <h4 className="text-sm font-semibold text-green-700 uppercase mb-3">
                      Display Only
                    </h4>
                    <table className="w-full">
                      <tbody>
                        {record.fields
                          .filter(
                            (field) =>
                              field.type ===
                              SALARY_FIELD_DEFINATION_TYPE.NON_CALCULATED,
                          )
                          .map((field) => (
                            <tr key={field.id}>
                              <td className="text-sm text-gray-600 py-1">
                                {field.name}
                              </td>
                              <td className="font-medium text-green-600 text-right py-1">
                                {field.amount}
                              </td>
                            </tr>
                          ))}
                        
                      </tbody>
                    </table>
                  </div>
                </div>
                        
                {/* Net Calculation */}
                <div className="mt-6 pt-6 border-t-2 border-gray-300">
                  <div className="grid grid-cols-[1fr_auto] gap-8 items-end">
                    <div>
                      <p className="text-sm text-gray-500 uppercase mb-2">
                        Calculation
                      </p>
                      <p className="text-sm text-gray-700 mb-1">
                        Base Salary{" "}
                        <span className="text-green-800">+ Earnings</span>{" "}
                        <span className="text-red-800">- Deductions</span>{" "}
                        <span className="text-blue-800">+ Overtimes</span>{" "}
                        <span className="text-amber-800">- Penalties</span>
                      </p>
                      <p className="text-sm text-gray-700">
                        {moneyFormat(record.baseSalary)}{" "}
                        <span className="text-green-800">
                          + {moneyFormat(record.totals.totalSalaryIncome)}
                        </span>{" "}
                        <span className="text-red-800">
                          - {moneyFormat(record.totals.totalSalaryDeduction)}
                        </span>{" "}
                        <span className="text-blue-800">
                          + {moneyFormat(record.totals.totalOT)}
                        </span>{" "}
                        <span className="text-amber-800">
                          - {moneyFormat(record.totals.totalPenalty)}
                        </span>
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-500 uppercase mb-1">
                        Net Salary
                      </p>
                      <p className="text-3xl font-semibold text-gray-900">
                        {moneyFormat(record.totals.net)}
                      </p>
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
