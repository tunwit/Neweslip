import { Icon } from "@iconify/react/dist/iconify.js";
import React, { useEffect, useState } from "react";

import { Button, Checkbox, Table } from "@mui/joy";
import PayrollsEmployeesElement from "./PayrollsEmployeeElement";
import { Delete } from "@mui/icons-material";

interface PayrollsEmployeesTableProps {
  checkboxs: boolean[];
  setCheckboxs: React.Dispatch<React.SetStateAction<boolean[]>>;
}

export default function PayrollsEmployeesTable({
  checkboxs,
  setCheckboxs,
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
          {Array(15)
            .fill(0)
            .map((v, i) => {
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
            <td></td>
            <td>{moneyFormat} ฿</td>
            <td></td>
          </tr>
        </tfoot>
      </Table>
    </>
  );
}
