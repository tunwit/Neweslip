"use client";
import { Icon } from "@iconify/react/dist/iconify.js";
import React, {
  ChangeEvent,
  Dispatch,
  memo,
  SetStateAction,
  useEffect,
  useState,
} from "react";
import EmployeesElement from "./EmployeesElement";
import { Checkbox, Table } from "@mui/joy";
import { useEmployees } from "../../../hooks/useEmployees";
import { EmployeeWithShop } from "@/types/employee";
import { useEmployeeStats } from "@/hooks/useEmployeeStats";
import { useCurrentShop } from "@/hooks/useCurrentShop";
import { moneyFormat } from "@/utils/formmatter";
import { PaginatedResponse } from "@/types/response";
import { useCheckBox } from "@/hooks/useCheckBox";
import { useTranslations } from "next-intl";

interface EmployeesTableProps {
  data: PaginatedResponse<EmployeeWithShop[]> | undefined;
  isLoading: boolean;
  isSuccess: boolean;
}
function EmployeesTable({ data, isLoading, isSuccess }: EmployeesTableProps) {
  const { id } = useCurrentShop();
  const { data: employeeStat } = useEmployeeStats({ shopId: id! });
  const { checked, checkall, uncheckall, isAllChecked, isSomeChecked } =
    useCheckBox<number>("allEmployeeTable");
  const t = useTranslations("employees");

  const handleAllCheckbox = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!data?.data) return;
    if (e.currentTarget.checked) {
      checkall(data.data.map((v) => v.id));
    } else {
      uncheckall();
    }
  };

  return (
    <>
      <table className="w-full border-separate border-spacing-0">
        <thead className=" bg-gray-50 border border-gray-200 sticky top-0 z-10">
          <tr className="bg-gray-100 h-15 rounded-t-md text-left ">
            <th className="font-light text-sm pl-6 w-[4%] whitespace-nowrap min-w-15 border-b">
              <Checkbox
                checked={isAllChecked(data?.data?.length ?? 0)}
                indeterminate={isSomeChecked(data?.data?.length ?? 0)}
                onChange={(e) => handleAllCheckbox(e)}
              />
            </th>
            <th className="font-light text-sm whitespace-nowrap border-b">
              {t("fields.name")}
            </th>
            <th className="font-light text-sm whitespace-nowrap border-b">
              {t("fields.nickname")}
            </th>
            <th className="font-light text-sm whitespace-nowrap border-b">
              {t("fields.base_salary")}
            </th>
            <th className="font-light text-sm whitespace-nowrap border-b">
              {t("fields.branch")}
            </th>
            <th className="font-light text-sm whitespace-nowrap border-b">
              {t("fields.status")}
            </th>
          </tr>
        </thead>

        <tbody className="bg-white divide-y divide-gray-200">
          {isLoading && (
            <tr className="h-20 hover:bg-gray-50 transition-colors cursor-pointer ">
              <td colSpan={6} className="text-center">
                <span className="flex items-center gap-2 w-full justify-center">
                  <Icon
                    icon={"mynaui:spinner"}
                    className="animate-spin"
                    fontSize={25}
                  />
                  <p>Loading...</p>
                </span>
              </td>
            </tr>
          )}

          {!isLoading && data?.data?.length == 0 && (
            <tr className="h-20 hover:bg-gray-50 transition-colors cursor-pointer ">
              <td colSpan={6} className="text-center">
                {t("table.no_employee")}
              </td>
            </tr>
          )}

          {isSuccess &&
            data?.data?.map((emp: EmployeeWithShop, i: number) => {
              return <EmployeesElement key={emp.id} employee={emp} />;
            })}
        </tbody>
        <tfoot className="h-15 bg-gray-50   sticky bottom-0 z-10 ">
          <tr>
            <th className="border-t pl-6" scope="row">
              {t("table.total")}
            </th>
            <td className="border-t">
              <div className="flex flex-row gap-1 items-center ">
                <p>{employeeStat?.data?.totalEmployees || 0}</p>
                <Icon icon={"mdi:users"} />
              </div>
            </td>
            <td className="border-t"></td>
            <td className="border-t">
              {moneyFormat(employeeStat?.data?.salary.activeSalary || 0)} ฿
            </td>
            <td className="border-t"></td>
            <td className="border-t"></td>
          </tr>
        </tfoot>
      </table>
    </>
  );
}

export default memo(EmployeesTable);
