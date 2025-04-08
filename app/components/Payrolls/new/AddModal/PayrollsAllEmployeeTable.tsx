import { Icon } from "@iconify/react/dist/iconify.js";
import React, { useEffect, useState } from "react";
import { Checkbox, Table } from "@mui/joy";
import PayrollsAllEmployeesElement from "./PayrollsAllEmployeeElement";
import { Employee } from "@/types/employee";
import data from "@/assets/employee";

interface PayrollsAllEmployeesTableProps {
  checkboxs: boolean[];
  setCheckboxs: React.Dispatch<React.SetStateAction<boolean[]>>;
  setSelectedEm: React.Dispatch<React.SetStateAction<Employee[]>>;
}

export default function PayrollsAllEmployeeTable({
  checkboxs,
  setCheckboxs,
  setSelectedEm,
}: PayrollsAllEmployeesTableProps) {
  const moneyFormat = new Intl.NumberFormat("th-TH").format(500000);

  const handleAllCheckbox = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCheckboxs(checkboxs.map(() => e.currentTarget.checked));
    setSelectedEm((prev) => {
      return [...data];
    });
  };

  return (
    <>
      <Table stickyHeader hoverRow variant="plain" noWrap>
        <thead>
          <tr>
            <th className="w-[7%]">
              <Checkbox
                checked={checkboxs.every((v) => v === true)}
                indeterminate={
                  !checkboxs.every((checkbox) => checkbox === checkboxs[0])
                }
                onChange={(e) => handleAllCheckbox(e)}
              />
            </th>
            <th className="font-medium w-[30%]">Name</th>
            <th className="font-medium">Nickname</th>
            <th className="font-medium">Branch</th>
          </tr>
        </thead>

        <tbody>
          {data.map((v, i) => {
            return (
              <PayrollsAllEmployeesElement
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
          })}
        </tbody>
      </Table>
    </>
  );
}
