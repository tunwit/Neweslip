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
      <Table stickyHeader stickyFooter hoverRow variant="plain" noWrap>
        <thead>
          <tr>
            <th className="w-[8%]">
              <Checkbox
                checked={isAllChecked(data?.data?.length ?? 0)}
                indeterminate={isSomeChecked(data?.data?.length ?? 0)}
                onChange={(e) => handleAllCheckbox(e)}
              />
            </th>
            <th className="font-medium w-[25%]">Name</th>
            <th className="font-medium">Nickname</th>
            <th className="font-medium">Base Salary</th>
            <th className="font-medium">Branch</th>
            <th className="font-medium">Status</th>
          </tr>
        </thead>

        <tbody>
          {isLoading && (
            <tr className="text-center">
              <td colSpan={6}>Loading...</td>
            </tr>
          )}

          {!isLoading && data?.data?.length == 0 && (
            <tr className="text-center">
              <td colSpan={6}>No Employee</td>
            </tr>
          )}

          {isSuccess &&
            data?.data?.map((emp: EmployeeWithShop, i: number) => {
              return <EmployeesElement key={emp.id} employee={emp} />;
            })}
        </tbody>
        <tfoot>
          <tr>
            <th scope="row">Totals</th>
            <td>
              <div className="flex flex-row gap-1 items-center ">
                <p>{employeeStat?.data?.totalEmployees || 0}</p>
                <Icon icon={"mdi:users"} />
              </div>
            </td>
            <td></td>
            <td>
              {moneyFormat(employeeStat?.data?.salary.activeSalary || 0)} ฿
            </td>
            <td></td>
            <td></td>
          </tr>
        </tfoot>
      </Table>
    </>
  );
}

export default memo(EmployeesTable);
