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
import { Employee } from "@/types/employee";
import { fetchwithauth } from "@/utils/fetcher";
import { usePathname } from "next/navigation";
import { extractSlug } from "@/utils/extractSlug";
import { useSuspenseQuery } from "@tanstack/react-query";

interface EmployeesTableProps {
  search_query?: string;
  page?: number;
  setTotalPage: Dispatch<SetStateAction<number>>;
}
function EmployeesTable({
  search_query = "",
  page = 1,
  setTotalPage,
}: EmployeesTableProps) {
  const { data, isPending, isFetching, isSuccess } = useEmployees({
    search_query,
    page,
  });
  const moneyFormat = new Intl.NumberFormat("th-TH").format(500000);
  const { checkboxs, checkall, setItem, uncheckall } = useEmployeeSelectKit();

  useEffect(() => {
    if (isFetching) return;

    setTotalPage(data.pagination.totalPages);
  }, [isPending]);

  const handleAllCheckbox = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.currentTarget.checked) {
      checkall();
      setItem(data);
    } else {
      uncheckall();
      setItem([]);
    }
  };

  // useEffect(() => {
  //   setCheckboxs(
  //     Object.fromEntries(
  //       data?.employees.map((emp: Employee) => [emp.id, false]), // start all unchecked
  //     ),
  //   );
  // }, [data]);

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
          {isFetching && (
            <tr className="text-center">
              <td colSpan={6}>Loading...</td>
            </tr>
          )}

          {!isPending && data.employees?.length === 0 && (
            <tr className="text-center">
              <td colSpan={6}>No employees</td>
            </tr>
          )}
          {!isPending &&
            data.employees.map((emp: Employee, i: number) => {
              return (
                <EmployeesElement
                  key={emp.id}
                  id={emp.id}
                  name={emp.firstName + " " + emp.lastName}
                  nickname={emp.nickName}
                  email={emp.email}
                  amount={emp.salary}
                  branch={emp.branch.name}
                  status={emp.status}
                />
              );
            })}
        </tbody>
        <tfoot>
          <tr>
            <th scope="row">Totals</th>
            <td>
              <div className="flex flex-row gap-1 items-center ">
                <p>{data?.pagination?.total}</p>
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
