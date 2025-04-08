"use client";
import { Icon } from "@iconify/react/dist/iconify.js";
import React, { useEffect, useState } from "react";
import EmployeesElement from "./EmployeesElement";
import { Checkbox, Table } from "@mui/joy";
import data from "@/assets/employee";

export default function EmployeesTable() {
  const moneyFormat = new Intl.NumberFormat("th-TH").format(500000);
  const [checkboxs, setCheckboxs] = useState<boolean[]>(Array(15).fill(false));

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
            <th className="font-medium">Base Salary</th>
            <th className="font-medium">Branch</th>
            <th className="font-medium">Status</th>
          </tr>
        </thead>

        <tbody>
          {data.map((v, i) => {
            return (
              <EmployeesElement
                key={v.id}
                id={v.id}
                name={v.name}
                nickname={v.nickname}
                email={v.email}
                amount={v.amount}
                branch={v.branch}
                status={v.status}
                checkboxs={checkboxs}
                setCheckboxs={setCheckboxs}
              />
            );
          })}
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
            <td>{moneyFormat} ฿</td>
            <td></td>
            <td></td>
          </tr>
        </tfoot>
      </Table>
    </>
  );
}
