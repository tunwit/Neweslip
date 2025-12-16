import { moneyFormat } from "@/utils/formmatter";
import { useTranslations } from "next-intl";
import React from "react";

interface SummarySectionProps {
  totalSalary: number;
  totalEarning: number;
  totalDeduction: number;
  totalNet: number;
}
export default function SummarySection({
  totalSalary,
  totalEarning,
  totalDeduction,
  totalNet,
}: SummarySectionProps) {
  const t = useTranslations("summary_period");
  const tPeriod = useTranslations("period");
  return (
    <div className="bg-white rounded-lg border border-gray-200 mt-6 p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">
        {t("info.summary")}
      </h2>
      <div className="grid grid-cols-4 gap-6">
        <div className="text-center p-4 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-600 mb-2">
            {tPeriod("fields.total_base_salary")}
          </p>
          <p className="text-xl font-bold text-gray-900">
            ฿ {moneyFormat(totalSalary || 0)}
          </p>
        </div>
        <div className="text-center p-4 bg-green-50 rounded-lg">
          <p className="text-sm text-green-700 mb-2">
            {tPeriod("fields.total_earning")}
          </p>
          <p className="text-xl font-bold text-green-900">
            ฿ {moneyFormat(totalEarning || 0)}
          </p>
        </div>
        <div className="text-center p-4 bg-red-50 rounded-lg">
          <p className="text-sm text-red-700 mb-2">
            {tPeriod("fields.total_deduction")}
          </p>
          <p className="text-xl font-bold text-red-900">
            ฿ {moneyFormat(totalDeduction || 0)}
          </p>
        </div>
        <div className="text-center p-4 bg-blue-50 rounded-lg border-2 border-blue-300">
          <p className="text-sm text-blue-700 mb-2 uppercase font-semibold">
            {tPeriod("fields.grand_total")}
          </p>
          <p className="text-2xl font-bold text-blue-900">
            ฿ {moneyFormat(totalNet || 0)}
          </p>
        </div>
      </div>
    </div>
  );
}
