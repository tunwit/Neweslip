"use client";
import { Icon } from "@iconify/react/dist/iconify.js";
import React, {
  Dispatch,
  memo,
  SetStateAction,
  useEffect,
  useState,
} from "react";
import EmployeesElement from "./EmployeesElement";
import { Checkbox, Table } from "@mui/joy";
import { useEmployeeSelectKit } from "@/hooks/useSelectKit";
import { isAllCheckboxs } from "@/utils/isAllCheckboxs";
import { useEmployees } from "./hooks/useEmployees";
import { EmployeeWithShop } from "@/types/employee";
import { EMPLOYEE_STATUS } from "@/types/enum/enum";

interface EmployeesTableProps {
  search_query?: string;
  branchId?: number;
  status?: EMPLOYEE_STATUS
  page?: number;
  setTotalPage: Dispatch<SetStateAction<number>>;
  setPage: Dispatch<SetStateAction<number>>;
}
function EmployeesTable({
  search_query = "",
  branchId,
  status,
  page = 1,
  setPage,
  setTotalPage,
}: EmployeesTableProps) {
    const { data, isError ,isSuccess,isLoading} = useEmployees({
      search_query,
      branchId,
      page,
      status
    });
    
  const moneyFormat = new Intl.NumberFormat("th-TH").format(500000);
  const { checkboxs, checkall, setItem, uncheckall,setCheckboxs } = useEmployeeSelectKit();

  useEffect(() => {
    if (isLoading) return;
    setTotalPage(data?.pagination.totalPages || 1);
  }, [isLoading]);

  useEffect(() => {
    if (isLoading) return;

    setPage(1);
    setTotalPage(data?.pagination.totalPages || 1);
  }, [branchId, status, search_query]);

  const handleAllCheckbox = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!data?.data) return;
    if (e.currentTarget.checked) {
      checkall();
      setItem(data?.data)
    } else {
      uncheckall();
      setItem([]);
    }
  };

  useEffect(() => {
    if (!data?.data) return;
    setCheckboxs(
      Object.fromEntries(
        data?.data?.map((emp: EmployeeWithShop) => [emp.id, false])
      ),
    );
  }, [data]);

  const checkboxState = isAllCheckboxs(checkboxs);
  return (
    <>
      <Table stickyHeader stickyFooter hoverRow variant="plain" noWrap>
        <thead>
          <tr>
            <th className="w-[8%]">
              <Checkbox
                checked={checkboxState.allChecked}
                indeterminate={checkboxState.someChecked}
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
              return (
                <EmployeesElement
                  key={emp.id}
                  employee={emp}
                />
              );
            })}
        </tbody>
        <tfoot>
          <tr>
            <th scope="row">Totals</th>
            <td>
              <div className="flex flex-row gap-1 items-center ">
                <p>{data?.pagination?.totalItems}</p>
                <Icon icon={"mdi:users"} />
              </div>
            </td>
            <td></td>
            <td>{moneyFormat} ฿</td>
            <td></td>
            <td></td>
          </tr>
        </tfoot>
      </Table>
    </>
  );
}

export default memo(EmployeesTable);
