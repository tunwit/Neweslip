import { Icon } from "@iconify/react/dist/iconify.js";
import React, { useEffect, useState } from "react";

import { Button, Checkbox, Table } from "@mui/joy";
import PayrollsEmployeesElement from "./PayrollsEmployeeElement";
import { Delete } from "@mui/icons-material";
import { Employee } from "@/types/employee";
import { usePayrollSelectKit } from "../../../../hooks/useSelectKit";
import data from "@/assets/employee";
import { isAllCheckboxs } from "@/utils/isAllCheckboxs";
import { useSelectedEmployees } from "./hooks/useSelectedEmployee";

interface PayrollsEmployeesTableProps {
  query: string;
}
export default function PayrollsEmployeesTable({
  query,
}: PayrollsEmployeesTableProps) {
  const moneyFormat = new Intl.NumberFormat("th-TH").format(0);
  const { checkboxs, checkall, uncheckall, setItem, setCheckboxs } =
    usePayrollSelectKit();
  const { selectedEmployees } = useSelectedEmployees();

  const handleAllCheckbox = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.currentTarget.checked) {
      checkall();
      setItem(selectedEmployees);
    } else {
      uncheckall();
      setItem([]);
    }
  };

  useEffect(() => {
    setCheckboxs(
      Object.fromEntries(
        selectedEmployees.map((emp) => [emp.id, false]), // start all unchecked
      ),
    );
  }, [selectedEmployees]);

  const allCheckBoxState = isAllCheckboxs(checkboxs);

  return (
    <>
      <Table stickyHeader stickyFooter hoverRow variant="plain" noWrap>
        <thead>
          <tr>
            <th className="w-[8%]">
              <Checkbox
                checked={allCheckBoxState.allChecked}
                indeterminate={allCheckBoxState.someChecked}
                onChange={(e) => handleAllCheckbox(e)}
              />
            </th>
            <th className="font-medium w-[25%]">Name</th>
            <th className="font-medium">Nickname</th>
            <th className="font-medium">Branch</th>
            <th className="font-medium">Total</th>
            <th className="font-medium w-[5%]"></th>
          </tr>
        </thead>

        <tbody>
          {selectedEmployees.length === 0 ? (
            <tr>
              <td colSpan={6} className="font-medium opacity-60 text-center">
                Please Add New Employee
              </td>
            </tr>
          ) : (
            selectedEmployees
              .filter((emp) =>
                [emp.name, emp.nickname, emp.email, emp.branch].some((field) =>
                  field.toLowerCase().includes(query.toLowerCase()),
                ),
              )
              .map((v, i) => {
                return (
                  <PayrollsEmployeesElement
                    key={v.id}
                    id={v.id}
                    name={v.name}
                    nickname={v.nickname}
                    email={v.email}
                    amount={v.amount}
                    branch={v.branch}
                    status={v.status}
                  />
                );
              })
          )}
        </tbody>
        <tfoot>
          <tr>
            <th scope="row">Totals</th>
            <td>
              <div className="flex flex-row gap-1 items-center ">
                <p>{selectedEmployees.length}</p>
                <Icon icon={"mdi:users"} />
              </div>
            </td>
            <td></td>
            <td></td>
            <td>
              <p className="font-semibold">{moneyFormat} ฿</p>
            </td>
            <td></td>
          </tr>
        </tfoot>
      </Table>
    </>
  );
}
