import { useEntryBreakdown } from "@/hooks/payroll/entry/hook.entry";
import { PENALTY_METHOD } from "@/types/enum/enum.penalty";
import { PayrollRecordSummary } from "@/types/payrollPeriodSummary";
import { EntryWithTotalDTO } from "@/types/type.entry";
import { moneyFormat } from "@/utils/formmatter";
import { Icon } from "@iconify/react/dist/iconify.js";
import { useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import React from "react";

interface SalaryBreakdownProps {
  entryId: number;
}

const unitMap = {
  [PENALTY_METHOD.DAILY]: "day",
  [PENALTY_METHOD.HOURLY]: "hour",
  [PENALTY_METHOD.PER_MINUTE]: "minute",
};
export default function SalaryBreakdown({ entryId }: SalaryBreakdownProps) {
  const periodId = useSearchParams().get("id");
  const { data: breakdownData, isLoading } = useEntryBreakdown(
    Number(periodId),
    entryId,
  ).get;
  const t = useTranslations("record");
  const tc = useTranslations("common");
  if (!breakdownData || !breakdownData?.data) return <p>Loading...</p>;
  const breakdown = breakdownData?.data;

  return (
    <div className="p-6">
      {isLoading && isLoading}
      <div className="grid grid-cols-3 gap-8">
        {/* Base Salary */}
        <div>
          <h4 className="text-sm font-semibold text-gray-700 uppercase mb-3">
            {t("fields.base_salary")}
          </h4>
          <table className="w-full">
            <tbody>
              <tr>
                <td className="text-sm text-gray-600 py-1">
                  {t("fields.base_salary")}
                </td>
                <td className="font-medium text-gray-900 text-right py-1">
                  ฿ {moneyFormat(breakdown.entry.salary || 0)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Earnings */}
        <div>
          <h4 className="flex flex-row  items-center gap-1 text-sm font-semibold text-green-700 uppercase mb-3">
            <Icon icon="iconamoon:trend-up" />
            {t("fields.earning")}
          </h4>
          <table className="w-full">
            <tbody>
              {breakdown.items.earnings.map((field) => (
                <tr key={field.id}>
                  <td className="text-sm text-gray-600 py-1">{field.name}</td>
                  <td className="font-medium text-green-600 text-right py-1">
                    {moneyFormat(field.amount)}
                  </td>
                </tr>
              ))}
              <tr className="border-t border-gray-200">
                <td className="text-sm font-semibold text-gray-700 pt-3 py-1">
                  {t("fields.total_earning")}
                </td>
                <td className="font-bold text-green-600 text-right pt-3 py-1">
                  {moneyFormat(breakdown.calculation.totals.earnings)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Deductions */}
        <div>
          <h4 className="flex flex-row  items-center gap-1 text-sm font-semibold text-red-700 uppercase mb-3">
            <Icon icon="iconamoon:trend-down" />
            {t("fields.deduction")}
          </h4>
          <table className="w-full">
            <tbody>
              {breakdown.items.deductions.map((field) => (
                <tr key={field.id}>
                  <td className="text-sm text-gray-600 py-1">{field.name}</td>
                  <td className="font-medium text-red-600 text-right py-1">
                    {moneyFormat(field.amount)}
                  </td>
                </tr>
              ))}
              <tr className="border-t border-gray-200">
                <td className="text-sm font-semibold text-gray-700 pt-3 py-1">
                  {t("fields.total_deduction")}
                </td>
                <td className="font-bold text-red-600 text-right pt-3 py-1">
                  {moneyFormat(breakdown.calculation.totals.deductions)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Overtimes */}
        <div>
          <h4 className="flex flex-row  items-center gap-1 text-sm font-semibold text-blue-700 uppercase mb-3">
            <Icon icon={"iconamoon:clock"} />
            {t("fields.overtime")}
          </h4>
          <table className="w-full">
            <tbody>
              {breakdown.items.ots.map((overtime) => (
                <tr key={overtime.id}>
                  <td className="text-sm text-gray-600 py-1 w-[60%]">
                    {overtime.name}
                  </td>
                  <td className="text-sm text-gray-600 text-center py-1 w-[20%]">
                    <span className="flex flex-row gap-2">
                      {tc(`unit.${unitMap[overtime.method]}`, {
                        count: Number(overtime.value).toFixed(0),
                      })}
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
                  {t("fields.total_overtime")}
                </td>
                <td className="font-bold text-blue-600 text-right pt-3 py-1">
                  {moneyFormat(breakdown.calculation.totals.overtime)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Penalties */}
        <div>
          <h4 className="flex flex-row  items-center gap-1 text-sm font-semibold text-amber-700 uppercase mb-3">
            <Icon icon="streamline:justice-hammer" />
            {t("fields.penalties")}
          </h4>
          <table className="w-full">
            <tbody>
              {breakdown.items.penalties.map((penalty) => (
                <tr key={penalty.id}>
                  <td className="text-sm text-gray-600 py-1 w-[60%]">
                    {penalty.name}
                  </td>
                  <td className="text-sm text-gray-600 text-center py-1 w-[20%]">
                    <span className="flex flex-row gap-2">
                      <p>
                        {tc(`unit.${unitMap[penalty.method]}`, {
                          count: Number(penalty.value).toFixed(0),
                        })}
                      </p>
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
                  {t("fields.total_penalties")}
                </td>
                <td className="font-bold text-amber-600 text-right pt-3 py-1">
                  {moneyFormat(breakdown.calculation.totals.penalties)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Display Only */}
        <div>
          <h4 className="flex flex-row  items-center gap-1 text-sm font-semibold text-green-700 uppercase mb-3">
            <Icon icon="iconamoon:eye" />
            {t("fields.displayonly")}
          </h4>
          <table className="w-full">
            <tbody>
              {breakdown.items.non_calculated.map((field) => (
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
      <div className="bg-blue-50 flex items-center gap-2 border border-blue-200 p-2 rounded-md my-1">
        <p className="text-blue-900 font-bold">{t("fields.note")}:</p>
        <p className="text-sm text-blue-800">
          {" "}
          {breakdown.entry.note ? breakdown.entry.note : "-"}
        </p>
      </div>
      {/* Net Calculation */}
      <div className="mt-2 pt-6 border-t-2 border-gray-300">
        <div className="grid grid-cols-[1fr_auto] gap-8 items-end">
          <div>
            <p className="text-sm text-gray-500 uppercase mb-2">
              {t("info.calculation")}
            </p>
            <p className="text-sm text-gray-700 mb-1">
              {t("fields.base_salary")}{" "}
              <span className="text-green-800">+ {t("fields.earning")}</span>{" "}
              <span className="text-red-800">- {t("fields.deduction")}</span>{" "}
              <span className="text-blue-800">+ {t("fields.overtime")}</span>{" "}
              <span className="text-amber-800">- {t("fields.penalties")}</span>
            </p>
            <p className="text-sm text-gray-700">
              {moneyFormat(breakdown.entry.salary)}{" "}
              <span className="text-green-800">
                + {moneyFormat(breakdown.calculation.totals.earnings)}
              </span>{" "}
              <span className="text-red-800">
                - {moneyFormat(breakdown.calculation.totals.deductions)}
              </span>{" "}
              <span className="text-blue-800">
                + {moneyFormat(breakdown.calculation.totals.overtime)}
              </span>{" "}
              <span className="text-amber-800">
                - {moneyFormat(breakdown.calculation.totals.penalties)}
              </span>
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-500 uppercase mb-1">
              {" "}
              {t("fields.net")}
            </p>
            <p className="text-3xl font-semibold text-gray-900">
              {moneyFormat(breakdown.calculation.netPay)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
