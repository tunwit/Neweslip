import { useEntryBreakdown } from "@/hooks/payroll/entry/hook.entry";
import { useRecordDetails } from "@/hooks/payroll/record/useRecordDetails";
import { SALARY_FIELD_DEFINATION_TYPE } from "@/types/enum/enum";
import { moneyFormat } from "@/utils/formmatter";
import { Table } from "@mui/joy";
import { useTranslations } from "next-intl";

interface PayrollSummaryTabProps {
  periodId: number;
  entryId: number;
}
export default function PayrollSummaryTab({
  periodId,
  entryId,
}: PayrollSummaryTabProps) {
  const { data: breakdownData } = useEntryBreakdown(periodId, entryId).get;
  const t = useTranslations("record");
  const breakdown = breakdownData?.data;
  if (!breakdown) return <p>Loading...</p>;
  return (
    <>
      <Table borderAxis="both">
        <thead>
          <tr>
            <th className="w-[45%]">{t("fields.title")}</th>
            <th>{t("fields.earning")}</th>
            <th>{t("fields.deduction")}</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="font-medium">{t("fields.base_salary")}</td>
            <td>{breakdown.entry.salary}</td>
            <td></td>
          </tr>
          {breakdown.items.earnings.map((salary) => (
            <tr key={salary.id}>
              <td className="font-medium">{salary.name}</td>
              <td>{salary.amount}</td>
              <td></td>
            </tr>
          ))}
          {breakdown.items.deductions.map((salary) => (
            <tr key={salary.id}>
              <td className="font-medium">{salary.name}</td>
              <td></td>
              <td>{salary.amount}</td>
            </tr>
          ))}
          {breakdown.items.ots.map((ot) => (
            <tr key={ot.id}>
              <td className="font-medium">{ot.name}</td>
              <td>
                {ot.amount} ({ot.value})
              </td>
              <td></td>
            </tr>
          ))}
          {breakdown.items.penalties.map((penalty) => (
            <tr key={penalty.id}>
              <td className="font-medium">{penalty.name}</td>
              <td></td>
              <td>
                {penalty.amount} ({penalty.value})
              </td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr>
            <td className="py-3 px-4 font-semibold text-gray-700">Totals</td>
            <td className="py-3 px-4 font-semibold text-gray-900">
              {moneyFormat(breakdown.summary.earningTotal || 0)} ฿
            </td>
            <td className="py-3 px-4 font-semibold text-gray-900">
              {moneyFormat(breakdown.summary.deductionTotal || 0)} ฿
            </td>
          </tr>
          <tr className="bg-gray-50">
            <td className="py-3 px-4 font-bold text-lg text-gray-700">
              {t("fields.net")}
            </td>
            <td
              colSpan={2}
              className="py-3 px-4 font-bold text-lg text-gray-900"
            >
              {moneyFormat(breakdown.summary.netTotal || 0)} ฿
            </td>
          </tr>
        </tfoot>
      </Table>
    </>
  );
}
