import { Icon } from "@iconify/react/dist/iconify.js";
import { Table } from "@mui/joy";
import React from "react";

export default function DeductionTable() {
  return (
    <>
      <div className="border border-[#d8d8d8] rounded-md px-1 max-h-[calc(100vh-300px)] overflow-auto">
        <Table stickyHeader hoverRow variant="plain" noWrap>
          <thead>
            <tr>
              <th className="font-medium">Label</th>
              <th className="font-medium w-[5%]" ></th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>เบิก</td>
              <td><Icon icon={"ic:baseline-edit"} className="text-xl"/></td>
            </tr>
            <tr>
              <td>ประกันสังคม</td>
              <td><Icon icon={"ic:baseline-edit"} className="text-xl"/></td>
            </tr>
            <tr>
              <td>จ่ายเงินกู้</td>
              <td><Icon icon={"ic:baseline-edit"} className="text-xl"/></td>
            </tr>
          </tbody>
        </Table>
      </div>
    </>
  );
}
