import { Icon } from "@iconify/react/dist/iconify.js";
import React, { useEffect, useState } from "react";
import { Checkbox, Table } from "@mui/joy";
import PayrollsAllEmployeesElement from "./PayrollsAllEmployeeElement";

interface PayrollsAllEmployeesTableProps {
  checkboxs: boolean[];
  setCheckboxs: React.Dispatch<React.SetStateAction<boolean[]>>;
}

export default function PayrollsAllEmployeeTable({
  checkboxs,
  setCheckboxs,
}: PayrollsAllEmployeesTableProps) {
  const moneyFormat = new Intl.NumberFormat("th-TH").format(500000);

  const handleAllCheckbox = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCheckboxs(checkboxs.map(() => e.currentTarget.checked));
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
          {Array(15)
            .fill(0)
            .map((v, i) => {
              return (
                <PayrollsAllEmployeesElement
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
            })}
        </tbody>
      </Table>
    </>
  );
}
