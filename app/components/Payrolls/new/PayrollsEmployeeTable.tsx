import { Icon } from "@iconify/react/dist/iconify.js";
import React, { useEffect, useState } from "react";

import { Button, Checkbox, Table } from "@mui/joy";
import PayrollsEmployeesElement from "./PayrollsEmployeeElement";
import { Delete } from "@mui/icons-material";
import { Employee } from "@/types/employee";

interface PayrollsEmployeesTableProps {
  checkboxs: boolean[];
  setCheckboxs: React.Dispatch<React.SetStateAction<boolean[]>>;
  employees: Employee[];
  setSelectedEm: React.Dispatch<React.SetStateAction<Employee[]>>;
}

export default function PayrollsEmployeesTable({
  checkboxs,
  setCheckboxs,
  employees,
  setSelectedEm,
}: PayrollsEmployeesTableProps) {
  const moneyFormat = new Intl.NumberFormat("th-TH").format(0);
  const handleAllCheckbox = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCheckboxs(checkboxs.map(() => e.currentTarget.checked));
    setSelectedEm((prev) => {
      return [...employees];
    });
  };

  return (
    <>
      <Table stickyHeader stickyFooter hoverRow variant="plain" noWrap>
        <thead>
          <tr>
            <th className="w-[8%]">
              <Checkbox
                checked={checkboxs.every((v) => v === true)}
                indeterminate={
                  !checkboxs.every((checkbox) => checkbox === checkboxs[0])
                }
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
          {employees.length === 0 ? (
            <tr>
              <td colSpan={6} className="font-medium opacity-60 text-center">
                Please Add New Employee
              </td>
            </tr>
          ) : (
            employees.map((v, i) => {
              return (
                <PayrollsEmployeesElement
                  id={v.id}
                  name={v.name}
                  nickname={v.nickname}
                  email={v.email}
                  amount={v.amount}
                  branch={v.branch}
                  status={v.status}
                  checkboxs={checkboxs}
                  setCheckboxs={setCheckboxs}
                  setSelectedEm={setSelectedEm}
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
                <p>{employees.length}</p>
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
