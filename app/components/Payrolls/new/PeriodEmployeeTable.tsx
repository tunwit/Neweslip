import { UseCheckBoxResult } from "@/hooks/useCheckBox";
import { usePayrollPeriodSummary } from "@/hooks/payroll/period/usePayrollPeriodSummary";
import { getLocalizedName } from "@/lib/getLocalizedName";
import { PayrollPeriod } from "@/types/payrollPeriod";
import { PayrollRecord } from "@/types/payrollRecord";
import { moneyFormat } from "@/utils/formmatter";
import { Icon } from "@iconify/react/dist/iconify.js";
import { Checkbox } from "@mui/joy";
import { useLocale, useTranslations } from "next-intl";
import React, {
  Dispatch,
  SetStateAction,
  useEffect,
  useMemo,
  useState,
} from "react";
import ChangableAvatar from "@/widget/ChangableAvatar";

interface PeriodEmployeeTableProps {
  searchQuery: string;
  checkBoxMethod: UseCheckBoxResult<number>;
  periodData?: PayrollPeriod;
  records: PayrollRecord[];
  setSelected?: Dispatch<SetStateAction<PayrollRecord | null>>;
  setOpenEdit: Dispatch<SetStateAction<boolean>>;
}
export default function PeriodEmployeeTable({
  searchQuery,
  checkBoxMethod,
  periodData,
  records,
  setSelected,
  setOpenEdit,
}: PeriodEmployeeTableProps) {
  const [filterd, setFilterd] = useState(records);
  const t = useTranslations("record");
  const locale = useLocale();
  useEffect(() => {
    const q = searchQuery.toLowerCase();

    setFilterd(
      records.filter((r) => {
        return (
          r.employee.firstName.toLowerCase().includes(q) ||
          r.employee.lastName.toLowerCase().includes(q) ||
          (r.employee.firstName + r.employee.lastName)
            .toLowerCase()
            .includes(q) ||
          r.employee.nickName.toLowerCase().includes(q) ||
          r.employee.branch.name.toLowerCase().includes(q) ||
          r.employee.branch.nameEng.toLowerCase().includes(q)
        );
      }),
    );
  }, [records, searchQuery]);

  const { toggle, isChecked, checkall, uncheckall, isSomeChecked } =
    checkBoxMethod;

  const handleAllCheckbox = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!records) return;
    if (e.currentTarget.checked) {
      checkall(records.map((r) => r.id));
    } else {
      uncheckall();
    }
  };

  const filteredTotalNet = useMemo(() => {
    return filterd.reduce((sum, r) => sum + (r.totals.net || 0), 0);
  }, [filterd]);
  return (
    <>
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1200px]">
            <thead className="bg-gray-50 border border-gray-200">
              <tr className="bg-gray-100 h-15 rounded-t-md text-left ">
                <th className="font-light text-sm pl-6 w-[6%]">
                  <Checkbox
                    indeterminate={isSomeChecked(records.length)}
                    onChange={handleAllCheckbox}
                  />
                </th>
                <th className="font-light text-sm w-[20%]">
                  {t("fields.employee")}
                </th>
                <th className="font-light text-sm w-[5%]">
                  {t("fields.branch")}
                </th>
                <th className="font-light text-sm text-right whitespace-nowrap">
                  {t("fields.base_salary")}
                </th>
                <th className="font-light text-sm text-right whitespace-nowrap">
                  {t("fields.earning")}
                </th>
                <th className="font-light text-sm text-right whitespace-nowrap">
                  {t("fields.deduction")}
                </th>
                <th className="font-light text-sm text-right whitespace-nowrap">
                  {t("fields.net")}
                </th>
                <th className="font-light text-sm w-[6%]"></th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filterd.map((r) => {
                const avatar = `${process.env.NEXT_PUBLIC_CDN_URL}/${r.employee.avatar}`;

                return (
                  <tr
                    key={r.id}
                    className="h-20 hover:bg-gray-50 transition-colors cursor-pointer"
                  >
                    <td className="pl-6">
                      <Checkbox
                        checked={isChecked(r.id)}
                        onChange={() => toggle(r.id)}
                      />
                    </td>
                    <td
                      onClick={() => {
                        setSelected?.(r);
                        setOpenEdit(true);
                      }}
                    >
                      <div className="flex flex-row items-center gap-3">
                        <ChangableAvatar
                          src={avatar}
                          fallbackTitle={r.employee.firstName.charAt(0)}
                          editable={false}
                        />
                        <div className="min-w-max">
                          <p className="font-semibold whitespace-nowrap">
                            {r.employee.firstName}&nbsp;
                            {r.employee.lastName}
                          </p>
                          <p className="font-light text-gray-700 whitespace-nowrap">
                            {r.employee.nickName}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td
                      onClick={() => {
                        setSelected?.(r);
                        setOpenEdit(true);
                      }}
                    >
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 whitespace-nowrap">
                        {getLocalizedName(r.employee.branch, locale)}
                      </span>
                    </td>
                    <td
                      className="text-right font-medium text-gray-900 whitespace-nowrap"
                      onClick={() => {
                        setSelected?.(r);
                        setOpenEdit(true);
                      }}
                    >
                      {moneyFormat(r.baseSalry || 0)}
                    </td>
                    <td
                      className="text-right text-green-600 font-medium whitespace-nowrap"
                      onClick={() => {
                        setSelected?.(r);
                        setOpenEdit(true);
                      }}
                    >
                      {moneyFormat(r.totals.totalEarning || 0)}
                    </td>
                    <td
                      className="text-right text-red-600 font-medium whitespace-nowrap"
                      onClick={() => {
                        setSelected?.(r);
                        setOpenEdit(true);
                      }}
                    >
                      {moneyFormat(r.totals.totalDeduction || 0)}
                    </td>
                    <td
                      className={`text-right whitespace-nowrap ${r.totals.net < 0 && "text-red-800"}`}
                      onClick={() => {
                        setSelected?.(r);
                        setOpenEdit(true);
                      }}
                    >
                      ฿ {moneyFormat(r.totals.net || 0)}
                    </td>
                    <td
                      className="text-right pr-6"
                      onClick={() => {
                        setSelected?.(r);
                        setOpenEdit(true);
                      }}
                    >
                      <div className="flex flex-row-reverse">
                        <Icon
                          icon="ic:baseline-edit"
                          className="text-xl text-right"
                        />
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot className="h-20 bg-gray-50 border border-gray-200">
              <tr>
                <th
                  colSpan={6}
                  className="text-left pl-6 text-sm font-normal text-gray-700 whitespace-nowrap"
                >
                  {t("info.showing", { count: filterd.length })}
                </th>
                <th colSpan={2}>
                  <div className="text-right pr-6">
                    <p className="text-xs text-gray-500 uppercase whitespace-nowrap">
                      {t("info.total_payroll")}
                    </p>
                    <p className="text-2xl font-bold text-gray-900 whitespace-nowrap">
                      ฿ {moneyFormat(filteredTotalNet || 0)}
                    </p>
                  </div>
                </th>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </>
  );
}
