import { Icon } from "@iconify/react/dist/iconify.js";
import { Button, Table } from "@mui/joy";
import React, { useState } from "react";
import AddOTMedal from "./AddOTMedal";

export default function OTTable() {
  const [open, setOpen] = useState<boolean>(false);
  const addOTHandler = () => {  
    setOpen(true);
  };
  return (
    <>
      <AddOTMedal open={open} setOpen={setOpen} />
      <div className="border border-[#d8d8d8] rounded-md px-1 max-h-[calc(100vh-300px)] overflow-auto">
        <Table stickyHeader hoverRow variant="plain" noWrap>
          <thead>
            <tr>
              <th className="font-medium">Label</th>
              <th className="font-medium">Type</th>
              <th className="font-medium">Method</th>
              <th className="font-medium">OT Rate</th>
              <th className="font-medium w-[5%]"></th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>OT (ชั่วโมง)</td>
              <td>base on salary</td>
              <td>hourly</td>
              <td>x1.5</td>
              <td>
                <Icon icon={"ic:baseline-edit"} className="text-xl" />
              </td>
            </tr>
            <tr>
              <td>OT (วัน)</td>
              <td>base on salary</td>
              <td>daily</td>
              <td>x1</td>
              <td>
                <Icon icon={"ic:baseline-edit"} className="text-xl" />
              </td>
            </tr>
            <tr>
              <td>OT (x 2)</td>
              <td>base on salary</td>
              <td>hourly</td>
              <td>x2</td>
              <td>
                <Icon icon={"ic:baseline-edit"} className="text-xl" />
              </td>
            </tr>
            <tr>
              <td>OT (x 3)</td>
              <td>base on salary</td>
              <td>hourly</td>
              <td>x3</td>
              <td>
                <Icon icon={"ic:baseline-edit"} className="text-xl" />
              </td>
            </tr>
            <tr>
              <td>OT (parttime)</td>
              <td>constant (15฿ / h)</td>
              <td>hourly</td>
              <td>x1.5</td>
              <td>
                <Icon icon={"ic:baseline-edit"} className="text-xl" />
              </td>
            </tr>
          </tbody>
        </Table>
      </div>
      <div className="mt-2">
        <Button onClick={() => addOTHandler()}>Add OT</Button>
      </div>
    </>
  );
}
