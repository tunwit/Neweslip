import { Icon } from "@iconify/react/dist/iconify.js";
import React, { useEffect, useState } from "react";
import { Checkbox, Table } from "@mui/joy";
import PayrollsAllEmployeesElement from "./PayrollsAllEmployeeElement";
import { Employee } from "@/types/employee";
import data from "@/assets/employee";

// interface PayrollsAllEmployeeProps {
//   setCheckedEmployees: React.Dispatch<React.SetStateAction<Employee[]>>;
// }
export default function PayrollsAllEmployeeTable() {
  const moneyFormat = new Intl.NumberFormat("th-TH").format(500000);;

  // const handleAllCheckbox = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   if (e.currentTarget.checked) {
  //     checkall();
  //     setItem(data);
  //   } else {
  //     uncheckall();
  //     setItem([]);
  //   }
  // };

  // useEffect(() => {
  //   setCheckboxs(
  //     Object.fromEntries(
  //       data.map((emp) => [emp.id, false]), // start all unchecked
  //     ),
  //   );
  // }, [data]);
  // const allCheckBoxState = isAllCheckboxs(checkboxs);
  return (
    <>
      <Table stickyHeader hoverRow variant="plain" noWrap>
        <thead>
          <tr>
            <th className="w-[7%]">
              {/* <Checkbox
                checked={allCheckBoxState.allChecked}
                indeterminate={allCheckBoxState.someChecked}
                onChange={(e) => handleAllCheckbox(e)}
              /> */}
            </th>
            <th className="font-medium w-[30%]">Name</th>
            <th className="font-medium">Nickname</th>
            <th className="font-medium">Branch</th>
            <th className="font-medium"></th>
          </tr>
        </thead>

        <tbody>
          {data.map((v, i) => {
            return (
              <PayrollsAllEmployeesElement
                key={i}
                id={v.id}
                name={v.name}
                nickname={v.nickname}
                email={v.email}
                amount={v.amount}
                branch={v.branch}
                status={v.status}
              />
            );
          })}
        </tbody>
      </Table>
    </>
  );
}
