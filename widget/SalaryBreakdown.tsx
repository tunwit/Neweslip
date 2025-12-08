import {
  OT_METHOD,
  PENALTY_METHOD,
  SALARY_FIELD_DEFINATION_TYPE,
} from "@/types/enum/enum";
import { PayrollRecordSummary } from "@/types/payrollPeriodSummary";
import { moneyFormat } from "@/utils/formmatter";
import { Icon } from "@iconify/react/dist/iconify.js";
import React from "react";

interface SalaryBreakdownProps {
  record: PayrollRecordSummary;
}

const unitMap = {
  [PENALTY_METHOD.DAILY]: "day(s)",
  [PENALTY_METHOD.HOURLY]: "hour(s)",
  [PENALTY_METHOD.PERMINUTE]: "minute(s)",
};
export default function SalaryBreakdown({ record }: SalaryBreakdownProps) {
  return (
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
                <td className="text-sm text-gray-600 py-1">Base Salary</td>
                <td className="font-medium text-gray-900 text-right py-1">
                  ฿ {moneyFormat(record.baseSalary)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Earnings */}
        <div>
          <h4 className="flex flex-row  items-center gap-1 text-sm font-semibold text-green-700 uppercase mb-3">
            <Icon icon="iconamoon:trend-up" />
            Earnings
          </h4>
          <table className="w-full">
            <tbody>
              {record.fields
                .filter(
                  (field) => field.type === SALARY_FIELD_DEFINATION_TYPE.INCOME,
                )
                .map((field) => (
                  <tr key={field.id}>
                    <td className="text-sm text-gray-600 py-1">{field.name}</td>
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
          <h4 className="flex flex-row  items-center gap-1 text-sm font-semibold text-red-700 uppercase mb-3">
            <Icon icon="iconamoon:trend-down" />
            Deductions
          </h4>
          <table className="w-full">
            <tbody>
              {record.fields
                .filter(
                  (field) =>
                    field.type === SALARY_FIELD_DEFINATION_TYPE.DEDUCTION,
                )
                .map((field) => (
                  <tr key={field.id}>
                    <td className="text-sm text-gray-600 py-1">{field.name}</td>
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
          <h4 className="flex flex-row  items-center gap-1 text-sm font-semibold text-blue-700 uppercase mb-3">
            <Icon icon={"iconamoon:clock"} />
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
          <h4 className="flex flex-row  items-center gap-1 text-sm font-semibold text-amber-700 uppercase mb-3">
            <Icon icon="streamline:justice-hammer" />
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
                      <p>{unitMap[penalty.method]}</p>
                    </span>
                  </td>
                  <td className="font-medium text-amber-600 text-right py-1">
                    {penalty.amount}
                  </td>
                </tr>
              ))}
              <tr className="border-t border-gray-200">
                <td
                  colSpan={2}
                  className="text-sm font-semibold text-gray-700 pt-3 py-1"
                >
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
          <h4 className="flex flex-row  items-center gap-1 text-sm font-semibold text-green-700 uppercase mb-3">
            <Icon icon="iconamoon:eye" />
            Display Only
          </h4>
          <table className="w-full">
            <tbody>
              {record.fields
                .filter(
                  (field) =>
                    field.type === SALARY_FIELD_DEFINATION_TYPE.NON_CALCULATED,
                )
                .map((field) => (
                  <tr key={field.id}>
                    <td className="text-sm text-gray-600 py-1">{field.name}</td>
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
            <p className="text-sm text-gray-500 uppercase mb-2">Calculation</p>
            <p className="text-sm text-gray-700 mb-1">
              Base Salary <span className="text-green-800">+ Earnings</span>{" "}
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
            <p className="text-sm text-gray-500 uppercase mb-1">Net Salary</p>
            <p className="text-3xl font-semibold text-gray-900">
              {moneyFormat(record.totals.net)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
