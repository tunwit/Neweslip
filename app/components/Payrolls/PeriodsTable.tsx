import { deletePayrollPeriod } from "@/app/action/deletePayrollPeriod";
import UsersIcon from "@/assets/icons/UsersIcon";
import { useCheckBox } from "@/hooks/useCheckBox";
import { useCurrentShop } from "@/hooks/useCurrentShop";
import { PAY_PERIOD_STATUS } from "@/types/enum/enum";
import { PayrollPeriod } from "@/types/payrollPeriod";
import { dateFormat, moneyFormat } from "@/utils/formmatter";
import { showError, showSuccess } from "@/utils/showSnackbar";
import { useUser } from "@clerk/nextjs";
import { Icon } from "@iconify/react/dist/iconify.js";
import { ChevronRight } from "@mui/icons-material";
import { Checkbox } from "@mui/joy";
import { useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

interface PeriodsTableProps {
  periods: PayrollPeriod[];
  title: string;
  color: string;
  editable?: boolean;
}

const getStatusBadge = (status: keyof typeof PAY_PERIOD_STATUS) => {
  const styles = {
    [PAY_PERIOD_STATUS.DRAFT]: "bg-gray-100 text-gray-800",
    [PAY_PERIOD_STATUS.FINALIZED]: "bg-green-100 text-green-800",
    [PAY_PERIOD_STATUS.PAID]: "bg-green-100 text-green-800",
  };

  const icons = {
    [PAY_PERIOD_STATUS.DRAFT]: <Icon icon="mdi:clock-outline" />,
    [PAY_PERIOD_STATUS.FINALIZED]: <Icon icon="lets-icons:check-fill" />,
    [PAY_PERIOD_STATUS.PAID]: <Icon icon="lets-icons:check-fill" />,
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${styles[status]}`}
    >
      {icons[status]}
      {status}
    </span>
  );
};

export default function PeriodsTable({
  periods,
  title,
  color,
  editable = true,
}: PeriodsTableProps) {
  const pathname = usePathname();
  const queryClient = useQueryClient();
  const { id: shopId } = useCurrentShop();
  const { user } = useUser();
  const {
    checked,
    isSomeChecked,
    isAllChecked,
    toggle,
    isChecked,
    checkall,
    uncheckall,
  } = useCheckBox<number>(`payrollsTable-${title}`);

  const handleAllCheckbox = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!periods) return;
    if (e.currentTarget.checked) {
      checkall(periods.map((v) => v.id));
    } else {
      uncheckall();
    }
  };

  const handleDelete = async () => {
    try {
      if (!shopId || !user?.id) return;
      await deletePayrollPeriod(checked, shopId, user?.id);
      queryClient.invalidateQueries({ queryKey: ["payrollPeriods"] });
      showSuccess("Delete period success");
    } catch (err) {
      showError(`Delete period failed\n${err}`);
    } finally {
      uncheckall();
    }
  };
  return (
    <>
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div
          className={`px-6 py-4 bg-${color}-50 border-b border-${color}-200 flex items-center justify-between`}
        >
          <div className="flex items-center gap-3">
            {editable && (
              <Checkbox
                checked={isAllChecked(periods.length || 0)}
                indeterminate={isSomeChecked(periods.length || 0)}
                onChange={handleAllCheckbox}
              />
            )}
            {!editable && (
              <Icon
                icon="simple-line-icons:check"
                className="text-green-700"
                fontSize={15}
              />
            )}
            <h2 className="font-medium text-gray-900">{title}</h2>
            <span className="text-sm text-gray-500">({periods.length})</span>
          </div>
          {checked.length > 0 && (
            <button
              onClick={handleDelete}
              className="text-sm text-red-600 hover:text-red-700 font-medium flex items-center gap-1"
            >
              <Icon icon="mynaui:trash" fontSize={16} />
              Delete Selected
            </button>
          )}
        </div>

        <div className="divide-y divide-gray-200">
          {periods.map((payroll) => (
            <div
              key={payroll.id}
              className="px-6 py-4 hover:bg-gray-50 transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-4">
                <Checkbox
                  checked={isChecked(payroll.id)}
                  onChange={() => toggle(payroll.id)}
                />

                <div className="flex-1 grid grid-cols-5 gap-4 items-center">
                  <div className="col-span-2">
                    <h3 className="font-semibold text-gray-900">
                      {payroll.name}
                    </h3>
                    <p className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                      <UsersIcon />
                      {payroll.employeeCount} people
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500">Created</p>
                    <p className="text-sm font-bold text-gray-900">
                      {dateFormat(payroll.createdAt)}
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="text-sm text-gray-500">Amount</p>
                    <p className="font-semibold text-gray-900">
                      {moneyFormat(payroll.totalNet)}฿
                    </p>
                  </div>

                  <div className="flex items-center justify-end gap-3">
                    {getStatusBadge(payroll.status)}
                    <Link
                      href={`${pathname}/${payroll.status === PAY_PERIOD_STATUS.DRAFT ? "edit" : "view"}?id=${payroll.id}`}
                      className="text-blue-600 hover:text-blue-700 font-medium text-sm flex items-center gap-1"
                    >
                      {editable ? "Edit" : "View"}
                      <ChevronRight />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
