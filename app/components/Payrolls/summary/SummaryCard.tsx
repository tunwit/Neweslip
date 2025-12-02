import { SALARY_FIELD_DEFINATION_TYPE } from "@/types/enum/enum";
import { PayrollRecordSummary } from "@/types/payrollPeriodSummary";
import { moneyFormat } from "@/utils/formmatter";
import { Icon } from "@iconify/react/dist/iconify.js";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface SummaryCardProps {
  record: PayrollRecordSummary;
}
export default function SummaryCard({ record }: SummaryCardProps) {
  const [expanded, setExpanded] = useState(true);
  return (
    <div className="space-y-4">
      <div className="shadow bg-white rounded-lg border border-gray-200 overflow-hidden">
        {/* Employee Header */}
        <div
          className=" bg-gray-100 px-6 py-4 border-b border-gray-200 flex items-center justify-between"
          onClick={() => setExpanded(!expanded)}
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-orange-300 flex items-center justify-center text-white font-bold text-lg">
              {record.employee.firstName.charAt(0)}
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                {record.employee.firstName} {record.employee.lastName}
              </h3>
              <div className="flex items-center gap-3 mt-1">
                <p className="text-sm text-gray-600">
                  {" "}
                  {record.employee.nickName}{" "}
                </p>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  {record.employee.branch}
                </span>
              </div>
            </div>
          </div>
          <div className="flex flex-row items-center gap-5">
            <div className="text-right">
              <p className="text-sm text-gray-500 uppercase mb-1">Net Salary</p>
              <p className="text-3xl font-bold text-gray-900">
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
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">
                          Base Salary
                        </span>
                        <span className="font-medium text-gray-900">
                          ฿ {moneyFormat(record.baseSalary)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Earnings */}
                  <div>
                    <h4 className="text-sm font-semibold text-green-700 uppercase mb-3 flex items-center gap-1">
                      Earnings
                    </h4>
                    <div className="space-y-2">
                      {record.fields
                        .filter(
                          (record) =>
                            record.type === SALARY_FIELD_DEFINATION_TYPE.INCOME,
                        )
                        .map((record) => {
                          return (
                            <div key={record.id} className="flex justify-between items-center">
                              <span className="text-sm text-gray-600">
                                {record.name}
                              </span>
                              <span className="font-medium text-green-600">
                                {record.amount}
                              </span>
                            </div>
                          );
                        })}
                      <div className="pt-2 border-t border-gray-200 flex justify-between items-center">
                        <span className="text-sm font-semibold text-gray-700">
                          Total Earning
                        </span>
                        <span className="font-bold text-green-600">
                          {moneyFormat(record.totals.totalSalaryIncome)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Deductions */}
                  <div>
                    <h4 className="text-sm font-semibold text-red-700 uppercase mb-3 flex items-center gap-1">
                      Deductions
                    </h4>
                    <div className="space-y-2">
                      {record.fields
                        .filter(
                          (record) =>
                            record.type ===
                            SALARY_FIELD_DEFINATION_TYPE.DEDUCTION,
                        )
                        .map((record) => {
                          return (
                            <div key={record.id} className="flex justify-between items-center">
                              <span className="text-sm text-gray-600">
                                {record.name}
                              </span>
                              <span className="font-medium text-red-600">
                                {record.amount}
                              </span>
                            </div>
                          );
                        })}

                      <div className="pt-2 border-t border-gray-200 flex justify-between items-center">
                        <span className="text-sm font-semibold text-gray-700">
                          Total Deduction
                        </span>
                        <span className="font-bold text-red-600">
                          {moneyFormat(record.totals.totalSalaryDeduction)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Overtimes */}
                  <div>
                    <h4 className="text-sm font-semibold text-blue-700 uppercase mb-3 flex items-center gap-1">
                      Overtimes
                    </h4>
                    <div className="space-y-2">
                      {record.ot.map((record) => {
                        return (
                          <div key={record.id} className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">
                              {record.name}
                            </span>
                            <span className="font-medium text-blue-600">
                              {record.amount}
                            </span>
                          </div>
                        );
                      })}

                      <div className="pt-2 border-t border-gray-200 flex justify-between items-center">
                        <span className="text-sm font-semibold text-gray-700">
                          Total Overtimes
                        </span>
                        <span className="font-bold text-blue-600">
                          {moneyFormat(record.totals.totalOT)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Penalties */}
                  <div>
                    <h4 className="text-sm font-semibold text-amber-700 uppercase mb-3 flex items-center gap-1">
                      Penalties
                    </h4>
                    <div className="space-y-2">
                      {record.penalties.map((record) => {
                        return (
                          <div key={record.id} className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">
                              {record.name}
                            </span>
                            <span className="font-medium text-amber-600">
                              {record.amount}
                            </span>
                          </div>
                        );
                      })}

                      <div className="pt-2 border-t border-gray-200 flex justify-between items-center">
                        <span className="text-sm font-semibold text-gray-700">
                          Total Penalties
                        </span>
                        <span className="font-bold text-amber-600">
                          {moneyFormat(record.totals.totalPenalty)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Net Calculation */}
                <div className="mt-6 pt-6 border-t-2 border-gray-300">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm text-gray-500 uppercase">
                        Calculation
                      </p>
                      <span className="flex gap-2 text-sm text-gray-700 mt-1">
                        <p>Base Salary</p>
                        <span className="text-green-800">+ Earnings</span>
                        <span className="text-red-800">- Deductions</span>
                        <span className="text-blue-800">+ Overtimes</span>
                        <span className="text-amber-800">- Penalties</span>
                      </span>

                      <p className="text-sm text-gray-700 mt-1">
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
                      <p className="text-3xl font-bold text-gray-900">
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
