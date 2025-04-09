import { Icon } from "@iconify/react/dist/iconify.js";
import { Table } from "@mui/joy";
import React from "react";

export default function OTTable() {
  return (
    <>
      <div className="border border-[#d8d8d8] rounded-md px-1 max-h-[calc(100vh-300px)] overflow-auto">
        <Table stickyHeader hoverRow variant="plain" noWrap>
          <thead>
            <tr>
              <th className="font-medium">Label</th>
              <th className="font-medium">Type</th>
              <th className="font-medium">OT Rate</th>
              <th className="font-medium w-[5%]" ></th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>OT (ชั่วโมง)</td>
              <td>regular</td>
              <td>x1.5</td>
              <td><Icon icon={"ic:baseline-edit"} className="text-xl"/></td>
            </tr>
            <tr>
              <td>OT (x 2)</td>
              <td>weekend</td>
              <td>x2</td>
              <td><Icon icon={"ic:baseline-edit"} className="text-xl"/></td>
            </tr>
            <tr>
              <td>OT (x 3)</td>
              <td>holiday</td>
              <td>x3</td>
              <td><Icon icon={"ic:baseline-edit"} className="text-xl"/></td>
            </tr>
          </tbody>
        </Table>
      </div>
    </>
  );
}
