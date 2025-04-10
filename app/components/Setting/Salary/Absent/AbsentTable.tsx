import { Icon } from "@iconify/react/dist/iconify.js";
import { Button, Table } from "@mui/joy";
import React, { useState } from "react";
import AddAbsentModal from "./AddAbsentModal";

export default function AbsentTable() {
  const [open, setOpen] = useState<boolean>(false);
  const addAbsentHandler = () => {
    setOpen(true);
  };
  return (
    <>
    <AddAbsentModal open={open} setOpen={setOpen}/>
      <div className="border border-[#d8d8d8] rounded-md px-1 max-h-[calc(100vh-300px)] overflow-auto">
        <Table stickyHeader hoverRow variant="plain" noWrap>
          <thead>
            <tr>
              <th className="font-medium">Label</th>
              <th className="font-medium">Type</th>
              <th className="font-medium">Method</th>
              <th className="font-medium w-[5%]"></th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>ขาด</td>
              <td>base on salary</td>
              <td>daily</td>
              <td>
                <Icon icon={"ic:baseline-edit"} className="text-xl" />
              </td>
            </tr>
            <tr>
              <td>สาย</td>
              <td>constant (1฿ / m)</td>
              <td>per minute</td>
              <td>
                <Icon icon={"ic:baseline-edit"} className="text-xl" />
              </td>
            </tr>
            <tr>
              <td>ลา (ป่วย)</td>
              <td>constant (0฿ / d)</td>
              <td>daily</td>
              <td>
                <Icon icon={"ic:baseline-edit"} className="text-xl" />
              </td>
            </tr>
            <tr>
              <td>ลา (กิจ)</td>
              <td>base on salary</td>
              <td>daily</td>
              <td>
                <Icon icon={"ic:baseline-edit"} className="text-xl" />
              </td>
            </tr>
          </tbody>
        </Table>
      </div>
      <div className="mt-2">
        <Button onClick={()=>addAbsentHandler()}>Add Absent</Button>
      </div>
    </>
  );
}
