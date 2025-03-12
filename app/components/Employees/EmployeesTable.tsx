import { Icon } from "@iconify/react/dist/iconify.js";
import React from "react";
import EmployeesElement from "./EmployeesElement";
import { Table } from "@mui/joy";

export default function EmployeesTable() {
  const moneyFormat = new Intl.NumberFormat("th-TH").format(500000);
  return (
    <>
      <Table stickyHeader stickyFooter variant="plain">
        <thead>
          <tr>
            <th className="w-[8.6%]"></th>
            <th className="font-medium w-[25%]">Name</th>
            <th className="font-medium">Nickname</th>
            <th className="font-medium">Base Salary</th>
            <th className="font-medium">Branch</th>
            <th className="font-medium">Status</th>
          </tr>
        </thead>

        <tbody>
          {Array(15).fill(0).map(() => {
            return (
              <EmployeesElement
                name="Thanut Thappota"
                nickname="Wit"
                email="Tunwit2458@gmail.com"
                amount={13000}
                branch="Pakkret"
                status={1}
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
