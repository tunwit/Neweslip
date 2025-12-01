import { useRecordDetails } from "@/hooks/useRecordDetails";
import { SALARY_FIELD_DEFINATION_TYPE } from "@/types/enum/enum";
import { moneyFormat } from "@/utils/formmatter";
import { Table } from "@mui/joy";
import Decimal from "decimal.js";
import React from "react";
interface PayrollSummaryTabProps {
  recordId: number;
}
export default function PayrollSummaryTab({
  recordId,
}: PayrollSummaryTabProps) {
  const { data } = useRecordDetails(recordId);
  return (
    <>
      <Table borderAxis="both" >
        <thead>
          <tr>
            <th className="w-[45%]">Title</th>
            <th>Earning</th>
            <th>Deduction</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="font-medium">Base Salary</td>
            <td>{data?.data?.salary}</td>
            <td></td>
          </tr>
          {data?.data?.salaryValues.map((salary) => (
            <tr key={salary.id}>
              <td className="font-medium">{salary.name}</td>
              <td>
                {salary.type === SALARY_FIELD_DEFINATION_TYPE.INCOME
                  ? salary.amount
                  : ""}
              </td>
              <td>
                {salary.type === SALARY_FIELD_DEFINATION_TYPE.DEDUCTION
                  ? salary.amount
                  : ""}
              </td>
            </tr>
          ))}
          {data?.data?.otValues.map((ot) => (
            <tr key={ot.id}>
              <td className="font-medium">{ot.name}</td>
              <td>{ot.amount}</td>
              <td></td>
            </tr>
          ))}
          {data?.data?.penaltyValues.map((penalty) => (
            <tr key={penalty.id}>
              <td className="font-medium">{penalty.name}</td>
              <td></td>
              <td>{penalty.amount}</td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr>
            <td className="py-3 px-4 font-semibold text-gray-700">Totals</td>
            <td className="py-3 px-4 font-semibold text-gray-900">
              {moneyFormat(data?.data?.totals.totalEarning || 0)} ฿
            </td>
            <td className="py-3 px-4 font-semibold text-gray-900">
              {moneyFormat(data?.data?.totals.totalDeduction || 0)} ฿
            </td>
          </tr>
          <tr className="bg-gray-50">
            <td className="py-3 px-4 font-bold text-lg text-gray-700">Net</td>
            <td
              colSpan={2}
              className="py-3 px-4 font-bold text-lg text-gray-900"
            >
              {moneyFormat(data?.data?.totals.net || 0)} ฿
            </td>
          </tr>
        </tfoot>
      </Table>
    </>
  );
}
