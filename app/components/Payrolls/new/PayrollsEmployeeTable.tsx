import { Icon } from "@iconify/react/dist/iconify.js";
import React, { useEffect, useState } from "react";

import { Button, Checkbox, Table } from "@mui/joy";
import PayrollsEmployeesElement from "./PayrollsEmployeeElement";
import { Delete } from "@mui/icons-material";

interface Employees {
  name: string;
  nickname: string;
  email: string;
  branch: string;
}

interface PayrollsEmployeesTableProps {
  checkboxs: boolean[];
  setCheckboxs: React.Dispatch<React.SetStateAction<boolean[]>>;
  employees: Employees[];
}

export default function PayrollsEmployeesTable({
  checkboxs,
  setCheckboxs,
  employees,
}: PayrollsEmployeesTableProps) {
  const moneyFormat = new Intl.NumberFormat("th-TH").format(500000);
  const handleAllCheckbox = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCheckboxs(checkboxs.map(() => e.currentTarget.checked));
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
              <td></td>
              <td></td>
              <td className="font-medium opacity-60">
                Please Add New Employee
              </td>
              <td></td>
              <td></td>
            </tr>
          ) : (
            employees.map((v, i) => {
              return (
                <PayrollsEmployeesElement
                  id={i}
                  name="Thanut Thappota"
                  nickname="Wit"
                  email="Tunwit2458@gmail.com"
                  amount={13000}
                  branch="Pakkret"
                  status={2}
                  checkboxs={checkboxs}
                  setCheckboxs={setCheckboxs}
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
                <p>56</p>
                <Icon icon={"mdi:users"} />
              </div>
            </td>
            <td></td>
            <td></td>
            <td>{moneyFormat} ฿</td>
            <td></td>
          </tr>
        </tfoot>
      </Table>
    </>
  );
}
